<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Approval;
use App\Report;
use App\Target;
use App\Result;
use App\Events\ReportSubmittedBroadCast;
use App\Notification;
use App\PerformanceApproval;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ApprovalController extends Controller
{
    public function disapprove($id)
    {

    }
    public function performanceEditApproved($id)
    {
        $performance_approval = DB::table('performance_approval')
            ->join('members', 'members.id', '=', 'performance_approval.member_id')
            ->where('performance_approval.approval_id', $id)
            ->first();

        // fetch target
        $target = Target::where('position_id', $performance_approval->position_id)->where('experience', $performance_approval->experience)->first();

        $result = Result::where('id', $performance_approval->result_id)->first();
        
        // average output / target output * 100 to convert to percentage
        $result->productivity = round($performance_approval->average_output / $target->value * 100);
        // 1 - output w/error / output * 100 to convert to percentage
        $result->quality = round((1 - $performance_approval->output_error / $performance_approval->output) * 100);
        // $result->type = "weekly";

        $result->save();

        $performance_approval->result_id = $result->id;
        $performance_approval->save();

        // create notificaation here
    }
    public function performanceEdit(Request $request, $reportID)
    {
        $create_notification = false;
        for ($i=0; $i < count($request->all()); $i++) { 
            if($request->input($i.'.include'))
            {
                $this->validate($request, [
                    $i.'.performance_id' => 'required|numeric',
                    $i.'.result_id' => 'required|numeric',
                    $i.'.position_id' => 'required|numeric',
                    $i.'.department_id' => 'required|numeric',
                    $i.'.project_id' => 'required|numeric',
                    $i.'.output' => 'required|numeric',
                    $i.'.experience' => 'required',
                    $i.'.date_start' => 'required|date',
                    $i.'.date_end' => 'required|date',
                    $i.'.hours_worked' => 'required|numeric',
                    $i.'.daily_work_hours' => 'required|numeric',
                    $i.'.output_error' => 'required|numeric',
                    $i.'.message' => 'required',
                ]);

                $approval = new Approval;

                $approval->type = 'update weekly performance record';
                $approval->message = $request->input($i.'.message');
                $approval->performance_id = $request->input($i.'.performance_id');
                $approval->approved = false;
                $approval->save();

                $performance_approval = new PerformanceApproval;

                $performance_approval->approval_id = $approval->id;
                $performance_approval->report_id = $reportID;
                $performance_approval->member_id = $request->input($i.'.id');
                $performance_approval->position_id = $request->input($i.'.position_id');
                $performance_approval->department_id = $request->input($i.'.department_id');
                $performance_approval->project_id = $request->input($i.'.project_id');
                $performance_approval->output = $request->input($i.'.output');
                $performance_approval->date_start = $request->input($i.'.date_start');
                $performance_approval->date_end = $request->input($i.'.date_end');
                $performance_approval->hours_worked = $request->input($i.'.hours_worked');
                $performance_approval->daily_work_hours = $request->input($i.'.daily_work_hours');
                $performance_approval->output_error = $request->input($i.'.output_error');

                // Round((Output / Hours Worked) * Daily Work Hours)
                // store the rounded value
                $performance_approval->average_output = $request->input($i.'.output') / $request->input($i.'.hours_worked') * $request->input($i.'.daily_work_hours');

                // save performance request to database
                $performance_approval->save();

                if(!$create_notification)
                {
                    $report = Report::where('id', $request->input($i.'.report_id'))->first();

                    $report->user_id = $request->user()->id;

                    $report->save();

                    // create a notification
                    $notification = new Notification;

                    $notification->message = 'updates ';
                    $notification->state = 'main.approvals';
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

                    event(new ReportSubmittedBroadCast($notify)); 
                    // report 
                    $create_notification = true;
                }
            }
        }
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
        //
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
        //
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
