<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Auth;
use Carbon\Carbon;
use App\PerformanceApproval;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PerformanceApprovalController extends Controller
{
    public function approvedDetails($id)
    {
        $performance_approval = PerformanceApproval::where('id', $id)->first();

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
            ->where('approvals.id', $performance_approval->approval_id)
            ->first();

        $details->current = DB::table('performances')
            ->join('members', 'members.id', '=', 'performances.member_id')
            ->join('positions', 'positions.id', '=', 'performances.position_id')
            ->select(
                'performances.*',
                'members.full_name',
                'positions.name as position'
            )
            ->where('performances.id', $performance_approval->performance_id)
            ->first();

        $details->previous =  DB::table('performance_histories')
            ->join('positions', 'positions.id', '=', 'performance_histories.position_id')
            ->select(
                'performance_histories.*',
                'positions.name as position'
            )
            ->where('performance_histories.performance_id', $performance_approval->performance_id)
            ->orderBy('performance_histories.created_at', 'desc')
            ->first();

        return response()->json($details);
    }

    public function declinedDetails($id)
    {
        $performance_approval = PerformanceApproval::where('id', $id)->first();

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
            ->where('approvals.id', $performance_approval->approval_id)
            ->first();


        $details->current = DB::table('performances')
            ->join('members', 'members.id', '=', 'performances.member_id')
            ->join('positions', 'positions.id', '=', 'performances.position_id')
            ->select(
                'performances.*',
                'members.full_name',
                'positions.name as position'
            )
            ->where('performances.id', $performance_approval->performance_id)
            ->first();

        $details->request =  DB::table('performance_approvals')
            ->join('positions', 'positions.id', '=', 'performance_approvals.position_id')
            ->select(
                'performance_approvals.*',
                'positions.name as position'
            )
            ->where('performance_approvals.id', $performance_approval->id)
            ->orderBy('performance_approvals.created_at', 'desc')
            ->first();

        return response()->json($details);
    }
    public function declinedUser(Request $request)
    {
        $date_start = $request->month && $request->year ? Carbon::parse('first day of '. $request->month. ' '. $request->year) : Carbon::parse('first day of this month');
        $date_end = $request->month && $request->year ? Carbon::parse('last day of '. $request->month. ' '. $request->year) : Carbon::parse('last day of this month');

        return DB::table('performance_approvals')
            ->join('projects', 'projects.id', '=', 'performance_approvals.project_id')
            ->join('reports', 'reports.id', '=', 'performance_approvals.report_id')
            ->join('users', 'users.id', '=', 'reports.user_id')
            ->select(
                'performance_approvals.*',
                'projects.name as project',
                DB::raw('UPPER(LEFT(projects.name, 1)) as first_letter'),
                DB::raw('DATE_FORMAT(performance_approvals.date_start, "%b. %d, %Y") as date_start_formatted'),
                DB::raw('DATE_FORMAT(performance_approvals.date_end, "%b. %d, %Y") as date_end_formatted')
            )
            ->where('performance_approvals.status', 'declined')
            ->where('users.id', Auth::user()->id)
            ->whereNull('performance_approvals.deleted_at')
            ->whereBetween('performance_approvals.created_at', [$date_start, $date_end])
            ->orderBy('performance_approvals.created_at')
            ->get();
    }

    public function declined(Request $request)
    {
        $date_start = $request->month && $request->year ? Carbon::parse('first day of '. $request->month. ' '. $request->year) : Carbon::parse('first day of this month');
        $date_end = $request->month && $request->year ? Carbon::parse('last day of '. $request->month. ' '. $request->year) : Carbon::parse('last day of this month');

        return DB::table('performance_approvals')
            ->join('projects', 'projects.id', '=', 'performance_approvals.project_id')
            ->select(
                'performance_approvals.*',
                'projects.name as project',
                DB::raw('UPPER(LEFT(projects.name, 1)) as first_letter'),
                DB::raw('DATE_FORMAT(performance_approvals.date_start, "%b. %d, %Y") as date_start_formatted'),
                DB::raw('DATE_FORMAT(performance_approvals.date_end, "%b. %d, %Y") as date_end_formatted')
            )
            ->where('performance_approvals.status', 'declined')
            ->whereNull('performance_approvals.deleted_at')
            ->whereBetween('performance_approvals.created_at', [$date_start, $date_end])
            ->orderBy('performance_approvals.created_at')
            ->get();
    }
    public function approvedUser(Request $request)
    {
        $date_start = $request->month && $request->year ? Carbon::parse('first day of '. $request->month. ' '. $request->year) : Carbon::parse('first day of this month');
        $date_end = $request->month && $request->year ? Carbon::parse('last day of '. $request->month. ' '. $request->year) : Carbon::parse('last day of this month');

        return DB::table('performance_approvals')
            ->join('projects', 'projects.id', '=', 'performance_approvals.project_id')
            ->join('reports', 'reports.id', '=', 'performance_approvals.report_id')
            ->join('users', 'users.id', '=', 'reports.user_id')
            ->select(
                'performance_approvals.*',
                'projects.name as project',
                DB::raw('UPPER(LEFT(projects.name, 1)) as first_letter'),
                DB::raw('DATE_FORMAT(performance_approvals.date_start, "%b. %d, %Y") as date_start_formatted'),
                DB::raw('DATE_FORMAT(performance_approvals.date_end, "%b. %d, %Y") as date_end_formatted')
            )
            ->where('performance_approvals.status', 'approved')
            ->whereBetween('performance_approvals.created_at', [$date_start, $date_end])
            ->where('users.id', Auth::user()->id)
            ->whereNull('performance_approvals.deleted_at')
            ->orderBy('performance_approvals.created_at')
            ->get();
    }

    public function approved(Request $request)
    {
        $date_start = $request->month && $request->year ? Carbon::parse('first day of '. $request->month. ' '. $request->year) : Carbon::parse('first day of this month');
        $date_end = $request->month && $request->year ? Carbon::parse('last day of '. $request->month. ' '. $request->year) : Carbon::parse('last day of this month');

        return DB::table('performance_approvals')
            ->join('projects', 'projects.id', '=', 'performance_approvals.project_id')
            ->select(
                'performance_approvals.*',
                'projects.name as project',
                DB::raw('UPPER(LEFT(projects.name, 1)) as first_letter'),
                DB::raw('DATE_FORMAT(performance_approvals.date_start, "%b. %d, %Y") as date_start_formatted'),
                DB::raw('DATE_FORMAT(performance_approvals.date_end, "%b. %d, %Y") as date_end_formatted')
            )
            ->where('performance_approvals.status', 'approved')
            ->whereNull('performance_approvals.deleted_at')
            ->whereBetween('performance_approvals.created_at', [$date_start, $date_end])
            ->orderBy('performance_approvals.created_at')
            ->get();
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
