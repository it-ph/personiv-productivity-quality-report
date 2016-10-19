<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use DB;
use App\Activity;
use App\ActivityType;
use App\Performance;
use App\PerformanceHistory;
use App\User;
use App\Notification;
use App\Report;
use App\Events\ReportSubmittedBroadCast;
use App\Events\ApprovalNotificationBroadCast;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PerformanceHistoryController extends Controller
{
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
        $this->notify_report = false;
        $this->activity = new Activity;
        for ($i=0; $i < count($request->all()); $i++) { 
            if($request->input($i.'.include'))
            {
                $this->validate($request, [
                    $i.'.id' => 'required',
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

                DB::transaction(function() use ($request, $i){
                    // check if a report is already created
                    if(!$this->notify_report)
                    {
                        $admin = User::where('role', 'admin')->first();
                        $report = Report::where('id', $request->input($i.'.report_id'))->first();

                        // create a notification
                        $notification = new Notification;

                        $notification->message = 'updated a ';
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

                        $activity_type = ActivityType::where('action', 'update')->first();

                        $this->activity->report_id = $report->id;
                        $this->activity->user_id = $request->user()->id;
                        $this->activity->activity_type_id = $activity_type->id;

                        $this->activity->save();

                        // report 
                        $this->notify_report = true;
                    }

                    $old_performance = Performance::where('id', $request->input($i.'.id'))->first();

                    // record history of the performance
                    $performance_history = new PerformanceHistory;
                    
                    $performance_history->activity_id = $this->activity->id;
                    $performance_history->performance_id = $old_performance->id;
                    $performance_history->report_id = $old_performance->report_id;
                    $performance_history->member_id = $old_performance->member_id;
                    $performance_history->position_id = $old_performance->position_id;
                    $performance_history->department_id = $old_performance->department_id;
                    $performance_history->project_id = $old_performance->project_id;
                    $performance_history->target_id = $old_performance->target_id;
                    $performance_history->date_start = $old_performance->date_start;
                    $performance_history->date_end = $old_performance->date_end;
                    $performance_history->daily_work_hours = $old_performance->daily_work_hours;
                    $performance_history->output = $old_performance->output;
                    $performance_history->hours_worked = $old_performance->hours_worked;
                    $performance_history->output_error = $old_performance->output_error;
                    $performance_history->average_output = $old_performance->average_output;
                    $performance_history->productivity = $old_performance->productivity;
                    $performance_history->quality = $old_performance->quality;
                    $performance_history->quadrant = $old_performance->quadrant;
                    $performance_history->remarks = $old_performance->remarks;

                    $performance_history->save();
                });
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
        return PerformanceHistory::with('member', 'position')->with(['activity' => function($query){ $query->with('user'); }])->with(['report' => function($query){ $query->withTrashed(); }])->with(['performance' => function($query){ $query->withTrashed()->with(['member' => function($query){ $query->with('experiences');}])->with('position'); }])->with(['project' => function($query){ $query->with(['positions' => function($query){ $query->with(['targets' => function($query){ $query->withTrashed()->orderBy('created_at', 'desc'); }]);}]); }])->where('activity_id', $id)->get();
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
