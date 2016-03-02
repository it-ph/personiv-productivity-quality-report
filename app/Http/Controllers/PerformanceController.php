<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Performance;
use App\Target;
use App\Result;
use App\Report;
use App\Notification;
use App\Events\ReportSubmittedBroadCast;
use DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PerformanceController extends Controller
{
    public function topPerformers($report_id)
    {
        $performance_array = array();

        $positions = DB::table('reports')
            ->join('performances', 'performances.report_id', '=', 'reports.id')
            ->join('positions', 'positions.id', '=', 'performances.position_id')
            ->select('positions.*')
            ->where('reports.id', $report_id)
            ->groupBy('positions.id')
            ->get();

        foreach ($positions as $key => $value) {
            $performance = DB::table('reports')
                ->join('performances', 'performances.report_id', '=', 'reports.id')
                ->join('results', 'results.performance_id', '=', 'performances.id')
                ->join('positions', 'positions.id', '=', 'performances.position_id')
                ->join('projects', 'projects.id', '=', 'reports.project_id')
                ->join('members', 'members.id', '=', 'performances.member_id')
                ->select(
                    'members.*',
                    'performances.*',
                    DB::raw('DATE_FORMAT(performances.date_start, "%b. %d, %Y") as date_start'),
                    DB::raw('DATE_FORMAT(performances.date_end, "%b. %d, %Y") as date_end'),
                    'results.*',
                    'projects.*',
                    'projects.name as project',
                    'positions.name as position'
                )
                ->where('reports.id', $report_id)
                ->where('positions.id', $value->id)
                ->orderBy('results.productivity', 'desc')
                ->orderBy('results.quality', 'desc')
                ->first();

            array_push($performance_array, $performance);
        }

        return $performance_array;
    }
    public function report($reportID)
    {
        return DB::table('performances')
            ->join('members', 'members.id', '=', 'performances.member_id')
            ->join('projects', 'projects.id', '=', 'performances.project_id')
            ->select(
                '*',
                'projects.name as project_name',
                DB::raw('TRUNCATE(performances.daily_work_hours, 1) as daily_work_hours'),
                DB::raw('UPPER(LEFT(members.full_name, 1)) as first_letter'),
                DB::raw('UPPER(LEFT(projects.name, 1)) as first_letter'),
                'performances.id as performance_id',
                'members.id as member_id'
            )
            ->where('performances.report_id', $reportID)
            ->get();
    }
    public function checkLimitEdit(Request $request, $memberID)
    {
        $date_start = date_create($request->date_start)->format("Y-m-d");
        $date_end = date_create($request->date_end)->format("Y-m-d");

        // fetch all records with the same report details
        $performance = Performance::where('date_start', $date_start)->whereBetween('date_end', [$date_start, $date_end])->where('daily_work_hours', 'like', $request->daily_work_hours.'%')->where('member_id', $memberID)->get();
        
        if($performance->count() == 1)
        {
            return $request->weekly_hours;
        }

        $hours_worked = 0;

        // iterate every record to check the total of hours worked by the employee
        foreach ($performance as $key => $value) {
            $hours_worked += $value->hours_worked;
            
            if($request->weekly_hours == round($hours_worked,1))
            {
                return Performance::where('id', $value->id)->first()->hours_worked;
            }
        }

        $limit = $request->weekly_hours - $hours_worked;

        return round($limit,1);
    }
    public function checkLimit(Request $request, $memberID)
    {
        $date_start = date_create($request->date_start)->format("Y-m-d");
        $date_end = date_create($request->date_end)->format("Y-m-d");

        // fetch all records with the same report details
        $performance = Performance::where('date_start', $date_start)->whereBetween('date_end', [$date_start, $date_end])->where('daily_work_hours', 'like', $request->daily_work_hours.'%')->where('member_id', $memberID)->orderBy('created_at', 'desc')->get();
        
        $hours_worked = 0;

        // iterate every record to check the total of hours worked by the employee
        foreach ($performance as $key => $value) {
            $hours_worked += $value->hours_worked;
        }

        $limit = $request->weekly_hours - $hours_worked;

        return round($limit,1);
    }
    public function paginateDepartment($department_id)
    {
        return DB::table('performances')
            ->join('members', 'members.id', '=', 'performances.member_id')
            ->select(
                'performances.*',
                'members.*',
                'performances.id as performance_id',
                'members.id as member_id',
                DB::raw('UPPER(LEFT(members.full_name, 1)) as first_letter'),
                DB::raw('DATE_FORMAT(performances.created_at, "%h:%i %p, %b. %d, %Y") as created_at')
            )
            ->where('performances.department_id', $department_id)
            ->orderBy('performances.updated_at', 'desc')
            ->paginate(10);
    }

    public function paginate()
    {
        return DB::table('performances')
            ->join('members', 'members.id', '=', 'performances.member_id')
            ->select(
                'performances.*',
                'members.*',
                'performances.id as performance_id',
                'members.id as member_id',
                DB::raw('UPPER(LEFT(members.full_name, 1)) as first_letter'),
                DB::raw('DATE_FORMAT(performances.created_at, "%h:%i %p, %b. %d, %Y") as created_at')
            )
            ->orderBy('performances.updated_at', 'desc')
            ->paginate(10);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $create_report = false;
        for ($i=0; $i < count($request->all()); $i++) { 
            if($request->input($i.'.include'))
            {
                $this->validate($request, [
                    $i.'.id' => 'required|numeric',
                    $i.'.position_id' => 'required|numeric',
                    $i.'.department_id' => 'required|numeric',
                    $i.'.project_id' => 'required|numeric',
                    $i.'.output' => 'required|numeric',
                    $i.'.date_start' => 'required|date',
                    $i.'.date_end' => 'required|date',
                    $i.'.hours_worked' => 'required|numeric',
                    $i.'.daily_work_hours' => 'required|numeric',
                    $i.'.output_error' => 'required|numeric',
                ]);

                // check if a report is already created
                if(!$create_report)
                {
                    $report = new Report;

                    $report->user_id = $request->user()->id;
                    $report->department_id = $request->input($i.'.department_id');
                    $report->project_id = $request->input($i.'.project_id');
                    $report->daily_work_hours = $request->input($i.'.daily_work_hours');
                    $report->date_start = $request->input($i.'.date_start');
                    $report->date_end = $request->input($i.'.date_end');

                    $report->save();

                    // create a notification
                    $notification = new Notification;

                    $notification->message = 'submitted a ';
                    $notification->state = 'main.departments';
                    $notification->event_id = $report->id;
                    $notification->seen = false;

                    $notification->save();

                    $query = DB::table('reports')
                        ->join('users', 'users.id', '=', 'reports.user_id')
                        ->join('projects', 'projects.id', '=', 'reports.project_id')
                        ->join('notifications', 'notifications.event_id', '=', 'reports.id')
                        ->select(
                            'reports.*',
                            'users.*',
                            DB::raw('LEFT(users.first_name, 1) as first_letter'),
                            'projects.*',
                            'notifications.*'
                        )
                        ->where('notifications.event_id', $report->id)
                        ->get();

                    foreach ($query as $key => $value) {
                        $notify = $value;
                    }

                    event(new ReportSubmittedBroadCast($notify)); 
                    // report 
                    $create_report = true;
                }

                $performance = new Performance;

                $performance->report_id = $report->id;
                $performance->member_id = $request->input($i.'.id');
                $performance->position_id = $request->input($i.'.position_id');
                $performance->department_id = $request->input($i.'.department_id');
                $performance->project_id = $request->input($i.'.project_id');
                $performance->output = $request->input($i.'.output');
                $performance->date_start = $request->input($i.'.date_start');
                $performance->date_end = $request->input($i.'.date_end');
                $performance->hours_worked = $request->input($i.'.hours_worked');
                $performance->daily_work_hours = $request->input($i.'.daily_work_hours');
                $performance->output_error = $request->input($i.'.output_error');
                // Round((Output / Hours Worked) * Daily Work Hours)
                // store the rounded value
                $performance->average_output = $request->input($i.'.output') / $request->input($i.'.hours_worked') * $request->input($i.'.daily_work_hours');
                // save performance to database
                $performance->save();

                // fetch target
                $target = Target::where('position_id', $request->input($i.'.position_id'))->where('experience', $request->input($i.'.experience'))->first();

                $result = new Result;
                $result->report_id = $report->id;
                // average output / target output * 100 to convert to percentage
                $result->productivity = round($performance->average_output / $target->value * 100);
                // 1 - output w/error / output * 100 to convert to percentage
                $result->quality = round((1 - $performance->output_error / $performance->output) * 100);
                $result->type = "weekly";
                $result->performance_id = $performance->id;

                $result->save();

                $performance->result_id = $result->id;
                $performance->save();

            }
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        for ($i=0; $i < count($request->all()); $i++) { 
            if($request->input($i.'.include'))
            {
                $this->validate($request, [
                    $i.'.id' => 'required|numeric',
                    $i.'.position_id' => 'required|numeric',
                    $i.'.department_id' => 'required|numeric',
                    $i.'.project_id' => 'required|numeric',
                    $i.'.output' => 'required|numeric',
                    $i.'.date_start' => 'required|date',
                    $i.'.date_end' => 'required|date',
                    $i.'.hours_worked' => 'required|numeric',
                    $i.'.daily_work_hours' => 'required|numeric',
                    $i.'.output_error' => 'required|numeric',
                ]);

                $performance = Performance::where('id', $request->input($i.'.performance_id'))->first();

                $performance->position_id = $request->input($i.'.position_id');
                $performance->project_id = $request->input($i.'.project_id');
                $performance->output = $request->input($i.'.output');
                $performance->date_start = $request->input($i.'.date_start');
                $performance->date_end = $request->input($i.'.date_end');
                $performance->hours_worked = $request->input($i.'.hours_worked');
                $performance->daily_work_hours = $request->input($i.'.daily_work_hours');
                $performance->output_error = $request->input($i.'.output_error');
                // Round((Output / Hours Worked) * Daily Work Hours)
                // store the rounded value
                $performance->average_output = $request->input($i.'.output') / $request->input($i.'.hours_worked') * $request->input($i.'.daily_work_hours');

                // save performance to database
                $performance->save();

                // fetch target
                $target = Target::where('position_id', $request->input($i.'.position_id'))->where('experience', $request->input($i.'.experience'))->first();

                $result = Result::where('id', $request->input($i.'.result_id'))->first();
                
                $result->report_id = $id;
                // average output / target output * 100 to convert to percentage
                $result->productivity = round($performance->average_output / $target->value * 100);
                // 1 - output w/error / output * 100 to convert to percentage
                $result->quality = round((1 - $performance->output_error / $performance->output) * 100);
                $result->type = "weekly";
                $result->performance_id = $request->input($i.'.performance_id');

                $result->save();
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
