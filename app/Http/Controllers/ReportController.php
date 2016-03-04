<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Report;
use DB;
use Carbon\Carbon;
use Excel;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    public function searchMonthly(Request $request)
    {
        $all = array();

        $this->date_start = new Carbon('last day of last month '. $request->month .' '. $request->year);
        $this->date_end = new Carbon('first day of next month'. $request->month .' '. $request->year);
        $this->projects = DB::table('projects')->get();

        foreach ($this->projects as $key => $value) {
            $details = DB::table('performances')
                ->join('members', 'members.id', '=', 'performances.member_id')
                ->join('positions', 'positions.id', '=', 'performances.position_id')
                ->leftJoin('projects', 'projects.id', '=', 'performances.project_id')
                ->select(
                    '*',
                    'members.id as member_id',
                    'positions.name as position',
                    'projects.id as project_id',
                    DB::raw('DATE_FORMAT(performances.date_start, "%b. %d") as date_start'),
                    DB::raw('DATE_FORMAT(performances.date_end, "%b. %d") as date_end')
                )
                ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                ->where('projects.id', $value->id)
                ->orderBy('positions.name')
                ->orderBy('members.full_name')
                ->orderBy('performances.date_start')
                // ->groupBy('positions.id')
                ->groupBy('members.id')
                ->get();

            if(count($details)){            
                $details[0]->positions = DB::table('positions')->where('project_id', $value->id)->orderBy('name')->get();
                $details[0]->program_head_count = count($details);
                $details[0]->position_head_count = array();

                foreach ($details[0]->positions as $positionKey => $positionValue) {
                    $query = DB::table('performances')
                        ->where('position_id', $positionValue->id)
                        ->whereBetween('date_start', [$this->date_start, $this->date_end])
                        ->groupBy('member_id')
                        ->get();

                    array_push($details[0]->position_head_count, count($query));
                }

                // foreach ($details[0]->position_head_count as $headCountKey => $headCountValue) {
                //     $details[0]->program_head_count += $headCountValue;
                // }
            }


            foreach ($details as $key1 => $value1) {
                $this->productivity_average = 0;
                $this->quality_average = 0;

                $results = DB::table('performances')
                    ->leftJoin('results', 'results.performance_id', '=', 'performances.id')
                    ->leftJoin('members', 'members.id', '=', 'performances.member_id')
                    ->leftJoin('positions', 'positions.id', '=', 'performances.position_id')
                    ->select(
                        '*',
                        'performances.id as performance_id',
                        'positions.name as position',
                        DB::raw('DATE_FORMAT(performances.date_start, "%b. %d") as date_start'),
                        DB::raw('DATE_FORMAT(performances.date_end, "%b. %d") as date_end')
                    )
                    ->where('members.id', $value1->member_id)
                    ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                    // ->whereBetween('performances.date_end', [$this->date_start, $this->date_end])
                    ->orderBy('positions.name')
                    ->orderBy('members.full_name')
                    ->orderBy('performances.date_start')
                    ->get();

                // foreach members performance add its results 
                foreach ($results as $key2 => $value4) {
                    $this->productivity_average += $value4->productivity;
                    $this->quality_average += $value4->quality;
                }
                
                // average its results
                $this->productivity_average = round($this->productivity_average / count($results), 1); 
                $this->quality_average = round($this->quality_average / count($results), 1);

                $details[$key1]->results = $results;
                $details[$key1]->productivity_average = $this->productivity_average;
                $details[$key1]->quality_average = $this->quality_average;

                $quality_target = DB::table('targets')
                    ->join('positions', 'positions.id', '=', 'targets.position_id')
                    ->join('members', 'members.experience', '=', 'targets.experience')
                    ->select('*')
                    ->where('targets.position_id', $value1->position_id)
                    ->where('targets.experience', $value1->experience)
                    ->where('targets.type', 'Quality')
                    ->first();

                $details[$key1]->quota = (($this->productivity_average >= 100) && ($this->quality_average >= $quality_target->value)) ? 'Met' : 'Not met';
                
            }

            array_push($all, $details);
        }

        return $all;
    }
    public function monthly()
    {
        $all = array();

        $this->date_start = new Carbon('last day of last month');
        $this->date_end = new Carbon('first day of next month');
        $this->projects = DB::table('projects')->get();

        foreach ($this->projects as $key => $value) {
            $details = DB::table('performances')
                ->join('members', 'members.id', '=', 'performances.member_id')
                ->join('positions', 'positions.id', '=', 'performances.position_id')
                ->leftJoin('projects', 'projects.id', '=', 'performances.project_id')
                ->select(
                    '*',
                    'members.id as member_id',
                    'positions.name as position',
                    'projects.id as project_id',
                    DB::raw('DATE_FORMAT(performances.date_start, "%b. %d") as date_start'),
                    DB::raw('DATE_FORMAT(performances.date_end, "%b. %d") as date_end')
                )
                ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                ->where('projects.id', $value->id)
                ->orderBy('positions.name')
                ->orderBy('members.full_name')
                ->orderBy('performances.date_start')
                ->groupBy('members.id')
                ->get();

            if(count($details)){            
                $details[0]->positions = DB::table('positions')->where('project_id', $value->id)->orderBy('name')->get();
                $details[0]->program_head_count = count($details);
                $details[0]->position_head_count = array();

                foreach ($details[0]->positions as $positionKey => $positionValue) {
                    $query = DB::table('performances')
                        ->where('position_id', $positionValue->id)
                        ->whereBetween('date_start', [$this->date_start, $this->date_end])
                        ->groupBy('member_id')
                        ->get();

                    array_push($details[0]->position_head_count, count($query));
                }

                // foreach ($details[0]->position_head_count as $headCountKey => $headCountValue) {
                //     $details[0]->program_head_count += $headCountValue;
                // }
            }


            foreach ($details as $key1 => $value1) {
                $this->productivity_average = 0;
                $this->quality_average = 0;

                $results = DB::table('performances')
                    ->leftJoin('results', 'results.performance_id', '=', 'performances.id')
                    ->leftJoin('members', 'members.id', '=', 'performances.member_id')
                    ->leftJoin('positions', 'positions.id', '=', 'performances.position_id')
                    ->select(
                        '*',
                        'performances.id as performance_id',
                        'positions.name as position',
                        DB::raw('DATE_FORMAT(performances.date_start, "%b. %d") as date_start'),
                        DB::raw('DATE_FORMAT(performances.date_end, "%b. %d") as date_end')
                    )
                    ->where('members.id', $value1->member_id)
                    ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                    // ->whereBetween('performances.date_end', [$this->date_start, $this->date_end])
                    ->orderBy('positions.name')
                    ->orderBy('members.full_name')
                    ->orderBy('performances.date_start')
                    ->get();

                // foreach members performance add its results 
                foreach ($results as $key2 => $value4) {
                    $this->productivity_average += $value4->productivity;
                    $this->quality_average += $value4->quality;
                }
                
                // average its results
                $this->productivity_average = round($this->productivity_average / count($results), 1); 
                $this->quality_average = round($this->quality_average / count($results), 1);

                $details[$key1]->results = $results;
                $details[$key1]->productivity_average = $this->productivity_average;
                $details[$key1]->quality_average = $this->quality_average;

                $quality_target = DB::table('targets')
                    ->join('positions', 'positions.id', '=', 'targets.position_id')
                    ->join('members', 'members.experience', '=', 'targets.experience')
                    ->select('*')
                    ->where('targets.position_id', $value1->position_id)
                    ->where('targets.experience', $value1->experience)
                    ->where('targets.type', 'Quality')
                    ->first();

                $details[$key1]->quota = (($this->productivity_average >= 100) && ($this->quality_average >= $quality_target->value)) ? 'Met' : 'Not met';
            
            }

            array_push($all, $details);
        }

        return $all;
    }

    public function downloadMonthlySummary($month, $year, $daily_work_hours)
    {
        $this->projects = DB::table('projects')->get();
        $this->month = $month;
        $this->year = $year;
        $this->date_start = $this->year.'-'.$this->month.'-'.'01';
        $this->date_end = $this->year.'-'.$this->month.'-'.'31';
        $this->date_start_format = date_create($this->date_start)->format("F Y");
        $this->date_end_format = date_create($this->date_end)->format("F Y");
        
        $this->reports_array = array();
        $this->members_array = array();

        $beginner_temp = array();
        $moderately_experienced_temp = array();
        $experienced_temp = array();
        $quality_temp = array();

        $this->beginner = array();
        $this->moderately_experienced = array();
        $this->experienced = array();
        $this->quality = array();
        $this->positions_array = array();

        foreach ($this->projects as $parentKey => $value) {
            $this->positions = DB::table('positions')
                ->where('project_id', $value->id)
                ->get();

            array_push($this->positions_array, $this->positions);

            foreach ($this->positions as $key => $value2) {
                $beginner = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('position_id', $value2->id)
                    ->where('experience', 'Beginner')
                    ->first();

                $moderately_experienced = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('position_id', $value2->id)
                    ->where('experience', 'Moderately Experienced')
                    ->first();

                $experienced = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('position_id', $value2->id)
                    ->where('experience', 'Experienced')
                    ->first();

                $quality = DB::table('targets')
                    ->where('type', 'Quality')
                    ->where('position_id', $value2->id)
                    ->first();

                array_push($beginner_temp, $beginner);
                array_push($moderately_experienced_temp, $moderately_experienced);
                array_push($experienced_temp, $experienced);
                array_push($quality_temp, $quality);
            }
            // return $beginner_temp;
            array_push($this->beginner, $beginner_temp);
            array_push($this->moderately_experienced, $moderately_experienced_temp);
            array_push($this->experienced, $experienced_temp);
            array_push($this->quality, $quality_temp);

            $beginner_temp = array();
            $moderately_experienced_temp = array();
            $experienced_temp = array();
            $quality_temp = array();

            $reports = DB::table('performances')
                ->select(
                    '*',
                    DB::raw('DATE_FORMAT(date_start, "%b. %d") as date_start'),
                    DB::raw('DATE_FORMAT(date_end, "%b. %d") as date_end')
                )
                ->where('project_id', $value->id)
                ->whereBetween('date_start', [$this->date_start, $this->date_end])
                ->where('daily_work_hours', 'like', $daily_work_hours)
                // ->groupBy('date_start')
                ->get();

            // fetch all members of per project
            $members = DB::table('performances')
                ->join('members', 'members.id', '=', 'performances.member_id')
                ->join('positions', 'positions.id', '=', 'performances.position_id')
                ->leftJoin('projects', 'projects.id', '=', 'performances.project_id')
                ->select(
                    '*',
                    'members.id as member_id',
                    'positions.name as position',
                    DB::raw('DATE_FORMAT(performances.date_start, "%b. %d") as date_start'),
                    DB::raw('DATE_FORMAT(performances.date_end, "%b. %d") as date_end')
                )
                ->where('projects.id', $value->id)
                ->groupBy('members.id')
                ->get();

            // foreach members fetch its performance
            foreach ($members as $key1 => $value3) {
                $this->productivity_average = 0;
                $this->quality_average = 0;

                $results = DB::table('performances')
                    ->leftJoin('results', 'results.performance_id', '=', 'performances.id')
                    ->leftJoin('members', 'members.id', '=', 'performances.member_id')
                    ->leftJoin('positions', 'positions.id', '=', 'performances.position_id')
                    ->select(
                        '*',
                        'performances.id as performance_id',
                        'positions.name as position',
                        DB::raw('DATE_FORMAT(performances.date_start, "%b. %d") as date_start'),
                        DB::raw('DATE_FORMAT(performances.date_end, "%b. %d") as date_end')
                    )
                    ->where('members.id', $value3->member_id)
                    ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                    ->orderBy('positions.name')
                    ->orderBy('members.full_name')
                    ->get();

                // foreach members performance add its results 
                foreach ($results as $key2 => $value4) {
                    $this->productivity_average += $value4->productivity;
                    $this->quality_average += $value4->quality;
                }
                
                // average its results
                $this->productivity_average = round($this->productivity_average / count($results), 1); 
                $this->quality_average = round($this->quality_average / count($results), 1);

                $members[$key1]->results = $results;
                $members[$key1]->productivity_average = $this->productivity_average;
                $members[$key1]->quality_average = $this->quality_average;

                $quality_target = DB::table('targets')
                    ->join('positions', 'positions.id', '=', 'targets.position_id')
                    ->join('members', 'members.experience', '=', 'targets.experience')
                    ->select('*')
                    ->where('targets.position_id', $value3->position_id)
                    ->where('targets.experience', $value3->experience)
                    ->where('targets.type', 'Quality')
                    ->first();

                $members[$key1]->quota = (($this->productivity_average >= 100) && ($this->quality_average >= $quality_target->value)) ? 'Met' : 'Not met';

            }

            array_push($this->members_array, $members);
            array_push($this->reports_array, $reports);
        }

        Excel::create('PQR Summary Report '. $this->date_start_format, function($excel){
            foreach ($this->projects as $key => $value) {
                $this->index = $key;
                $excel->sheet($value->name, function($sheet) {
                    $sheet->loadView('excel.monthly')
                        ->with('positions', $this->positions_array[$this->index])
                        ->with('members', $this->members_array[$this->index])
                        ->with('reports', $this->reports_array[$this->index])
                        ->with('beginner', $this->beginner[$this->index])
                        ->with('moderately_experienced', $this->moderately_experienced[$this->index])
                        ->with('experienced', $this->experienced[$this->index])
                        ->with('quality', $this->quality[$this->index]);
                });
            }
        })->download('xlsx');


    }
    public function downloadSummary($date_start, $date_end, $daily_work_hours)
    {
        global $report, $report_array, $position_array, $quality_array, $beginner_array, $moderately_experienced_array, $experienced_array;

        $report_array = array();
        $position_array = array();
        $quality_array = array();

        $beginner_array = array();
        $moderately_experienced_array = array();
        $experienced_array = array();

        $beginner_temp = array();
        $moderately_experienced_temp = array();
        $experienced_temp = array();
        $quality_temp = array();

        $date_start = date_create($date_start)->format("Y-m-d");
        $date_end = date_create($date_end)->format("Y-m-d");


        $report = DB::table('reports')
            ->join('projects', 'projects.id', '=', 'reports.project_id')
            ->join('departments', 'departments.id', '=', 'reports.department_id')
            ->select(
                '*',
                'reports.id as report_id',
                'projects.id as project_id', 
                'projects.name as project_name', 
                'departments.name as department_name'
            )
            ->where('reports.daily_work_hours', 'like', $daily_work_hours)
            ->where('reports.date_start', 'like', $date_start .'%')
            ->whereBetween('reports.date_end', [$date_start, $date_end])
            ->groupBy('reports.id')
            ->get();

        if(!count($report))
        {
            return 'No records found.';
        }

        // will fetch every performance and results for the specific report
        foreach ($report as $key => $value) {
            $reports = DB::table('reports')
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
            array_push($report_array, $reports);

            $positions = DB::table('positions')
                ->where('project_id', $value->project_id)
                ->get();

            // push each results to custom array
            array_push($position_array, $positions);

            foreach ($positions as $key => $value) {
                $beginner = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('position_id', $value->id)
                    ->where('experience', 'Beginner')
                    ->first();

                $moderately_experienced = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('position_id', $value->id)
                    ->where('experience', 'Moderately Experienced')
                    ->first();

                $experienced = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('position_id', $value->id)
                    ->where('experience', 'Experienced')
                    ->first();

                $quality = DB::table('targets')
                    ->where('type', 'Quality')
                    ->where('position_id', $value->id)
                    ->first();            

                array_push($beginner_temp, $beginner);
                array_push($moderately_experienced_temp, $moderately_experienced);
                array_push($experienced_temp, $experienced);
                array_push($quality_temp, $quality);
            }

            // push in for per report
            array_push($beginner_array, $beginner_temp);
            array_push($moderately_experienced_array, $moderately_experienced_temp);
            array_push($experienced_array, $experienced_temp);
            array_push($quality_array, $quality_temp);

            // reset the temp
            $beginner_temp = array();
            $moderately_experienced_temp = array();
            $experienced_temp = array();
            $quality_temp = array();
        }
        
        Excel::create('PQR '. $date_start . ' to ' . $date_end, function($excel) {
            global $report;

            foreach ($report as $key => $value) {
                global $index;
                $index = $key;
                $excel->sheet($value->project_name, function($sheet) {
                    global $report_array, $index, $quality_array, $position_array, $beginner_array, $moderately_experienced_array, $experienced_array;
                    $sheet->loadView('excel.weekly')
                        ->with('data', $report_array[$index])
                        ->with('positions', $position_array[$index])
                        ->with('beginner', $beginner_array[$index])
                        ->with('moderately_experienced', $moderately_experienced_array[$index])
                        ->with('experienced', $experienced_array[$index])
                        ->with('quality', $quality_array[$index]);
                });
            }

        })->download('xlsx');

    }
    public function download($reportID)
    {
        global $report, $details, $positions, $quality, $beginner, $moderately_experienced, $experienced;

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
                'positions.name as position',
                'positions.id as position_id',
                'projects.id as project_id'
            )
            ->where('performances.report_id', $reportID)
            ->where('results.report_id', $reportID)
            ->groupBy('performances.id')
            ->orderBy('positions.name')
            ->orderBy('members.full_name')
            ->get();

        foreach ($report as $key => $value) {
            $positions = DB::table('positions')
                ->where('project_id', $value->project_id)
                ->get();

            $beginner = DB::table('targets')
                ->where('type', 'Productivity')
                ->where('project_id', $value->project_id)
                ->where('experience', 'Beginner')
                ->get();

            $moderately_experienced = DB::table('targets')
                ->where('type', 'Productivity')
                ->where('project_id', $value->project_id)
                ->where('experience', 'Moderately Experienced')
                ->get();

            $experienced = DB::table('targets')
                ->where('type', 'Productivity')
                ->where('project_id', $value->project_id)
                ->where('experience', 'Experienced')
                ->get();

            $quality = DB::table('targets')
                ->where('type', 'Quality')
                ->where('project_id', $value->project_id)
                ->groupBy('position_id')
                ->get();
        }

        Excel::create('PQR - '. $details->department_name .' ('. $details->project_name.')', function($excel) {
            global $details;
            $excel->sheet($details->date_start .' to '. $details->date_end, function($sheet) {
                global $report, $quality, $positions, $beginner, $moderately_experienced, $experienced;
                $sheet->loadView('excel.weekly')
                    ->with('data',$report)
                    ->with('positions', $positions)
                    ->with('beginner', $beginner)
                    ->with('moderately_experienced', $moderately_experienced)
                    ->with('experienced', $experienced)
                    ->with('quality', $quality);
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

            foreach ($query as $queryKey => $queryValue) {
                $quality_target = DB::table('targets')
                    ->join('positions', 'positions.id', '=', 'targets.position_id')
                    ->join('members', 'members.experience', '=', 'targets.experience')
                    ->select('*')
                    ->where('targets.position_id', $queryValue->position_id)
                    ->where('targets.experience', $queryValue->experience)
                    ->where('targets.type', 'Quality')
                    ->first();

                    $queryValue->quota = (($queryValue->productivity >= 100) && ($queryValue->quality >= $quality_target->value)) ? 'Met' : 'Not met';
            }

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

                foreach ($query as $queryKey => $queryValue) {
                    $quality_target = DB::table('targets')
                        ->join('positions', 'positions.id', '=', 'targets.position_id')
                        ->join('members', 'members.experience', '=', 'targets.experience')
                        ->select('*')
                        ->where('targets.position_id', $queryValue->position_id)
                        ->where('targets.experience', $queryValue->experience)
                        ->where('targets.type', 'Quality')
                        ->first();

                        $queryValue->quota = (($queryValue->productivity >= 100) && ($queryValue->quality >= $quality_target->value)) ? 'Met' : 'Not met';
                }

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
        Report::where('id', $id)->delete();

        DB::table('performances')->where('report_id', $id)->delete();
        DB::table('results')->where('report_id', $id)->delete();
    }
}
