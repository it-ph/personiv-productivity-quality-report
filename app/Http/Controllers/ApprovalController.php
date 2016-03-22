<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Approval;
use App\Report;
use App\Target;
use App\Result;
use App\Events\ReportSubmittedBroadCast;
use App\Events\ApprovalNotificationBroadCast;
use App\Notification;
use App\Performance;
use App\PerformanceApproval;
use App\PerformanceHistory;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;

class ApprovalController extends Controller
{
    public function decline(Request $request)
    {
        $create_notification = false;
        $pending_count = count($request->all());
        for ($i=0; $i < count($request->all()); $i++) {
            if($request->input($i.'.include')){
                $pending_count--;
                $this->validate($request, [
                    $i.'.approval_id' => 'required|numeric',
                    $i.'.performance_approval_id' => 'required|numeric',
                    $i.'.performance_id' => 'required|numeric',
                ]);
                if(!$create_notification)
                {
                    $admin = User::where('email', 'sherryl.sanchez@personiv.com')->first();
                    $report = Report::where('id', $request->input($i.'.report_id'))->first();

                    $notification = new Notification;
                    $notification->receiver_user_id = $report->user_id;
                    $notification->sender_user_id = $admin->id;
                    $notification->subscriber = 'team-leader';
                    $notification->message = 'declined changes on';
                    $notification->state = 'main.approvals';
                    $notification->event_id = $request->input($i.'.approval_id');
                    $notification->event_id_type = 'approval_id';
                    $notification->seen = false;
                    $notification->save();

                    $notify = DB::table('notifications')
                        ->join('approvals', 'approvals.id', '=', 'notifications.event_id')
                        ->join('reports', 'reports.id', '=', 'approvals.report_id')
                        ->join('projects', 'projects.id', '=', 'reports.project_id')
                        ->join('users', 'users.id', '=', 'notifications.sender_user_id')
                        ->select(
                            '*',
                            DB::raw('LEFT(users.first_name, 1) as first_letter')
                        )
                        ->where('notifications.id', $notification->id)
                        ->first();

                    event(new ApprovalNotificationBroadCast($notify)); 
                    // report 
                    $create_notification = true;
                }

                $performance_approval = PerformanceApproval::where('id', $request->input($i.'.performance_approval_id'))->first();
                $performance_approval->status = 'declined';
                $performance_approval->save();
            }
        }
        if(!$pending_count)
        {
            $approval = Approval::where('id', $request->input('0.approval_id'))->first();
            $approval->status = 'done';
            $approval->save();
        }
    }
    public function approve(Request $request)
    {
        $create_notification = false;
        $pending_count = count($request->all());
        for ($i=0; $i < count($request->all()); $i++) {
            if($request->input($i.'.include')){
                $pending_count--;
                $this->validate($request, [
                    $i.'.approval_id' => 'required|numeric',
                    $i.'.performance_approval_id' => 'required|numeric',
                    $i.'.performance_id' => 'required|numeric',
                ]);

                if(!$create_notification)
                {
                    $admin = User::where('email', 'sherryl.sanchez@personiv.com')->first();
                    $report = Report::where('id', $request->input($i.'.report_id'))->first();

                    $notification = new Notification;
                    $notification->receiver_user_id = $report->user_id;
                    $notification->sender_user_id = $admin->id;
                    $notification->subscriber = 'team-leader';
                    $notification->message = 'approved changes on';
                    $notification->state = 'main.approvals';
                    $notification->event_id = $request->input($i.'.approval_id');
                    $notification->event_id_type = 'approval_id';
                    $notification->seen = false;
                    $notification->save();

                    $notify = DB::table('notifications')
                        ->join('approvals', 'approvals.id', '=', 'notifications.event_id')
                        ->join('reports', 'reports.id', '=', 'approvals.report_id')
                        ->join('projects', 'projects.id', '=', 'reports.project_id')
                        ->join('users', 'users.id', '=', 'notifications.sender_user_id')
                        ->select(
                            '*',
                            DB::raw('LEFT(users.first_name, 1) as first_letter')
                        )
                        ->where('notifications.id', $notification->id)
                        ->first();

                    event(new ApprovalNotificationBroadCast($notify)); 
                    // report 
                    $create_notification = true;
                }

                $old_performance = Performance::where('id', $request->input($i.'.performance_id'))->first();
                // record history of the performance
                $performance_history = new PerformanceHistory;
                
                $performance_history->performance_id = $old_performance->id;
                $performance_history->report_id = $old_performance->report_id;
                $performance_history->member_id = $old_performance->member_id;
                $performance_history->position_id = $old_performance->position_id;
                $performance_history->department_id = $old_performance->department_id;
                $performance_history->project_id = $old_performance->project_id;
                $performance_history->date_start = $old_performance->date_start;
                $performance_history->date_end = $old_performance->date_end;
                $performance_history->daily_work_hours = $old_performance->daily_work_hours;
                $performance_history->output = $old_performance->output;
                $performance_history->hours_worked = $old_performance->hours_worked;
                $performance_history->output_error = $old_performance->output_error;
                $performance_history->average_output = $old_performance->average_output;

                $performance_history->save();

                $performance_approval_approved = PerformanceApproval::where('id', $request->input($i.'.performance_approval_id'))->first();
                $performance_approval_approved->status = 'approved';
                $performance_approval_approved->save();

                // fetch the changes 
                $performance_approval = DB::table('performance_approvals')
                    ->join('members', 'members.id', '=', 'performance_approvals.member_id')
                    ->where('performance_approvals.id', $request->input($i.'.performance_approval_id'))
                    ->first();

                $performance = Performance::where('id', $request->input($i.'.performance_id'))->first();
                // apply changes
                $performance->position_id = $performance_approval->position_id;
                $performance->hours_worked = $performance_approval->hours_worked;
                $performance->output = $performance_approval->output;
                $performance->output_error = $performance_approval->output_error;
                // Round((Output / Hours Worked) * Daily Work Hours)
                $performance->average_output = round($performance_approval->output / $performance_approval->hours_worked * $performance_approval->daily_work_hours, 2);
                // save performance to database
                $performance->save();

                // fetch target
                $target = Target::where('position_id', $performance_approval->position_id)->where('experience', $performance_approval->experience)->first();
                // recompute results
                $result = Result::where('id', $performance_approval->result_id)->first();
                
                // average output / target output * 100 to convert to percentage
                $result->productivity = round($performance_approval->average_output / $target->value * 100, 1);
                // 1 - output w/error / output * 100 to convert to percentage
                $result->quality = round((1 - $performance_approval->output_error / $performance_approval->output) * 100, 1);

                $result->save();
            }
        }

        if(!$pending_count)
        {
            $approval = Approval::where('id', $request->input('0.approval_id'))->first();
            $approval->status = 'done';
            $approval->save();
        }
    }
    public function details($id)
    {
        $details = DB::table('approvals')
            ->join('reports', 'reports.id', '=', 'approvals.report_id')
            ->join('projects', 'projects.id', '=', 'reports.project_id')
            ->join('users', 'users.id', '=', 'reports.user_id')
            ->select(
                '*',
                'approvals.id as approval_id',
                'projects.name as project',
                DB::raw('UPPER(LEFT(projects.name, 1)) as first_letter'),
                DB::raw('DATE_FORMAT(reports.date_start, "%b. %d, %Y") as date_start'),
                DB::raw('DATE_FORMAT(reports.date_end, "%b. %d, %Y") as date_end'),
                DB::raw('DATE_FORMAT(approvals.created_at, "%h:%i %p %b. %d, %Y") as created_at')
            )
            ->where('approvals.id', $id)
            ->first();

        $details->current = DB::table('performance_approvals')
            ->join('performances', 'performances.id', '=', 'performance_approvals.performance_id')
            ->join('members', 'members.id', '=', 'performances.member_id')
            ->join('positions', 'positions.id', '=', 'performances.position_id')
            ->select(
                'performances.*',
                'members.full_name',
                'positions.name as position',
                'performance_approvals.id as performance_approval_id',
                'performance_approvals.approval_id'
            )
            ->where('performance_approvals.approval_id', $id)
            ->whereNull('performance_approvals.status')
            ->get();

        $details->request = DB::table('performance_approvals')
            ->join('performances', 'performances.id', '=', 'performance_approvals.performance_id')
            ->join('positions', 'positions.id', '=', 'performance_approvals.position_id')
            ->select(
                'performances.*',
                'performance_approvals.*',
                'performance_approvals.id as performance_approval_id',
                'positions.name as position'
            )
            ->where('performance_approvals.approval_id', $id)
            ->whereNull('performance_approvals.status')
            ->get();        

        return response()->json($details);
    }
    public function pendingUser($id)
    {
        return DB::table('approvals')
            ->join('reports', 'reports.id', '=', 'approvals.report_id')
            ->join('projects', 'projects.id', '=', 'reports.project_id')
            ->join('users', 'users.id', '=', 'reports.user_id')
            ->select(
                '*',
                'approvals.id as approval_id',
                'projects.name as project',
                DB::raw('DATE_FORMAT(approvals.created_at, "%h:%i %p %b. %d, %Y") as created_at_formatted'),
                DB::raw('UPPER(LEFT(users.first_name, 1)) as first_letter')
            )
            ->where('approvals.status', 'pending')
            ->where('reports.user_id', $id)
            ->whereNull('approvals.deleted_at')
            ->groupBy('approvals.id')
            ->paginate(10);
    }
    public function pending()
    {
        return DB::table('approvals')
            ->join('reports', 'reports.id', '=', 'approvals.report_id')
            ->join('projects', 'projects.id', '=', 'reports.project_id')
            ->join('users', 'users.id', '=', 'reports.user_id')
            ->select(
                '*',
                'approvals.id as approval_id',
                'projects.name as project',
                DB::raw('DATE_FORMAT(approvals.created_at, "%h:%i %p %b. %d, %Y") as created_at_formatted'),
                DB::raw('UPPER(LEFT(users.first_name, 1)) as first_letter')
            )
            ->where('approvals.status', 'pending')
            ->whereNull('approvals.deleted_at')
            ->groupBy('approvals.id')
            ->paginate(10);
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

                if(!$create_notification)
                {
                    $admin = User::where('email', 'sherryl.sanchez@personiv.com')->first();

                    $approval = new Approval;

                    $approval->action = 'update';
                    $approval->report_id = $reportID;
                    $approval->status = 'pending';
                    $approval->save();

                    $report = Report::where('id', $request->input($i.'.report_id'))->first();

                    $report->user_id = $request->user()->id;

                    $report->save();

                    // create a notification
                    $notification = new Notification;

                    $notification->message = 'updates ';
                    $notification->receiver_user_id = $admin->id;
                    $notification->sender_user_id = $request->user()->id;
                    $notification->subscriber = 'admin';
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

                $performance_approval = new PerformanceApproval;

                $performance_approval->approval_id = $approval->id;
                $performance_approval->report_id = $reportID;
                $performance_approval->message = $request->input($i.'.message');
                $performance_approval->result_id = $request->input($i.'.result_id');
                $performance_approval->performance_id = $request->input($i.'.performance_id');
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
                $performance_approval->average_output = round($request->input($i.'.output') / $request->input($i.'.hours_worked') * $request->input($i.'.daily_work_hours'), 2);

                // save performance request to database
                $performance_approval->save();

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
