<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Report;
use DB;
use Excel;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    public function downloadSummary($date_start, $date_end)
    {
        global $report, $report_array;

        // $this->validate($request, [
        //     'date_start' => 'required|date',
        //     'date_end' => 'required|date',
        // ]);

        $date_start = date_create($date_start)->format("Y-m-d");
        $date_end = date_create($date_end)->format("Y-m-d");

        $report = DB::table('reports')
            ->join('projects', 'projects.id', '=', 'reports.project_id')
            ->join('departments', 'departments.id', '=', 'reports.department_id')
            ->select('*', 'reports.id as report_id', 'projects.name as project_name', 'departments.name as department_name')
            ->where('reports.date_start', 'like', $date_start .'%')
            ->whereBetween('reports.date_end', [$date_start, $date_end])
            ->groupBy('reports.id')
            ->get();

        $report_array = array();

        // will fetch every performance and results for the specific report
        foreach ($report as $key => $value) {
            $query = DB::table('reports')
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
                ->where('performances.report_id', $value->report_id)
                ->where('results.report_id', $value->report_id)
                ->groupBy('performances.id')
                ->orderBy('positions.name')
                ->orderBy('members.full_name')
                ->get();

                // push each results to custom array
                array_push($report_array, $query);
        }

        // return $report;

        Excel::create('PQR '. $date_start . ' to ' . $date_end, function($excel) {
            global $report;

            foreach ($report as $key => $value) {
                global $index;
                $index = $key;
                $excel->sheet($value->project_name, function($sheet) {
                    global $report_array, $index;
                    $sheet->loadView('excel.weekly')->with('data',$report_array[$index]);
                });
            }

        })->download('xlsx');

    }
    public function download($reportID)
    {
        global $report, $details;

        $details = DB::table('reports')
            ->join('projects', 'projects.id', '=', 'reports.project_id')
            ->join('departments', 'departments.id', '=', 'reports.department_id')
            ->select('*', 'projects.name as project_name', 'departments.name as department_name')
            ->where('reports.id', $reportID)
            ->first();

        $report = DB::table('reports')
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
            ->where('performances.report_id', $reportID)
            ->where('results.report_id', $reportID)
            ->groupBy('performances.id')
            ->orderBy('positions.name')
            ->orderBy('members.full_name')
            ->get();

        Excel::create('PQR - '. $details->department_name .' ('. $details->project_name.')', function($excel) {
            global $details;
            $excel->sheet($details->date_start .' to '. $details->date_end, function($sheet) {
                global $report;
                $sheet->loadView('excel.weekly')->with('data',$report);
            });

        })->download('xlsx');
    }
    public function searchDepartment(Request $request, $id)
    {
        $report_array = array();

        $reports = DB::table('reports')
            ->join('performances', 'performances.report_id', '=', 'reports.id')
            ->join('results', 'results.performance_id', '=', 'performances.id')
            ->join('positions', 'positions.id', '=', 'performances.position_id')
            ->join('projects', 'projects.id', '=', 'reports.project_id')
            ->join('members', 'members.id', '=', 'performances.member_id')
            ->select(
                'members.*',
                'reports.id as report_id',
                'performances.*',
                DB::raw('DATE_FORMAT(performances.date_start, "%b. %d, %Y") as date_start'),
                DB::raw('DATE_FORMAT(performances.date_end, "%b. %d, %Y") as date_end'),
                'results.*',
                'projects.*',
                'projects.name as project',
                'positions.name as position'
            )
            ->where('reports.department_id', $id)
            ->where('reports.date_start', 'like', '%'. $request->userInput .'%')
            ->orWhere('reports.date_end', 'like', '%'. $request->userInput .'%')
            ->orWhere('projects.name', 'like', '%'. $request->userInput .'%')
            ->groupBy('reports.id')
            ->orderBy('reports.date_start', 'desc')
            ->get();

        foreach ($reports as $key => $value) {
            $query = DB::table('reports')
                ->join('performances', 'performances.report_id', '=', 'reports.id')
                ->join('results', 'results.performance_id', '=', 'performances.id')
                ->join('positions', 'positions.id', '=', 'performances.position_id')
                ->join('projects', 'projects.id', '=', 'reports.project_id')
                ->join('members', 'members.id', '=', 'performances.member_id')
                ->select(
                    'reports.id as report_id',
                    'members.*',
                    'performances.*',
                    DB::raw('DATE_FORMAT(performances.date_start, "%b. %d, %Y") as date_start'),
                    DB::raw('DATE_FORMAT(performances.date_end, "%b. %d, %Y") as date_end'),
                    'results.*',
                    'projects.*',
                    'projects.name as project',
                    'positions.name as position'
                )
                ->where('performances.report_id', $value->report_id)
                ->where('results.report_id', $value->report_id)
                ->groupBy('performances.id')
                ->orderBy('positions.name')
                ->orderBy('members.full_name')
                ->get();

            array_push($report_array, $query);
        }
        return response()->json($report_array);
    }

    public function search(Request $request)
    {
        $report_array = array();

        $reports = DB::table('reports')
            ->join('performances', 'performances.report_id', '=', 'reports.id')
            ->join('results', 'results.performance_id', '=', 'performances.id')
            ->join('positions', 'positions.id', '=', 'performances.position_id')
            ->join('projects', 'projects.id', '=', 'reports.project_id')
            ->join('members', 'members.id', '=', 'performances.member_id')
            ->select(
                'members.*',
                'reports.id as report_id',
                'performances.*',
                DB::raw('DATE_FORMAT(performances.date_start, "%b. %d, %Y") as date_start'),
                DB::raw('DATE_FORMAT(performances.date_end, "%b. %d, %Y") as date_end'),
                'results.*',
                'projects.*',
                'projects.name as project',
                'positions.name as position'
            )
            ->where('reports.date_start', 'like', '%'. $request->userInput .'%')
            ->orWhere('reports.date_end', 'like', '%'. $request->userInput .'%')
            ->orWhere('projects.name', 'like', '%'. $request->userInput .'%')
            ->groupBy('reports.id')
            ->orderBy('reports.date_start', 'desc')
            ->get();



        foreach ($reports as $key => $value) {
            $query = DB::table('reports')
                ->join('performances', 'performances.report_id', '=', 'reports.id')
                ->join('results', 'results.performance_id', '=', 'performances.id')
                ->join('positions', 'positions.id', '=', 'performances.position_id')
                ->join('projects', 'projects.id', '=', 'reports.project_id')
                ->join('members', 'members.id', '=', 'performances.member_id')
                ->select(
                    'reports.id as report_id',
                    'members.*',
                    'performances.*',
                    DB::raw('DATE_FORMAT(performances.date_start, "%b. %d, %Y") as date_start'),
                    DB::raw('DATE_FORMAT(performances.date_end, "%b. %d, %Y") as date_end'),
                    'results.*',
                    'projects.*',
                    'projects.name as project',
                    'positions.name as position'
                )
                ->where('performances.report_id', $value->report_id)
                ->where('results.report_id', $value->report_id)
                ->groupBy('performances.id')
                ->orderBy('positions.name')
                ->orderBy('members.full_name')
                ->get();

            array_push($report_array, $query);
        }

        return response()->json($report_array);
    }
    public function paginateDetails()
    {
        return Report::orderBy('created_at', 'desc')->paginate(4);
    }
    public function paginate()
    {
        $report = Report::orderBy('created_at', 'desc')->paginate(4);
        $report_array = array();

        // will fetch every performance and results for the specific report
        foreach ($report as $key => $value) {
            $query = DB::table('reports')
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
                ->where('performances.report_id', $value->id)
                ->where('results.report_id', $value->id)
                ->groupBy('performances.id')
                ->orderBy('positions.name')
                ->orderBy('members.full_name')
                ->get();

                // push each results to custom array
                array_push($report_array, $query);
        }
        return response()->json($report_array);
    }

    public function paginateDepartmentDetails($departmentID)
    {
        return Report::where('department_id', $departmentID)->orderBy('created_at', 'desc')->paginate(4);
    }
    public function paginateDepartment($departmentID)
    {
        $report = Report::where('department_id', $departmentID)->orderBy('created_at', 'desc')->paginate(4);
        $report_array = array();

        // will fetch every performance and results for the specific report
        foreach ($report as $key => $value) {
            $query = DB::table('reports')
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
                ->where('performances.report_id', $value->id)
                ->where('results.report_id', $value->id)
                ->groupBy('performances.id')
                ->orderBy('positions.name')
                ->orderBy('members.full_name')
                ->get();

                // push each results to custom array

                array_push($report_array, $query);
        }
        return response()->json($report_array);
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
