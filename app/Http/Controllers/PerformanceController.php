<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Activity;
use App\ActivityType;
use App\Performance;
use App\Department;
use App\Target;
use App\Result;
use App\Report;
use App\Notification;
use App\Events\ReportSubmittedBroadCast;
use DB;
use Auth;
use Excel;
use Carbon\Carbon;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;

class PerformanceController extends Controller
{
    public function evaluation($date_start, $date_end, $daily_work_hours, $department_id, $project_id, $position_id, $member_id, $download)
    {
        $download = (int)$download;

        $this->member = DB::table('members')->where('id', $member_id)->first();

        $this->date_start = Carbon::parse($date_start);
        $this->date_end = Carbon::parse($date_end);

        $department_id = (int)$department_id;

        $this->department_id = $department_id ? $department_id : Auth::user()->department_id;
        
        $this->project = DB::table('projects')->where('id', $project_id)->first();
        $this->member->position = DB::table('positions')->where('id', $position_id)->first();

        $this->project->average_productivity = 0;
        $this->project->average_quality = 0;

        $overall_productivity = 0;
        $overall_quality = 0;
        $overall_count = 0;

        $this->member->position->total_hours_worked = 0;
        $this->member->position->total_output = 0;
        $this->member->position->total_output_error = 0;
        $this->member->position->total_average_output = 0;
        $this->member->position->productivity = 0;
        $this->member->position->quality = 0;

        $this->member->performances = Performance::with(['target' => function($query){ $query->withTrashed(); }])->where('member_id', $member_id)->where('position_id', $position_id)->whereBetween('date_start', [$this->date_start, $this->date_end])->where('daily_work_hours', 'like', $daily_work_hours.'%')->orderBy('date_start')->get();

        if(count($this->member->performances)){
            foreach ($this->member->performances as $performance_key => $performance) {
                $this->member->position->total_hours_worked += $performance->hours_worked;
                $this->member->position->total_output += $performance->output;
                $this->member->position->total_output_error += $performance->output_error;

                $performance->date_start = Carbon::parse($performance->date_start)->toFormattedDateString();
                $performance->date_end = Carbon::parse($performance->date_end)->toFormattedDateString();
            }

            $this->member->position->total_average_output = round($this->member->position->total_output / $this->member->position->total_hours_worked * $daily_work_hours, 2);

            $this->member->position->productivity = round($this->member->position->total_average_output / $this->member->performances[0]->target->productivity * 100);
            $this->member->position->quality = round((1 - $this->member->position->total_output_error / $this->member->position->total_output) * 100);

            if($this->member->position->productivity < $this->member->performances[0]->target->productivity && $this->member->position->quality >= $this->member->performances[0]->target->quality)
            {
                $this->member->position->quadrant = 'Quadrant 1'; 
            }
            else if($this->member->position->productivity >= $this->member->performances[0]->target->productivity && $this->member->position->quality >= $this->member->performances[0]->target->quality)
            {
                $this->member->position->quadrant = 'Quadrant 2'; 
            }
            else if($this->member->position->productivity >= $this->member->performances[0]->target->productivity && $this->member->position->quality < $this->member->performances[0]->target->quality)
            {
                $this->member->position->quadrant = 'Quadrant 3'; 
            }
            else if($this->member->position->productivity < $this->member->performances[0]->target->productivity && $this->member->position->quality < $this->member->performances[0]->target->quality)
            {
                $this->member->position->quadrant = 'Quadrant 4'; 
            }

            $overall_productivity += $this->member->position->productivity;
            $overall_quality += $this->member->position->quality;
            $overall_count++;
        }

        if($overall_count){
            $this->project->average_productivity = $overall_productivity / $overall_count;
            $this->project->average_quality = $overall_quality / $overall_count;
        }


        if($download)
        {
            Excel::create('Performance Evaluation of '. $this->member->full_name .' from '. $this->date_start->toFormattedDateString() .' to '. $this->date_end->toFormattedDateString() , function($excel){
                if($this->project->average_productivity && $this->project->average_quality){
                    $excel->sheet($this->project->name, function($sheet) {
                        $sheet->loadView('excel.performance-evaluation')
                            ->with('project', $this->project)
                            ->with('member', $this->member);
                    });
                }
            })->download('xls');
        }

        $this->member->project = $this->project;

        return response()->json($this->member);
    }

    public function evaluationMultiple($date_start, $date_end, $daily_work_hours, $department_id, $position_id, $member_id, $download)
    {
        $download = (int)$download;


        $this->member = DB::table('members')->where('id', $member_id)->first();
        $this->member->position = DB::table('positions')->where('id', $position_id)->first();
        $this->member->average_productivity = 0;
        $this->member->average_quality = 0;
        $this->member->count = 0;

        $this->date_start = Carbon::parse($date_start);
        $this->date_end = Carbon::parse($date_end);

        $this->department_id = (int)$department_id;

        $this->member->department = $this->department_id ? Department::with('projects')->where('id', $this->department_id)->first() : Department::with('projects')->where('id', Auth::user()->department_id)->first();

        foreach ($this->member->department->projects as $project_key => $project) {
            $project->positions = DB::table('positions')->where('project_id', $project->id)->where('name', $this->member->position->name)->get();
            
            if(count($project->positions)){
                $project->average_productivity = 0;
                $project->average_quality = 0;

                $overall_productivity = 0;
                $overall_quality = 0;
                $overall_count = 0;

                foreach ($project->positions as $position_key => $position) {
                    $position->total_hours_worked = 0;
                    $position->total_output = 0;
                    $position->total_output_error = 0;
                    $position->total_average_output = 0;
                    $position->productivity = 0;
                    $position->quality = 0;

                    $position->performances = Performance::with(['target' => function($query){ $query->withTrashed(); }])->where('member_id', $member_id)->where('position_id', $position->id)->whereBetween('date_start', [$this->date_start, $this->date_end])->where('daily_work_hours', 'like', $daily_work_hours.'%')->orderBy('date_start')->get();

                    if(count($position->performances)){
                        foreach ($position->performances as $performance_key => $performance) {
                            $position->total_hours_worked += $performance->hours_worked;
                            $position->total_output += $performance->output;
                            $position->total_output_error += $performance->output_error;

                            $performance->date_start = Carbon::parse($performance->date_start)->toFormattedDateString();
                            $performance->date_end = Carbon::parse($performance->date_end)->toFormattedDateString();
                        }

                        $position->total_average_output = round($position->total_output / $position->total_hours_worked * $daily_work_hours, 2);

                        $position->productivity = round($position->total_average_output / $position->performances[0]->target->productivity * 100);
                        $position->quality = round((1 - $position->total_output_error / $position->total_output) * 100);

                        if($position->productivity < $position->performances[0]->target->productivity && $position->quality >= $position->performances[0]->target->quality)
                        {
                            $position->quadrant = 'Quadrant 1'; 
                        }
                        else if($position->productivity >= $position->performances[0]->target->productivity && $position->quality >= $position->performances[0]->target->quality)
                        {
                            $position->quadrant = 'Quadrant 2'; 
                        }
                        else if($position->productivity >= $position->performances[0]->target->productivity && $position->quality < $position->performances[0]->target->quality)
                        {
                            $position->quadrant = 'Quadrant 3'; 
                        }
                        else if($position->productivity < $position->performances[0]->target->productivity && $position->quality < $position->performances[0]->target->quality)
                        {
                            $position->quadrant = 'Quadrant 4'; 
                        }

                        $overall_productivity += $position->productivity;
                        $overall_quality += $position->quality;
                        $overall_count++;
                    }
                }  

                if($overall_count){
                    $project->average_productivity = $overall_productivity / $overall_count;
                    $project->average_quality = $overall_quality / $overall_count;

                    $this->member->average_productivity += $project->average_productivity;
                    $this->member->average_quality += $project->average_quality;
                    $this->member->count++;
                }      
            }
        }

        if($download)
        {
            Excel::create('Performance Evaluation of '. $this->member->full_name .' from '. $this->date_start->toFormattedDateString() .' to '. $this->date_end->toFormattedDateString() , function($excel){
                foreach ($this->member->department->projects as $project_key => $project) {
                    $this->project = $project;
                    if($project->average_productivity && $project->average_quality){
                        $excel->sheet($project->name, function($sheet) {
                            $sheet->loadView('excel.performance-evaluation-multiple')
                                ->with('project', $this->project)
                                ->with('member', $this->member);
                        });
                    }
                }
            })->download('xls');
        }

        $this->member->average_productivity = $this->member->average_productivity / $this->member->count;
        $this->member->average_quality = $this->member->average_quality / $this->member->count;

        return response()->json($this->member);
    }

    public function getMondays(Request $request)
    {
        $this->validate($request, [
            'date_start_month' => 'required',
            'date_start_year' => 'required',
        ]);

        $date_start = Carbon::parse('first Monday of '.$request->date_start_month. ' '.$request->date_start_year);
        $last_monday = Carbon::parse('last Monday of '.$request->date_start_month. ' '.$request->date_start_year);
        $today = Carbon::today();

        // date end is last monday of the month is today is greater
        $date_end = $last_monday->lte($today) ? $last_monday : $today;

        $performance = DB::table('users')->where('id', $request->user()->id)->first();
        $performance->mondays = array();
        $performance->day = array();

        for ($i=$date_start; $i->lte($date_end); $i->addWeek()) { 
            array_push($performance->mondays, $i->toDateTimeString());
            array_push($performance->day, $i->day);
        }

        return response()->json($performance);
    }

    public function getWeekends(Request $request)
    {
        $this->validate($request, [
            'date_start' => 'required',
        ]);

        $date_start = Carbon::parse($request->date_start);

        $performance = DB::table('users')->where('id', $request->user()->id)->first();
        $performance->weekends = array();
        $performance->day = array();

        array_push($performance->weekends, $date_start->addDays(4)->toDateTimeString());
        array_push($performance->day, $date_start->toFormattedDateString());
        array_push($performance->weekends, Carbon::parse($date_start)->addDay()->toDateTimeString());
        array_push($performance->day, Carbon::parse($date_start)->addDay()->toFormattedDateString());

        return response()->json($performance);
    }

    public function weekly(Request $request)
    {   
        $date_start = Carbon::parse($request->date_start);
        $date_end = Carbon::parse($request->date_end);
        
        $member = DB::table('members')->where('id', $request->member_id)->first();
        $member->position = DB::table('positions')->where('id', $request->position_id)->first();
        $member->positions = DB::table('positions')->where('department_id', $request->department_id)->get();

        $overall_weekly_productivity = 0;
        $overall_weekly_quality = 0;
        $overall_count = 0;

        foreach ($member->positions as $position_key => $position) {
            $position->performances = Performance::with('project', 'position')->with(['target' => function($query){ $query->withTrashed(); }])->with(['member' => function($query){ $query->with(['experiences' => function($query){ $query->with('project'); }]);}])->where('position_id', $position->id)->where('member_id', $request->member_id)->whereBetween('date_start', [$date_start, $date_end])->get();

            if(count($position->performances)){
                $position->total_hours_worked = 0;
                $position->total_output = 0;
                $position->total_output_error = 0;
                $position->total_average_output = 0;
                $position->weekly_productivity = 0;
                $position->weekly_quality = 0;

                foreach ($position->performances as $performance_key => $performance) {
                    $position->total_hours_worked += $performance->hours_worked;
                    $position->total_output += $performance->output;
                    $position->total_output_error += $performance->output_error;
                }

                $position->total_average_output = $position->total_output / $position->total_hours_worked * $position->performances[0]->daily_work_hours;
                $position->weekly_productivity = round($position->total_average_output / $position->performances[0]->target->productivity * 100);
                $position->weekly_quality = round((1 - $position->total_output_error / $position->total_output) * 100);

                if($position->weekly_productivity < $position->performances[0]->target->productivity && $position->weekly_quality >= $position->performances[0]->target->quality)
                {
                    $position->quadrant = 'Quadrant 1'; 
                }
                else if($position->weekly_productivity >= $position->performances[0]->target->productivity && $position->weekly_quality >= $position->performances[0]->target->quality)
                {
                    $position->quadrant = 'Quadrant 2'; 
                }
                else if($position->weekly_productivity >= $position->performances[0]->target->productivity && $position->weekly_quality < $position->performances[0]->target->quality)
                {
                    $position->quadrant = 'Quadrant 3'; 
                }
                else if($position->weekly_productivity < $position->performances[0]->target->productivity && $position->weekly_quality < $position->performances[0]->target->quality)
                {
                    $position->quadrant = 'Quadrant 4'; 
                }

                if($position->name == $request->position){
                    $overall_weekly_productivity += $position->weekly_productivity;
                    $overall_weekly_quality += $position->weekly_quality;
                    $overall_count++;
                }
            }
        }

        if($overall_count){
            $member->average_productivity = $overall_weekly_productivity / $overall_count;
            $member->average_quality = $overall_weekly_quality / $overall_count;
        }
        
        return response()->json($member);
    }

    public function monthly(Request $request)
    {   
        $date_start = Carbon::parse($request->date_start);
        $date_end = Carbon::parse($request->date_end);

        $member = DB::table('members')->where('id', $request->member_id)->first();

        $member->positions = DB::table('positions')->where('project_id', $request->project_id)->get();

        $overall_monthly_productivity = 0;
        $overall_monthly_quality = 0;
        $overall_count = 0;

        foreach ($member->positions as $position_key => $position) {
            $position->performances = Performance::with('project', 'position')->with(['target' => function($query){ $query->withTrashed(); }])->with(['member' => function($query){ $query->with(['experiences' => function($query){ $query->with('project'); }]);}])->where('position_id', $position->id)->where('member_id', $request->member_id)->whereBetween('date_start', [$date_start, $date_end])->get();

            if(count($position->performances)){
                $position->total_hours_worked = 0;
                $position->total_output = 0;
                $position->total_output_error = 0;
                $position->total_average_output = 0;
                $position->monthly_productivity = 0;
                $position->monthly_quality = 0;

                foreach ($position->performances as $performance_key => $performance) {
                    $position->total_hours_worked += $performance->hours_worked;
                    $position->total_output += $performance->output;
                    $position->total_output_error += $performance->output_error;
                }

                $position->total_average_output = $position->total_output / $position->total_hours_worked * $position->performances[0]->daily_work_hours;
                $position->monthly_productivity = round($position->total_average_output / $position->performances[0]->target->productivity * 100);
                $position->monthly_quality = round((1 - $position->total_output_error / $position->total_output) * 100);

                if($position->monthly_productivity < $position->performances[0]->target->productivity && $position->monthly_quality >= $position->performances[0]->target->quality)
                {
                    $position->quadrant = 'Quadrant 1'; 
                }
                else if($position->monthly_productivity >= $position->performances[0]->target->productivity && $position->monthly_quality >= $position->performances[0]->target->quality)
                {
                    $position->quadrant = 'Quadrant 2'; 
                }
                else if($position->monthly_productivity >= $position->performances[0]->target->productivity && $position->monthly_quality < $position->performances[0]->target->quality)
                {
                    $position->quadrant = 'Quadrant 3'; 
                }
                else if($position->monthly_productivity < $position->performances[0]->target->productivity && $position->monthly_quality < $position->performances[0]->target->quality)
                {
                    $position->quadrant = 'Quadrant 4'; 
                }

                $overall_monthly_productivity += $position->monthly_productivity;
                $overall_monthly_quality += $position->monthly_quality;
                $overall_count++;
            }
        }

        if($overall_count){
            $member->average_productivity = $overall_monthly_productivity / $overall_count;
            $member->average_quality = $overall_monthly_quality / $overall_count;
        }
        
        return response()->json($member);
    }
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
        return Performance::with(['member' => function($query){ $query->with('experiences'); }])->with('project', 'target')->where('report_id', $reportID)->get();

        // return DB::table('performances')
        //     ->join('members', 'members.id', '=', 'performances.member_id')
        //     ->join('projects', 'projects.id', '=', 'performances.project_id')
        //     ->select(
        //         '*',
        //         'performances.id as performance_id',
        //         'projects.name as project_name',
        //         DB::raw('TRUNCATE(performances.daily_work_hours, 1) as daily_work_hours'),
        //         DB::raw('UPPER(LEFT(members.full_name, 1)) as first_letter'),
        //         DB::raw('UPPER(LEFT(projects.name, 1)) as first_letter'),
        //         'performances.id as performance_id',
        //         'members.id as member_id'
        //     )
        //     ->whereNull('performances.deleted_at')
        //     ->where('performances.report_id', $reportID)
        //     ->get();
    }
    public function checkLimitEdit(Request $request, $memberID)
    {
        $date_start = Carbon::parse($request->date_start);
        $date_end = Carbon::parse($request->date_end);

        // fetch all records with the same report details
        $performance = Performance::where('date_start', $date_start)->whereBetween('date_end', [$date_start, $date_end])->where('daily_work_hours', 'like', $request->daily_work_hours.'%')->where('member_id', $memberID)->orderBy('created_at', 'desc')->get();
        
        // if($performance->count() == 1)
        // {
        //     return $request->weekly_hours;
        // }

        $hours_worked = 0;

        // iterate every record to check the total of hours worked by the employee
        foreach ($performance as $key => $value) {
            $hours_worked += $value->hours_worked;
            // if already limit
            if($request->weekly_hours == round($hours_worked,1))
            {
                return $request->current_hours_worked;
            }
        }

        $limit = $request->weekly_hours - $hours_worked + $request->current_hours_worked;

        return round($limit,1);
    }
    public function checkLimit(Request $request, $memberID)
    {
        $date_start = $request->date_start;
        $date_end = $request->date_end;

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
            ->whereNull('performances.deleted_at')
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
            ->whereNull('performances.deleted_at')
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
                    $i.'.member.id' => 'required|numeric',
                    $i.'.position_id' => 'required|numeric',
                    // $i.'.department_id' => 'required|numeric',
                    $i.'.project_id' => 'required|numeric',
                    $i.'.target_id' => 'required|numeric',
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
                    $admin = User::where('role', 'admin')->first();
                    $report = new Report;

                    $report->user_id = $request->user()->id;
                    $report->department_id = $request->user()->department_id;
                    $report->project_id = $request->input($i.'.project_id');
                    $report->daily_work_hours = $request->input($i.'.daily_work_hours');
                    $report->date_start = $request->input($i.'.date_start');
                    $report->date_end = $request->input($i.'.date_end');

                    $report->save();

                    // create a notification
                    $notification = new Notification;

                    $notification->message = 'submitted a ';
                    $notification->sender_user_id = $request->user()->id;
                    $notification->receiver_user_id = $admin->id;
                    $notification->subscriber = 'admin';
                    $notification->state = 'main.weekly-report';
                    $notification->event_id = $report->id;
                    $notification->event_id_type = 'report_id';
                    $notification->seen = false;

                    $notification->save();

                    $notify = DB::table('reports')
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
                        ->where('notifications.id', $notification->id)
                        ->first();

                    // foreach ($query as $key => $value) {
                    //     $notify = $value;
                    // }

                    event(new ReportSubmittedBroadCast($notify)); 

                    $activity_type = ActivityType::where('action', 'create')->first();

                    $activity = new Activity;

                    $activity->report_id = $report->id;
                    $activity->user_id = $request->user()->id;
                    $activity->activity_type_id = $activity_type->id;

                    $activity->save();

                    // report 
                    $create_report = true;
                }

                // $target = Target::where('position_id', $request->input($i.'.position_id'))->where('experience', $request->input($i.'.experience'))->first();
                $target = Target::withTrashed()->where('id', $request->input($i.'.target_id'))->first();

                $performance = new Performance;

                $performance->report_id = $report->id;
                $performance->member_id = $request->input($i.'.member.id');
                $performance->position_id = $request->input($i.'.position_id');
                $performance->department_id = $request->user()->department_id;
                $performance->project_id = $request->input($i.'.project_id');
                $performance->target_id = $target->id;
                $performance->output = $request->input($i.'.output');
                $performance->date_start = $request->input($i.'.date_start');
                $performance->date_end = $request->input($i.'.date_end');
                $performance->hours_worked = $request->input($i.'.hours_worked');
                $performance->daily_work_hours = $request->input($i.'.daily_work_hours');
                $performance->output_error = $request->input($i.'.output_error');
                // Round((Output / Hours Worked) * Daily Work Hours)
                // store the rounded value
                $performance->average_output = round($request->input($i.'.output') / $request->input($i.'.hours_worked') * $request->input($i.'.daily_work_hours'), 2);
                // average output / target output * 100 to convert to percentage
                $performance->productivity = round($performance->average_output / $target->productivity * 100, 1);
                // 1 - output w/error / output * 100 to convert to percentage
                $performance->quality = round((1 - $performance->output_error / $performance->output) * 100, 1);

                // Quadrant
                if($performance->productivity < 100 && $performance->quality >= $target->quality)
                {
                    $performance->quadrant = 'Quadrant 1'; 
                }
                else if($performance->productivity >= 100 && $performance->quality >= $target->quality)
                {
                    $performance->quadrant = 'Quadrant 2'; 
                }
                else if($performance->productivity >= 100 && $performance->quality < $target->quality)
                {
                    $performance->quadrant = 'Quadrant 3'; 
                }
                else if($performance->productivity < 100 && $performance->quality < $target->quality)
                {
                    $performance->quadrant = 'Quadrant 4'; 
                }

                // $performance->type = "weekly";
                $performance->save();
                // fetch target
                // $productivity = Target::where('type', 'Productivity')->where('position_id', $request->input($i.'.position_id'))->where('experience', $request->input($i.'.experience'))->where('created_at', '<=', $request->input($i.'.date_end'))->orderBy('created_at', 'desc')->first();

                // if(!$productivity)
                // {
                //      $productivity = Target::where('type', 'Productivity')->where('position_id', $request->input($i.'.position_id'))->where('experience', $request->input($i.'.experience'))->first();
                // }

                // $quality = Target::where('type', 'Quality')->where('position_id', $request->input($i.'.position_id'))->where('experience', $request->input($i.'.experience'))->where('created_at', '<=', $request->input($i.'.date_end'))->orderBy('created_at', 'desc')->first();

                // if(!$quality)
                // {
                //      $quality = Target::where('type', 'Quality')->where('position_id', $request->input($i.'.position_id'))->where('experience', $request->input($i.'.experience'))->first();
                // }

                // $performance->productivity_id = $productivity->id;
                // $performance->quality_id = $quality->id;
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
                    $i.'.position_id' => 'required',
                    // $i.'.department_id' => 'required|numeric',
                    $i.'.target_id' => 'required|numeric',
                    $i.'.output' => 'required|numeric',
                    // $i.'.date_start' => 'required|date',
                    // $i.'.date_end' => 'required|date',
                    $i.'.hours_worked' => 'required|numeric',
                    $i.'.daily_work_hours' => 'required|numeric',
                    $i.'.output_error' => 'required|numeric',
                ]);

                // $target = Target::where('position_id', $request->input($i.'.position_id'))->where('experience', $request->input($i.'.experience'))->first();
                $target = Target::withTrashed()->where('id', $request->input($i.'.target_id'))->first();

                $performance = Performance::where('id', $request->input($i.'.id'))->first();

                $performance->position_id = $request->input($i.'.position_id');
                // $performance->project_id = $request->input($i.'.project_id');
                $performance->output = $request->input($i.'.output');
                // $performance->date_start = $request->input($i.'.date_start');
                // $performance->date_end = $request->input($i.'.date_end');
                $performance->hours_worked = $request->input($i.'.hours_worked');
                // $performance->daily_work_hours = $request->input($i.'.daily_work_hours');
                $performance->output_error = $request->input($i.'.output_error');
                // Round((Output / Hours Worked) * Daily Work Hours)
                // store the rounded value
                $performance->average_output = $request->input($i.'.output') / $request->input($i.'.hours_worked') * $request->input($i.'.daily_work_hours');
                // average output / target output * 100 to convert to percentage
                $performance->productivity = round($performance->average_output / $target->productivity * 100);
                // 1 - output w/error / output * 100 to convert to percentage
                $performance->quality = round((1 - $performance->output_error / $performance->output) * 100);
                
                if($performance->productivity < 100 && $performance->quality >= $target->quality)
                {
                    $performance->quadrant = 'Quadrant 1'; 
                }
                else if($performance->productivity >= 100 && $performance->quality >= $target->quality)
                {
                    $performance->quadrant = 'Quadrant 2'; 
                }
                else if($performance->productivity >= 100 && $performance->quality < $target->quality)
                {
                    $performance->quadrant = 'Quadrant 3'; 
                }
                else if($performance->productivity < 100 && $performance->quality < $target->quality)
                {
                    $performance->quadrant = 'Quadrant 4'; 
                }

                // $performance->type = "weekly";
                // $performance->performance_id = $request->input($i.'.performance_id');
                // save performance to database
                $performance->save();
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
