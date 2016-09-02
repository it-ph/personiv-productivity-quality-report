<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Report;
use App\Performance;
// use App\Result;
use DB;
use Carbon\Carbon;
use Carbon\CarbonInterval;
use Excel;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Auth;
use App\Project;
use App\Target;
use App\Position;
use App\Member;
use App\Experience;

class ReportController extends Controller
{
    public function departmentMonthlyPosition(Request $request)
    {
        $this->date_start = ($request->month && $request->year) ? new Carbon('first Monday of '. $request->month .' '. $request->year) : new Carbon('first Monday of this month'); // first Monday of the month
        $this->date_end = ($request->month && $request->year) ? new Carbon('last Monday of '. $request->month .' '. $request->year) : new Carbon('last Monday of this month'); // last Monday of the month

        $project = Project::with('positions')->where('department_id', $request->id)->first();
        $first_report = Report::where('project_id', $project->id)->whereBetween('date_start', [$this->date_start, $this->date_end])->orderBy('date_start')->first();
        
        $project->reports = Report::with('project')->where('project_id', $project->id)->whereBetween('date_start', [$this->date_start, $this->date_end])->where('daily_work_hours', 'like', $first_report->daily_work_hours.'%')->get();   
        $project->members = Experience::with(['member' => function($query){ $query->withTrashed(); }])->where('project_id', $project->id)->get();

        foreach ($project->members as $member_key => $member) {
            $member->total_output = 0;
            $member->total_output_error = 0;
            $member->total_hours_worked = 0;
            $member->average_output = 0;
            $member->monthly_productivity = 0;
            $member->monthly_quality = 0;
        }
        
        foreach ($project->reports as $report_key => $report) {
            $project->position = Position::where('id', $request->input('position.id'))->first();
            $report->members = Experience::with('member')->where('project_id', $report->project_id)->get();

            foreach ($report->members as $member_key => $member) {
                $member->performance = Performance::with('position')->with(['target' => function($query){ $query->withTrashed(); }])->where('member_id', $member->member_id)->where('report_id', $report->id)->where('position_id', $request->input('position.id'))->first();
                if($member->performance){
                    $project->members[$member_key]->total_output += $member->performance->output;
                    $project->members[$member_key]->total_output_error += $member->performance->output_error;
                    $project->members[$member_key]->total_hours_worked += $member->performance->hours_worked;
                }
            }

            $report->date_start = Carbon::parse($report->date_start)->toFormattedDateString();
            $report->date_end = Carbon::parse($report->date_end)->toFormattedDateString();
        }

        if(count($project->reports)){            
            foreach ($project->members as $member_key => $member) {
                for ($i=0; $i < count($project->reports); $i++) { 
                    if($project->reports[$i]->members[$member_key]->performance){
                        $target = $project->reports[$i]->members[$member_key]->performance->target;
                        $member->average_output = round($member->total_output / $member->total_hours_worked * $first_report->daily_work_hours, 2);
                        $member->monthly_productivity = round($member->average_output / $target->productivity * 100, 2);
                        $member->monthly_quality = round((1 - $member->total_output_error / $member->total_output) * 100, 2);

                        if($member->monthly_productivity < 100 && $member->monthly_quality >= $target->quality)
                        {
                            $member->quadrant = 'Quadrant 1'; 
                        }
                        else if($member->monthly_productivity >= 100 && $member->monthly_quality >= $target->quality)
                        {
                            $member->quadrant = 'Quadrant 2'; 
                        }
                        else if($member->monthly_productivity >= 100 && $member->monthly_quality < $target->quality)
                        {
                            $member->quadrant = 'Quadrant 3'; 
                        }
                        else if($member->monthly_productivity < 100 && $member->monthly_quality < $target->quality)
                        {
                            $member->quadrant = 'Quadrant 4'; 
                        }
                    }
                }
            }
        }

        $project->date_cover_start = $this->date_start->toFormattedDateString();
        $project->date_cover_end = $this->date_end->toFormattedDateString();

        return $project;
    }

    public function departmentMonthly(Request $request)
    {
        $this->date_start = new Carbon('first Monday of '. $request->month .' '. $request->year);
        $this->date_end = new Carbon('last Monday of '. $request->month .' '. $request->year);
        $projects = Project::with('positions')->where('department_id', Auth::user()->department_id)->get();

        foreach ($projects as $project_key => $project) {
            $project->first_report = $request->daily_work_hours ? Report::where('project_id', $project->id)->where('daily_work_hours', 'like', $request->daily_work_hours.'%')->whereBetween('date_start', [$this->date_start, $this->date_end])->first() : Report::where('project_id', $project->id)->whereBetween('date_start', [$this->date_start, $this->date_end])->first();
            
            if($project->first_report){
                $project->date_start = $this->date_start->toFormattedDateString();
                $project->date_end = $this->date_end->toFormattedDateString();
                $project->members = Experience::with(['member' => function($query){ $query->withTrashed(); }])->where('project_id', $project->id)->get();
                $project->beginner_total_output = 0;
                $project->beginner_total_hours_worked = 0;
                $project->beginner_total_average_output = 0;

                $project->moderately_experienced_total_output = 0;
                $project->moderately_experienced_total_hours_worked = 0;
                $project->moderately_experienced_total_average_output = 0;

                $project->experienced_total_output = 0;
                $project->experienced_total_hours_worked = 0;
                $project->experienced_total_average_output = 0;

                foreach ($project->positions as $position_key => $position) {
                    $position->beginner = 0;
                    $position->moderately_experienced = 0;
                    $position->experienced = 0;
                    $position->head_count = 0;
                    $position->beginner_total_output = 0;
                    $position->beginner_total_hours_worked = 0;
                    $position->beginner_total_average_output = 0;

                    $position->moderately_experienced_total_output = 0;
                    $position->moderately_experienced_total_hours_worked = 0;
                    $position->moderately_experienced_total_average_output = 0;

                    $position->experienced_total_output = 0;
                    $position->experienced_total_hours_worked = 0;
                    $position->experienced_total_average_output = 0;
                }

                foreach ($project->members as $member_key => $member) {
                    $member->positions = $project->positions;
                    $member->roles = 0;
                    $overall_monthly_productivity = 0;
                    $overall_monthly_quality = 0;
                    $overall_count = 0;

                    foreach ($member->positions as $position_key => $position) {
                        $performances = Performance::with('project', 'position')->with(['target' => function($query){ $query->withTrashed(); }])->with(['member' => function($query){ $query->with(['experiences' => function($query){ $query->with('project'); }]);}])->where('daily_work_hours', 'like', $project->first_report->daily_work_hours .'%')->where('position_id', $position->id)->where('member_id', $member->member_id)->whereBetween('date_start', [$this->date_start, $this->date_end])->get();

                        if(count($performances)){
                            $member->roles++;
                            $position->total_hours_worked = 0;
                            $position->total_output = 0;
                            $position->total_output_error = 0;
                            $position->total_average_output = 0;
                            $position->monthly_productivity = 0;
                            $position->monthly_quality = 0;

                            foreach ($performances as $performance_key => $performance) {
                                $position->total_hours_worked += $performance->hours_worked;
                                $position->total_output += $performance->output;
                                $position->total_output_error += $performance->output_error;

                                if($performance->target->experience == 'Beginner'){
                                    if($performance_key === 0){
                                        $project->positions[$position_key]->beginner += 1;
                                    }
                                    $project->positions[$position_key]->beginner_total_output += $performance->output;
                                    $project->positions[$position_key]->beginner_total_hours_worked += $performance->hours_worked;
                                }
                                else if($performance->target->experience == 'Moderately Experienced'){
                                    if($performance_key === 0){
                                        $project->positions[$position_key]->moderately_experienced += 1;
                                    }
                                    $project->positions[$position_key]->moderately_experienced_total_output += $performance->output;
                                    $project->positions[$position_key]->moderately_experienced_total_hours_worked += $performance->hours_worked;   
                                }
                                else if($performance->target->experience == 'Experienced'){
                                    if($performance_key === 0){
                                        $project->positions[$position_key]->experienced += 1;
                                    }
                                    $project->positions[$position_key]->experienced_total_output += $performance->output;
                                    $project->positions[$position_key]->experienced_total_hours_worked += $performance->hours_worked;
                                }
                            }
                            
                            $project->positions[$position_key]->head_count = $project->positions[$position_key]->beginner + $project->positions[$position_key]->moderately_experienced + $project->positions[$position_key]->experienced;
                            $position->total_average_output = round($position->total_output / $position->total_hours_worked * $performances[0]->daily_work_hours, 2);
                            $position->monthly_productivity = round($position->total_average_output / $performances[0]->target->productivity * 100, 2);
                            $position->monthly_quality = round((1 - $position->total_output_error / $position->total_output) * 100, 2);

                            if($position->monthly_productivity < 100 && $position->monthly_quality >= $performances[0]->target->quality)
                            {
                                $position->quadrant = 'Quadrant 1'; 
                            }
                            else if($position->monthly_productivity >= 100 && $position->monthly_quality >= $performances[0]->target->quality)
                            {
                                $position->quadrant = 'Quadrant 2'; 
                            }
                            else if($position->monthly_productivity >= 100 && $position->monthly_quality < $performances[0]->target->quality)
                            {
                                $position->quadrant = 'Quadrant 3'; 
                            }
                            else if($position->monthly_productivity < 100 && $position->monthly_quality < $performances[0]->target->quality)
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
                }

                foreach ($project->positions as $position_key => $position) {                    
                    $position->beginner_total_average_output = $position->beginner_total_hours_worked ? round($position->beginner_total_output / $position->beginner_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                    $position->moderately_experienced_total_average_output = $position->moderately_experienced_total_hours_worked ? round($position->moderately_experienced_total_output / $position->moderately_experienced_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                    $position->experienced_total_average_output = $position->experienced_total_hours_worked ? round($position->experienced_total_output / $position->experienced_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                
                    $project->beginner_total_output += $position->beginner_total_output;
                    $project->beginner_total_hours_worked += $position->beginner_total_hours_worked;
                    
                    $project->moderately_experienced_total_output += $position->moderately_experienced_total_output;
                    $project->moderately_experienced_total_hours_worked += $position->moderately_experienced_total_hours_worked;

                    $project->experienced_total_output += $position->experienced_total_output;
                    $project->experienced_total_hours_worked += $position->experienced_total_hours_worked;
                }

                $project->beginner_total_average_output = $project->beginner_total_hours_worked ? round($project->beginner_total_output / $project->beginner_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                $project->moderately_experienced_total_average_output = $project->moderately_experienced_total_hours_worked ? round($project->moderately_experienced_total_output / $project->moderately_experienced_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                $project->experienced_total_average_output = $project->experienced_total_hours_worked ? round($project->experienced_total_output / $project->experienced_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;

                $project->total_output = $project->beginner_total_output + $project->moderately_experienced_total_output + $project->experienced_total_output;
                $project->total_hours_worked = $project->beginner_total_hours_worked + $project->moderately_experienced_total_hours_worked + $project->experienced_total_hours_worked;
                $project->total_average_output = round($project->total_output / $project->total_hours_worked * $project->first_report->daily_work_hours, 2);
            }            
        }

        return $projects;
    }

    public function teamPerformance($month, $year, $daily_work_hours)
    {
        $months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        // $daily_work_hours = (float)$daily_work_hours;
        $this->date_start = new Carbon('first Monday of '. $months[(int)$month-1] .' '. $year);
        $this->date_end = Carbon::parse('last Monday of '. $months[(int)$month-1] .' '. $year)->addDay();

        $this->projects = Auth::user()->role != 'admin' ? DB::table('projects')->where('department_id', Auth::user()->department_id)->get() : DB::table('projects')->get();

        foreach ($this->projects as $project_key => $project) {
            $project->first_report =  Report::where('project_id', $project->id)->where('daily_work_hours', 'like', $daily_work_hours.'%')->whereBetween('date_start', [$this->date_start, $this->date_end])->first();
            // for each projects fetch its positions
            $positions = DB::table('positions')->where('project_id', $project->id)->get();
            if($project->first_report){
                $project->members = Experience::with(['member' => function($query){ $query->withTrashed(); }])->where('project_id', $project->id)->get();
                $project->positions = $positions;
                $project->beginner_total_output = 0;
                $project->beginner_total_hours_worked = 0;
                $project->beginner_total_average_output = 0;

                $project->moderately_experienced_total_output = 0;
                $project->moderately_experienced_total_hours_worked = 0;
                $project->moderately_experienced_total_average_output = 0;

                $project->experienced_total_output = 0;
                $project->experienced_total_hours_worked = 0;
                $project->experienced_total_average_output = 0;

                foreach ($project->positions as $position_key => $position) {
                    $position->beginner = 0;
                    $position->moderately_experienced = 0;
                    $position->experienced = 0;
                    $position->head_count = 0;

                    $position->beginner_total_output = 0;
                    $position->beginner_total_hours_worked = 0;
                    $position->beginner_total_average_output = 0;

                    $position->moderately_experienced_total_output = 0;
                    $position->moderately_experienced_total_hours_worked = 0;
                    $position->moderately_experienced_total_average_output = 0;

                    $position->experienced_total_output = 0;
                    $position->experienced_total_hours_worked = 0;
                    $position->experienced_total_average_output = 0;

                    $performances = Performance::where('position_id', $position->id)->whereBetween('date_start', [$this->date_start, $this->date_end])->groupBy('member_id')->get();
                }

                foreach ($project->members as $member_key => $member) {
                    $member->positions = $project->positions;
                    $member->roles = 0;
                    $overall_monthly_productivity = 0;
                    $overall_monthly_quality = 0;
                    $overall_count = 0;

                    foreach ($member->positions as $position_key => $position) {
                        $performances = Performance::with('project', 'position')->with(['target' => function($query){ $query->withTrashed(); }])->with(['member' => function($query){ $query->with(['experiences' => function($query){ $query->with('project'); }]);}])->where('daily_work_hours', 'like', $daily_work_hours .'%')->where('position_id', $position->id)->where('member_id', $member->member_id)->whereBetween('date_start', [$this->date_start, $this->date_end])->get();

                        if(count($performances)){
                            $member->roles++;
                            $position->total_hours_worked = 0;
                            $position->total_output = 0;
                            $position->total_output_error = 0;
                            $position->total_average_output = 0;
                            $position->monthly_productivity = 0;
                            $position->monthly_quality = 0;

                            foreach ($performances as $performance_key => $performance) {
                                $position->total_hours_worked += $performance->hours_worked;
                                $position->total_output += $performance->output;
                                $position->total_output_error += $performance->output_error;

                                if($performance->target->experience == 'Beginner'){
                                    if($performance_key === 0){
                                        $project->positions[$position_key]->beginner += 1;
                                    }
                                    $project->positions[$position_key]->beginner_total_output += $performance->output;
                                    $project->positions[$position_key]->beginner_total_hours_worked += $performance->hours_worked;
                                }
                                else if($performance->target->experience == 'Moderately Experienced'){
                                    if($performance_key === 0){
                                        $project->positions[$position_key]->moderately_experienced += 1;
                                    }
                                    $project->positions[$position_key]->moderately_experienced_total_output += $performance->output;
                                    $project->positions[$position_key]->moderately_experienced_total_hours_worked += $performance->hours_worked;   
                                }
                                else if($performance->target->experience == 'Experienced'){
                                    if($performance_key === 0){
                                        $project->positions[$position_key]->experienced += 1;
                                    }
                                    $project->positions[$position_key]->experienced_total_output += $performance->output;
                                    $project->positions[$position_key]->experienced_total_hours_worked += $performance->hours_worked;
                                }
                            }

                            $project->positions[$position_key]->head_count = $project->positions[$position_key]->beginner + $project->positions[$position_key]->moderately_experienced + $project->positions[$position_key]->experienced;
                            $position->total_average_output = round($position->total_output / $position->total_hours_worked * $performances[0]->daily_work_hours, 2);
                            $position->monthly_productivity = round($position->total_average_output / $performances[0]->target->productivity * 100, 2);
                            $position->monthly_quality = round((1 - $position->total_output_error / $position->total_output) * 100, 2);

                            if($position->monthly_productivity < 100 && $position->monthly_quality >= $performances[0]->target->quality)
                            {
                                $position->quadrant = 'Quadrant 1'; 
                            }
                            else if($position->monthly_productivity >= 100 && $position->monthly_quality >= $performances[0]->target->quality)
                            {
                                $position->quadrant = 'Quadrant 2'; 
                            }
                            else if($position->monthly_productivity >= 100 && $position->monthly_quality < $performances[0]->target->quality)
                            {
                                $position->quadrant = 'Quadrant 3'; 
                            }
                            else if($position->monthly_productivity < 100 && $position->monthly_quality < $performances[0]->target->quality)
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
                }

                foreach ($project->positions as $position_key => $position) {                    
                    $position->beginner_total_average_output = $position->beginner_total_hours_worked ? round($position->beginner_total_output / $position->beginner_total_hours_worked * $daily_work_hours, 2) : 0;
                    $position->moderately_experienced_total_average_output = $position->moderately_experienced_total_hours_worked ? round($position->moderately_experienced_total_output / $position->moderately_experienced_total_hours_worked * $daily_work_hours, 2) : 0;
                    $position->experienced_total_average_output = $position->experienced_total_hours_worked ? round($position->experienced_total_output / $position->experienced_total_hours_worked * $daily_work_hours, 2) : 0;
                
                    $project->beginner_total_output += $position->beginner_total_output;
                    $project->beginner_total_hours_worked += $position->beginner_total_hours_worked;
                    
                    $project->moderately_experienced_total_output += $position->moderately_experienced_total_output;
                    $project->moderately_experienced_total_hours_worked += $position->moderately_experienced_total_hours_worked;

                    $project->experienced_total_output += $position->experienced_total_output;
                    $project->experienced_total_hours_worked += $position->experienced_total_hours_worked;
                }

                $project->beginner_total_average_output = $project->beginner_total_hours_worked ? round($project->beginner_total_output / $project->beginner_total_hours_worked * $daily_work_hours, 2) : 0;
                $project->moderately_experienced_total_average_output = $project->moderately_experienced_total_hours_worked ? round($project->moderately_experienced_total_output / $project->moderately_experienced_total_hours_worked * $daily_work_hours, 2) : 0;
                $project->experienced_total_average_output = $project->experienced_total_hours_worked ? round($project->experienced_total_output / $project->experienced_total_hours_worked * $daily_work_hours, 2) : 0;

                $project->total_output = $project->beginner_total_output + $project->moderately_experienced_total_output + $project->experienced_total_output;
                $project->total_hours_worked = $project->beginner_total_hours_worked + $project->moderately_experienced_total_hours_worked + $project->experienced_total_hours_worked;
                $project->total_average_output = round($project->total_output / $project->total_hours_worked * $daily_work_hours, 2);
                    
            }
        }
        // return $this->projects;  

        Excel::create('PQR Project Summary Report '. $months[(int)$month-1] .' '. $year, function($excel){
            foreach ($this->projects as $project_key => $project) {
                $this->project = $project;
                if($project->first_report){
                    $excel->sheet($project->name, function($sheet) {
                        $sheet->loadView('excel.team-performance')
                            ->with('project', $this->project);
                    });
                }
            }
        })->download('xls');
    }

    public function searchMonthly(Request $request)
    {
        $daily_work_hours = (float)$request->daily_work_hours;
        $this->date_start = new Carbon('first Monday of '. $request->month .' '. $request->year);
        $this->date_end = new Carbon('last Monday of '. $request->month .' '. $request->year);
        $projects = Project::with('positions')->get();

        foreach ($projects as $project_key => $project) {
            $project->first_report =  Report::where('project_id', $project->id)->where('daily_work_hours', 'like', $daily_work_hours.'%')->whereBetween('date_start', [$this->date_start, $this->date_end])->first();
            
            if($project->first_report){
                $project->date_start = $this->date_start->toFormattedDateString();
                $project->date_end = $this->date_end->toFormattedDateString();
                $project->members = Experience::with(['member' => function($query){ $query->withTrashed(); }])->where('project_id', $project->id)->get();
                $project->beginner_total_output = 0;
                $project->beginner_total_hours_worked = 0;
                $project->beginner_total_average_output = 0;

                $project->moderately_experienced_total_output = 0;
                $project->moderately_experienced_total_hours_worked = 0;
                $project->moderately_experienced_total_average_output = 0;

                $project->experienced_total_output = 0;
                $project->experienced_total_hours_worked = 0;
                $project->experienced_total_average_output = 0;

                foreach ($project->positions as $position_key => $position) {
                    $position->beginner = 0;
                    $position->moderately_experienced = 0;
                    $position->experienced = 0;
                    $position->head_count = 0;

                    $position->beginner_total_output = 0;
                    $position->beginner_total_hours_worked = 0;
                    $position->beginner_total_average_output = 0;

                    $position->moderately_experienced_total_output = 0;
                    $position->moderately_experienced_total_hours_worked = 0;
                    $position->moderately_experienced_total_average_output = 0;

                    $position->experienced_total_output = 0;
                    $position->experienced_total_hours_worked = 0;
                    $position->experienced_total_average_output = 0;
                }

                foreach ($project->members as $member_key => $member) {
                    $member->positions = $project->positions;
                    $member->roles = 0;
                    $overall_monthly_productivity = 0;
                    $overall_monthly_quality = 0;
                    $overall_count = 0;

                    foreach ($member->positions as $position_key => $position) {
                        $performances = Performance::with('project', 'position')->with(['target' => function($query){ $query->withTrashed(); }])->with(['member' => function($query){ $query->with(['experiences' => function($query){ $query->with('project'); }]);}])->where('daily_work_hours', 'like', $project->first_report->daily_work_hours .'%')->where('position_id', $position->id)->where('member_id', $member->member_id)->whereBetween('date_start', [$this->date_start, $this->date_end])->get();

                        if(count($performances)){
                            $member->roles++;
                            $position->total_hours_worked = 0;
                            $position->total_output = 0;
                            $position->total_output_error = 0;
                            $position->total_average_output = 0;
                            $position->monthly_productivity = 0;
                            $position->monthly_quality = 0;

                            foreach ($performances as $performance_key => $performance) {
                                $position->total_hours_worked += $performance->hours_worked;
                                $position->total_output += $performance->output;
                                $position->total_output_error += $performance->output_error;

                                if($performance->target->experience == 'Beginner'){
                                    if($performance_key === 0){
                                        $project->positions[$position_key]->beginner += 1;
                                    }
                                    $project->positions[$position_key]->beginner_total_output += $performance->output;
                                    $project->positions[$position_key]->beginner_total_hours_worked += $performance->hours_worked;
                                }
                                else if($performance->target->experience == 'Moderately Experienced'){
                                    if($performance_key === 0){
                                        $project->positions[$position_key]->moderately_experienced += 1;
                                    }
                                    $project->positions[$position_key]->moderately_experienced_total_output += $performance->output;
                                    $project->positions[$position_key]->moderately_experienced_total_hours_worked += $performance->hours_worked;   
                                }
                                else if($performance->target->experience == 'Experienced'){
                                    if($performance_key === 0){
                                        $project->positions[$position_key]->experienced += 1;
                                    }
                                    $project->positions[$position_key]->experienced_total_output += $performance->output;
                                    $project->positions[$position_key]->experienced_total_hours_worked += $performance->hours_worked;
                                }
                            }

                            $project->positions[$position_key]->head_count = $project->positions[$position_key]->beginner + $project->positions[$position_key]->moderately_experienced + $project->positions[$position_key]->experienced;
                            $position->total_average_output = round($position->total_output / $position->total_hours_worked * $performances[0]->daily_work_hours, 2);
                            $position->monthly_productivity = round($position->total_average_output / $performances[0]->target->productivity * 100, 2);
                            $position->monthly_quality = round((1 - $position->total_output_error / $position->total_output) * 100, 2);

                            if($position->monthly_productivity < 100 && $position->monthly_quality >= $performances[0]->target->quality)
                            {
                                $position->quadrant = 'Quadrant 1'; 
                            }
                            else if($position->monthly_productivity >= 100 && $position->monthly_quality >= $performances[0]->target->quality)
                            {
                                $position->quadrant = 'Quadrant 2'; 
                            }
                            else if($position->monthly_productivity >= 100 && $position->monthly_quality < $performances[0]->target->quality)
                            {
                                $position->quadrant = 'Quadrant 3'; 
                            }
                            else if($position->monthly_productivity < 100 && $position->monthly_quality < $performances[0]->target->quality)
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
                }

                foreach ($project->positions as $position_key => $position) {                    
                    $position->beginner_total_average_output = $position->beginner_total_hours_worked ? round($position->beginner_total_output / $position->beginner_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                    $position->moderately_experienced_total_average_output = $position->moderately_experienced_total_hours_worked ? round($position->moderately_experienced_total_output / $position->moderately_experienced_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                    $position->experienced_total_average_output = $position->experienced_total_hours_worked ? round($position->experienced_total_output / $position->experienced_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                
                    $project->beginner_total_output += $position->beginner_total_output;
                    $project->beginner_total_hours_worked += $position->beginner_total_hours_worked;
                    
                    $project->moderately_experienced_total_output += $position->moderately_experienced_total_output;
                    $project->moderately_experienced_total_hours_worked += $position->moderately_experienced_total_hours_worked;

                    $project->experienced_total_output += $position->experienced_total_output;
                    $project->experienced_total_hours_worked += $position->experienced_total_hours_worked;
                }

                $project->beginner_total_average_output = $project->beginner_total_hours_worked ? round($project->beginner_total_output / $project->beginner_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                $project->moderately_experienced_total_average_output = $project->moderately_experienced_total_hours_worked ? round($project->moderately_experienced_total_output / $project->moderately_experienced_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                $project->experienced_total_average_output = $project->experienced_total_hours_worked ? round($project->experienced_total_output / $project->experienced_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;

                $project->total_output = $project->beginner_total_output + $project->moderately_experienced_total_output + $project->experienced_total_output;
                $project->total_hours_worked = $project->beginner_total_hours_worked + $project->moderately_experienced_total_hours_worked + $project->experienced_total_hours_worked;
                $project->total_average_output = round($project->total_output / $project->total_hours_worked * $project->first_report->daily_work_hours, 2);
            }            
        }

        return $projects;

    }
    public function monthly()
    {
        $this->date_start = new Carbon('first Monday of this month');
        $this->date_end = new Carbon('last Monday of this month');
        $projects = Project::with('positions')->get();

        foreach ($projects as $project_key => $project) {
            $project->first_report =  Report::where('project_id', $project->id)->whereBetween('date_start', [$this->date_start, $this->date_end])->first();
            
            if($project->first_report){
                $project->date_start = $this->date_start->toFormattedDateString();
                $project->date_end = $this->date_end->toFormattedDateString();
                $project->members = Experience::with(['member' => function($query){ $query->withTrashed(); }])->where('project_id', $project->id)->get();
                $project->beginner_total_output = 0;
                $project->beginner_total_hours_worked = 0;
                $project->beginner_total_average_output = 0;

                $project->moderately_experienced_total_output = 0;
                $project->moderately_experienced_total_hours_worked = 0;
                $project->moderately_experienced_total_average_output = 0;

                $project->experienced_total_output = 0;
                $project->experienced_total_hours_worked = 0;
                $project->experienced_total_average_output = 0;

                foreach ($project->positions as $position_key => $position) {
                    $position->beginner = 0;
                    $position->moderately_experienced = 0;
                    $position->experienced = 0;

                    $position->beginner_total_output = 0;
                    $position->beginner_total_hours_worked = 0;
                    $position->beginner_total_average_output = 0;

                    $position->moderately_experienced_total_output = 0;
                    $position->moderately_experienced_total_hours_worked = 0;
                    $position->moderately_experienced_total_average_output = 0;

                    $position->experienced_total_output = 0;
                    $position->experienced_total_hours_worked = 0;
                    $position->experienced_total_average_output = 0;
                }

                foreach ($project->members as $member_key => $member) {
                    $member->positions = $project->positions;
                    $member->roles = 0;
                    $overall_monthly_productivity = 0;
                    $overall_monthly_quality = 0;
                    $overall_count = 0;

                    foreach ($member->positions as $position_key => $position) {
                        $performances = Performance::with('project', 'position')->with(['target' => function($query){ $query->withTrashed(); }])->with(['member' => function($query){ $query->with(['experiences' => function($query){ $query->with('project'); }]);}])->where('daily_work_hours', 'like', $project->first_report->daily_work_hours .'%')->where('position_id', $position->id)->where('member_id', $member->member_id)->whereBetween('date_start', [$this->date_start, $this->date_end])->get();

                        if(count($performances)){
                            $member->roles++;
                            $position->total_hours_worked = 0;
                            $position->total_output = 0;
                            $position->total_output_error = 0;
                            $position->total_average_output = 0;
                            $position->monthly_productivity = 0;
                            $position->monthly_quality = 0;

                            foreach ($performances as $performance_key => $performance) {
                                $position->total_hours_worked += $performance->hours_worked;
                                $position->total_output += $performance->output;
                                $position->total_output_error += $performance->output_error;

                                if($performance->target->experience == 'Beginner'){
                                    if($performance_key === 0){
                                        $project->positions[$position_key]->beginner += 1;
                                    } 
                                    $project->positions[$position_key]->beginner_total_output += $performance->output;
                                    $project->positions[$position_key]->beginner_total_hours_worked += $performance->hours_worked;
                                }
                                else if($performance->target->experience == 'Moderately Experienced'){
                                    if($performance_key === 0){
                                        $project->positions[$position_key]->moderately_experienced += 1;
                                    }
                                    $project->positions[$position_key]->moderately_experienced_total_output += $performance->output;
                                    $project->positions[$position_key]->moderately_experienced_total_hours_worked += $performance->hours_worked;   
                                }
                                else if($performance->target->experience == 'Experienced'){
                                    if($performance_key === 0){
                                        $project->positions[$position_key]->experienced += 1;
                                    }
                                    $project->positions[$position_key]->experienced_total_output += $performance->output;
                                    $project->positions[$position_key]->experienced_total_hours_worked += $performance->hours_worked;
                                }
                            }

                            $project->positions[$position_key]->head_count = $project->positions[$position_key]->beginner + $project->positions[$position_key]->moderately_experienced + $project->positions[$position_key]->experienced;
                            $position->total_average_output = round($position->total_output / $position->total_hours_worked * $performances[0]->daily_work_hours, 2);
                            $position->monthly_productivity = round($position->total_average_output / $performances[0]->target->productivity * 100, 2);
                            $position->monthly_quality = round((1 - $position->total_output_error / $position->total_output) * 100, 2);

                            if($position->monthly_productivity < 100 && $position->monthly_quality >= $performances[0]->target->quality)
                            {
                                $position->quadrant = 'Quadrant 1'; 
                            }
                            else if($position->monthly_productivity >= 100 && $position->monthly_quality >= $performances[0]->target->quality)
                            {
                                $position->quadrant = 'Quadrant 2'; 
                            }
                            else if($position->monthly_productivity >= 100 && $position->monthly_quality < $performances[0]->target->quality)
                            {
                                $position->quadrant = 'Quadrant 3'; 
                            }
                            else if($position->monthly_productivity < 100 && $position->monthly_quality < $performances[0]->target->quality)
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
                }

                foreach ($project->positions as $position_key => $position) {                    
                    $position->beginner_total_average_output = $position->beginner_total_hours_worked ? round($position->beginner_total_output / $position->beginner_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                    $position->moderately_experienced_total_average_output = $position->moderately_experienced_total_hours_worked ? round($position->moderately_experienced_total_output / $position->moderately_experienced_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                    $position->experienced_total_average_output = $position->experienced_total_hours_worked ? round($position->experienced_total_output / $position->experienced_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                
                    $project->beginner_total_output += $position->beginner_total_output;
                    $project->beginner_total_hours_worked += $position->beginner_total_hours_worked;
                    
                    $project->moderately_experienced_total_output += $position->moderately_experienced_total_output;
                    $project->moderately_experienced_total_hours_worked += $position->moderately_experienced_total_hours_worked;

                    $project->experienced_total_output += $position->experienced_total_output;
                    $project->experienced_total_hours_worked += $position->experienced_total_hours_worked;
                }

                $project->beginner_total_average_output = $project->beginner_total_hours_worked ? round($project->beginner_total_output / $project->beginner_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                $project->moderately_experienced_total_average_output = $project->moderately_experienced_total_hours_worked ? round($project->moderately_experienced_total_output / $project->moderately_experienced_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;
                $project->experienced_total_average_output = $project->experienced_total_hours_worked ? round($project->experienced_total_output / $project->experienced_total_hours_worked * $project->first_report->daily_work_hours, 2) : 0;

                $project->total_output = $project->beginner_total_output + $project->moderately_experienced_total_output + $project->experienced_total_output;
                $project->total_hours_worked = $project->beginner_total_hours_worked + $project->moderately_experienced_total_hours_worked + $project->experienced_total_hours_worked;
                $project->total_average_output = round($project->total_output / $project->total_hours_worked * $project->first_report->daily_work_hours, 2);
            }            
        }

        return $projects;
    }

    public function downloadMonthlySummary($month, $year, $daily_work_hours)
    {
        $months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $this->date_start = new Carbon('first Monday of '. $months[(int)$month-1] .' '. $year);
        $this->date_end = Carbon::parse('last Monday of '. $months[(int)$month-1] .' '. $year)->addDay();

        $this->projects = DB::table('projects')->get();

        foreach ($this->projects as $project_key => $project) {
            $this->project = $project;
            $project->positions = DB::table('positions')->where('project_id', $project->id)->get();

            $project->first_report = Report::where('project_id', $project->id)->where('daily_work_hours', 'like', $daily_work_hours.'%')->whereBetween('date_start', [$this->date_start, $this->date_end])->first();

            $project->weeks = array();
            
            $project->beginner = array();
            $project->moderately_experienced = array();
            $project->experienced = array();
            $project->quality = array();

            foreach ($project->positions as $position_key => $position) {
                // Beginner
                $previous_beginner_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Beginner')->where('created_at', '<', Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year))->orderBy('created_at', 'desc')->first();
                $beginner_productivity = count($previous_beginner_target) ? $previous_beginner_target : Target::where('position_id', $position->id)->where('experience', 'Beginner')->first();

                // Moderately Experienced
                $previous_moderately_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Moderately Experienced')->where('created_at', '<', Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year))->orderBy('created_at', 'desc')->first();
                $moderately_experienced_productivity = count($previous_moderately_experienced_target) ? $previous_moderately_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Moderately Experienced')->first();

                // Experienced
                $previous_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Experienced')->where('created_at', '<', Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year))->orderBy('created_at', 'desc')->first();
                $experienced_productivity = count($previous_experienced_target) ? $previous_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Experienced')->first();
                
                // Quality
                $previous_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Experienced')->where('created_at', '<', Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year))->orderBy('created_at', 'desc')->first();
                $quality = count($previous_experienced_target) ? $previous_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Experienced')->first();
                
                array_push($project->beginner, $beginner_productivity);
                array_push($project->moderately_experienced, $moderately_experienced_productivity);
                array_push($project->experienced, $experienced_productivity);
                array_push($project->quality, $quality);

                $position->members = DB::table('performances')
                    ->join('members', 'members.id', '=', 'performances.member_id')
                    ->select('members.*')
                    ->where('performances.position_id', $position->id)
                    ->where('performances.project_id', $project->id)
                    ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                    ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                    ->whereNull('performances.deleted_at')
                    ->groupBy('performances.member_id')
                    ->get();

                foreach ($position->members as $member_key => $member) {
                    $member->experience = Experience::where('member_id', $member->id)->where('project_id', $project->id)->first();
                    
                    $member->total_output = 0;
                    $member->total_output_error = 0;
                    $member->total_hours_worked = 0;
                    $member->monthly_productivity = 0;
                    $member->monthly_quality = 0;
                    $member->target = $member->experience->experience == 'Beginner' ? $beginner_productivity : ($member->experience->experience == 'Moderately Experienced' ? $moderately_experienced_productivity : $experienced_productivity);

                    $member->performances = array();

                    $date_end = Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year)->addDays(5);
                    
                    for ($date_start = Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year); $date_start->lt($this->date_end); $date_start->addWeek()) {

                        // $performances = Performance::with(['member' => function($query){ $query->with(['experiences' => function($query){ $query->where('project_id', $this->project->id);}]); }])->with('position')->where('position_id', $position->id)->where('project_id', $project->id)->whereBetween('date_start', [$date_start, $date_end])->where('daily_work_hours', 'like', $daily_work_hours.'%')->where('member_id', $member->id)->get();

                        $performances = DB::table('performances')->where('position_id', $position->id)->where('project_id', $project->id)->whereBetween('date_start', [$date_start, $date_end])->where('daily_work_hours', 'like', $daily_work_hours.'%')->where('member_id', $member->id)->whereNull('deleted_at')->get();

                        if(count($performances)){
                            foreach ($performances as $performance_key => $performance) {
                                if(count($performances) > 1 && $performance_key > 0){
                                    $performances[0]->output += $performance->output;
                                    $performances[0]->output_error += $performance->output_error;
                                    $performances[0]->hours_worked += $performance->hours_worked;
                                    $performances[0]->average_output = round($performances[0]->output / $performances[0]->hours_worked * $daily_work_hours, 2);
                                    $performances[0]->productivity = round($performances[0]->average_output / $member->target->productivity * 100, 2);
                                    $performances[0]->quality = round((1 - $performances[0]->output_error / $performances[0]->output) * 100, 2);
                                    if($performances[0]->productivity < 100 && $performances[0]->quality >= $member->target->quality)
                                    {
                                        $member->quadrant = 'Quadrant 1'; 
                                    }
                                    else if($performances[0]->productivity >= 100 && $performances[0]->quality >= $member->target->quality)
                                    {
                                        $member->quadrant = 'Quadrant 2'; 
                                    }
                                    else if($performances[0]->productivity >= 100 && $performances[0]->quality < $member->target->quality)
                                    {
                                        $member->quadrant = 'Quadrant 3'; 
                                    }
                                    else if($performances[0]->productivity < 100 && $performances[0]->quality < $member->target->quality)
                                    {
                                        $member->quadrant = 'Quadrant 4'; 
                                    }
                                }
                            }

                            array_push($member->performances, $performances[0]);
                        }
                        else{
                            $empty = new Performance;
                            $empty->output = 0;
                            $empty->output_error = 0;
                            $empty->hours_worked = 0;
                            $empty->productivity = 0;
                            $empty->quality = 0;
                            array_push($member->performances, $empty);
                        }


                        $date_end->addWeek(5);
                    }

                    foreach ($member->performances as $performance_key => $performance) {
                        $member->total_output += $performance->output;
                        $member->total_output_error += $performance->output_error;
                        $member->total_hours_worked += $performance->hours_worked;
                    }
                    
                    $member->total_average_output = round($member->total_output / $member->total_hours_worked * $daily_work_hours, 2);
                    $member->monthly_productivity = round($member->total_average_output / $member->target->productivity * 100, 2);
                    $member->monthly_quality = round((1 - $member->total_output_error / $member->total_output) * 100, 2);

                    if($member->monthly_productivity < 100 && $member->monthly_quality >= $member->target->quality)
                    {
                        $member->quadrant = 'Quadrant 1'; 
                    }
                    else if($member->monthly_productivity >= 100 && $member->monthly_quality >= $member->target->quality)
                    {
                        $member->quadrant = 'Quadrant 2'; 
                    }
                    else if($member->monthly_productivity >= 100 && $member->monthly_quality < $member->target->quality)
                    {
                        $member->quadrant = 'Quadrant 3'; 
                    }
                    else if($member->monthly_productivity < 100 && $member->monthly_quality < $member->target->quality)
                    {
                        $member->quadrant = 'Quadrant 4'; 
                    }
                }
            }

            $date_end = Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year)->addDays(5);

            for ($date_start = Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year); $date_start->lt($this->date_end); $date_start->addWeek()) {
                array_push($project->weeks, $date_start->toFormattedDateString().' to '. $date_end->toFormattedDateString());
                $date_end->addWeek();
            }

        }

        // return $this->projects; 

        Excel::create('PQR Monthly Summary '. $this->date_start->toFormattedDateString() . ' to ' . $this->date_end->toFormattedDateString(), function($excel){
            foreach ($this->projects as $project_key => $project) {
                $this->project = $project;
                if($this->project->first_report){
                    $excel->sheet($this->project->name, function($sheet) {
                        $sheet->loadView('excel.monthly')
                            ->with('project', $this->project);
                    });
                }
            }
        })->download('xls');
    }

    public function downloadMonthlyDepartment($department_id, $month, $year, $daily_work_hours)
    {
        $months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $this->date_start = new Carbon('first Monday of '. $months[(int)$month-1] .' '. $year);
        $this->date_end = Carbon::parse('last Monday of '. $months[(int)$month-1] .' '. $year)->addDay();

        $this->projects = DB::table('projects')->where('department_id', $department_id)->get();

        foreach ($this->projects as $project_key => $project) {
            $this->project = $project;
            $project->positions = DB::table('positions')->where('project_id', $project->id)->get();

            $project->first_report = Report::where('project_id', $project->id)->where('daily_work_hours', 'like', $daily_work_hours.'%')->whereBetween('date_start', [$this->date_start, $this->date_end])->first();

            $project->weeks = array();
            
            $project->beginner = array();
            $project->moderately_experienced = array();
            $project->experienced = array();
            $project->quality = array();

            foreach ($project->positions as $position_key => $position) {
                // Beginner
                $previous_beginner_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Beginner')->where('created_at', '<', Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year))->orderBy('created_at', 'desc')->first();

                $beginner_productivity = count($previous_beginner_target) ? $previous_beginner_target : Target::where('position_id', $position->id)->where('experience', 'Beginner')->first();

                // Moderately Experienced
                $previous_moderately_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Moderately Experienced')->where('created_at', '<', Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year))->orderBy('created_at', 'desc')->first();
                $moderately_experienced_productivity = count($previous_moderately_experienced_target) ? $previous_moderately_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Moderately Experienced')->first();

                // Experienced
                $previous_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Experienced')->where('created_at', '<', Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year))->orderBy('created_at', 'desc')->first();
                $experienced_productivity = count($previous_experienced_target) ? $previous_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Experienced')->first();
                
                // Quality
                $previous_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Experienced')->where('created_at', '<', Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year))->orderBy('created_at', 'desc')->first();
                $quality = count($previous_experienced_target) ? $previous_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Experienced')->first();
                
                array_push($project->beginner, $beginner_productivity);
                array_push($project->moderately_experienced, $moderately_experienced_productivity);
                array_push($project->experienced, $experienced_productivity);
                array_push($project->quality, $quality);

                $position->members = DB::table('performances')
                    ->join('members', 'members.id', '=', 'performances.member_id')
                    ->select('members.*')
                    ->where('performances.position_id', $position->id)
                    ->where('performances.project_id', $project->id)
                    ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                    ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                    ->whereNull('performances.deleted_at')
                    ->groupBy('performances.member_id')
                    ->get();

                foreach ($position->members as $member_key => $member) {
                    $member->experience = Experience::where('member_id', $member->id)->where('project_id', $project->id)->first();
                    
                    $member->total_output = 0;
                    $member->total_output_error = 0;
                    $member->total_hours_worked = 0;
                    $member->monthly_productivity = 0;
                    $member->monthly_quality = 0;
                    $member->target = $member->experience->experience == 'Beginner' ? $beginner_productivity : ($member->experience->experience == 'Moderately Experienced' ? $moderately_experienced_productivity : $experienced_productivity);

                    $member->performances = array();

                    $date_end = Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year)->addDays(5);
                    
                    for ($date_start = Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year); $date_start->lt($this->date_end); $date_start->addWeek()) {

                        // $performances = Performance::with(['member' => function($query){ $query->with(['experiences' => function($query){ $query->where('project_id', $this->project->id);}]); }])->with('position')->where('position_id', $position->id)->where('project_id', $project->id)->whereBetween('date_start', [$date_start, $date_end])->where('daily_work_hours', 'like', $daily_work_hours.'%')->where('member_id', $member->id)->get();

                        $performances = DB::table('performances')->where('position_id', $position->id)->where('project_id', $project->id)->whereBetween('date_start', [$date_start, $date_end])->where('daily_work_hours', 'like', $daily_work_hours.'%')->where('member_id', $member->id)->whereNull('deleted_at')->get();

                        if(count($performances)){
                            foreach ($performances as $performance_key => $performance) {
                                if(count($performances) > 1 && $performance_key > 0){
                                    $performances[0]->output += $performance->output;
                                    $performances[0]->output_error += $performance->output_error;
                                    $performances[0]->hours_worked += $performance->hours_worked;
                                    $performances[0]->average_output = round($performances[0]->output / $performances[0]->hours_worked * $daily_work_hours, 2);
                                    $performances[0]->productivity = round($performances[0]->average_output / $member->target->productivity * 100, 2);
                                    $performances[0]->quality = round((1 - $performances[0]->output_error / $performances[0]->output) * 100, 2);
                                    if($performances[0]->productivity < 100 && $performances[0]->quality >= $member->target->quality)
                                    {
                                        $member->quadrant = 'Quadrant 1'; 
                                    }
                                    else if($performances[0]->productivity >= 100 && $performances[0]->quality >= $member->target->quality)
                                    {
                                        $member->quadrant = 'Quadrant 2'; 
                                    }
                                    else if($performances[0]->productivity >= 100 && $performances[0]->quality < $member->target->quality)
                                    {
                                        $member->quadrant = 'Quadrant 3'; 
                                    }
                                    else if($performances[0]->productivity < 100 && $performances[0]->quality < $member->target->quality)
                                    {
                                        $member->quadrant = 'Quadrant 4'; 
                                    }
                                }
                            }

                            array_push($member->performances, $performances[0]);
                        }
                        else{
                            $empty = new Performance;
                            $empty->output = 0;
                            $empty->output_error = 0;
                            $empty->hours_worked = 0;
                            $empty->productivity = 0;
                            $empty->quality = 0;
                            array_push($member->performances, $empty);
                        }


                        $date_end->addWeek(5);
                    }

                    foreach ($member->performances as $performance_key => $performance) {
                        $member->total_output += $performance->output;
                        $member->total_output_error += $performance->output_error;
                        $member->total_hours_worked += $performance->hours_worked;
                    }
                    
                    $member->total_average_output = round($member->total_output / $member->total_hours_worked * $daily_work_hours, 2);
                    $member->monthly_productivity = round($member->total_average_output / $member->target->productivity * 100, 2);
                    $member->monthly_quality = round((1 - $member->total_output_error / $member->total_output) * 100, 2);

                    if($member->monthly_productivity < 100 && $member->monthly_quality >= $member->target->quality)
                    {
                        $member->quadrant = 'Quadrant 1'; 
                    }
                    else if($member->monthly_productivity >= 100 && $member->monthly_quality >= $member->target->quality)
                    {
                        $member->quadrant = 'Quadrant 2'; 
                    }
                    else if($member->monthly_productivity >= 100 && $member->monthly_quality < $member->target->quality)
                    {
                        $member->quadrant = 'Quadrant 3'; 
                    }
                    else if($member->monthly_productivity < 100 && $member->monthly_quality < $member->target->quality)
                    {
                        $member->quadrant = 'Quadrant 4'; 
                    }
                }
            }

            $date_end = Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year)->addDays(5);

            for ($date_start = Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year); $date_start->lt($this->date_end); $date_start->addWeek()) {
                array_push($project->weeks, $date_start->toFormattedDateString().' to '. $date_end->toFormattedDateString());
                $date_end->addWeek();
            }

        }

        Excel::create('PQR Monthly Summary '. $this->date_start->toFormattedDateString() . ' to ' . $this->date_end->toFormattedDateString(), function($excel){
            foreach ($this->projects as $project_key => $project) {
                $this->project = $project;
                if($this->project->first_report){
                    $excel->sheet($this->project->name, function($sheet) {
                        $sheet->loadView('excel.monthly')
                            ->with('project', $this->project);
                    });
                }
            }
        })->download('xls');
    }
    public function downloadSummary($date_start, $date_end, $daily_work_hours)
    {
        // $preview = (int)$preview;

        $this->projects = DB::table('projects')->whereNull('deleted_at')->get();

        foreach ($this->projects as $project_key => $project) {
            $project->reports = Report::with(['performances' => function($query){ $query->with(['member' => function($query){ $query->withTrashed(); }])->with('position'); }])->with(['project' => function($query){ $query->with('positions'); }])->where('project_id', $project->id)->where('date_start', Carbon::parse($date_start))->where('date_end', Carbon::parse($date_end))->where('daily_work_hours', 'like', $daily_work_hours.'%')->orderBy('date_start', 'desc')->get();   
            
            if(count($project->reports)){
                $project->department = DB::table('departments')->where('id', $project->reports[0]->department_id)->first();
                
                $project->department->beginner = array();
                $project->department->moderately_experienced = array();
                $project->department->experienced = array();
                $project->department->quality = array();

                foreach ($project->reports[0]->project->positions as $position_key => $position) {
                    // Beginner
                    $previous_beginner_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Beginner')->where('created_at', '<', $project->reports[0]->date_start)->orderBy('created_at', 'desc')->first();
                    $beginner_productivity = count($previous_beginner_target) ? $previous_beginner_target : Target::where('position_id', $position->id)->where('experience', 'Beginner')->first();

                    // Moderately Experienced
                    $previous_moderately_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Moderately Experienced')->where('created_at', '<', $project->reports[0]->date_start)->orderBy('created_at', 'desc')->first();
                    $moderately_experienced_productivity = count($previous_moderately_experienced_target) ? $previous_moderately_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Moderately Experienced')->first();

                    // Experienced
                    $previous_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Experienced')->where('created_at', '<', $project->reports[0]->date_start)->orderBy('created_at', 'desc')->first();
                    $experienced_productivity = count($previous_experienced_target) ? $previous_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Experienced')->first();
                    
                    // Quality
                    $previous_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Experienced')->where('created_at', '<', $project->reports[0]->date_start)->orderBy('created_at', 'desc')->first();
                    $quality = count($previous_experienced_target) ? $previous_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Experienced')->first();
                    
                    array_push($project->department->beginner, $beginner_productivity);
                    array_push($project->department->moderately_experienced, $moderately_experienced_productivity);
                    array_push($project->department->experienced, $experienced_productivity);
                    array_push($project->department->quality, $quality);
                }

                foreach ($project->reports as $report_key => $report) {
                    foreach ($report->performances as $performance_key => $performance) {
                        $performance->experience = Experience::where('member_id', $performance->member_id)->where('project_id', $performance->project_id)->first()->experience;
                    }
                }
            }

        }

        // if(!$preview){
            Excel::create('PQR Weekly Summary '. Carbon::parse($date_start)->toFormattedDateString() . ' to ' . Carbon::parse($date_end)->toFormattedDateString(), function($excel)
            {
                foreach ($this->projects as $project_key => $project) {
                    $this->project = $project;
                    if(count($this->project->reports)){
                        $excel->sheet($this->project->name, function($sheet) {
                            $sheet->loadView('excel.weekly')
                                ->with('project', $this->project);
                        });
                    }
                }
            })->download('xls');
        // }
        // else{
            return view('preview.weekly')->with('projects', $this->projects);
        // }

    }

    public function downloadWeeklyDepartment($department_id, $date_start, $date_end, $daily_work_hours)
    {
        $user = Auth::user();

        if($user->department_id != $department_id || !$user){
            abort(403);
        }

        $this->projects = DB::table('projects')->where('department_id', $department_id)->whereNull('deleted_at')->get();

        foreach ($this->projects as $project_key => $project) {
            $project->reports = Report::with(['performances' => function($query){ $query->with(['member' => function($query){ $query->withTrashed();}])->with('position'); }])->with(['project' => function($query){ $query->with('positions'); }])->where('project_id', $project->id)->where('date_start', Carbon::parse($date_start))->where('date_end', Carbon::parse($date_end))->where('daily_work_hours', 'like', $daily_work_hours.'%')->orderBy('date_start', 'desc')->get();   
            
            if(count($project->reports)){
                $project->department = DB::table('departments')->where('id', $department_id)->first();
                
                $project->department->beginner = array();
                $project->department->moderately_experienced = array();
                $project->department->experienced = array();
                $project->department->quality = array();

                foreach ($project->reports[0]->project->positions as $position_key => $position) {
                    // Beginner
                    $previous_beginner_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Beginner')->where('created_at', '<', $project->reports[0]->date_start)->orderBy('created_at', 'desc')->first();
                    $beginner_productivity = count($previous_beginner_target) ? $previous_beginner_target : Target::where('position_id', $position->id)->where('experience', 'Beginner')->first();

                    // Moderately Experienced
                    $previous_moderately_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Moderately Experienced')->where('created_at', '<', $project->reports[0]->date_start)->orderBy('created_at', 'desc')->first();
                    $moderately_experienced_productivity = count($previous_moderately_experienced_target) ? $previous_moderately_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Moderately Experienced')->first();

                    // Experienced
                    $previous_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Experienced')->where('created_at', '<', $project->reports[0]->date_start)->orderBy('created_at', 'desc')->first();
                    $experienced_productivity = count($previous_experienced_target) ? $previous_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Experienced')->first();
                    
                    // Quality
                    $previous_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Experienced')->where('created_at', '<', $project->reports[0]->date_start)->orderBy('created_at', 'desc')->first();
                    $quality = count($previous_experienced_target) ? $previous_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Experienced')->first();
                    
                    array_push($project->department->beginner, $beginner_productivity);
                    array_push($project->department->moderately_experienced, $moderately_experienced_productivity);
                    array_push($project->department->experienced, $experienced_productivity);
                    array_push($project->department->quality, $quality);
                }

                foreach ($project->reports as $report_key => $report) {
                    foreach ($report->performances as $performance_key => $performance) {
                        $performance->experience = Experience::where('member_id', $performance->member_id)->where('project_id', $performance->project_id)->first()->experience;
                    }
                }
            }

        }

        // return response()->json('$this->projects');

        Excel::create('PQR '. $this->projects[0]->department->name .' Weekly Summary '. Carbon::parse($date_start)->toFormattedDateString() . ' to ' . Carbon::parse($date_end)->toFormattedDateString(), function($excel)
        {
            foreach ($this->projects as $project_key => $project) {
                $this->project = $project;
                if(count($this->project->reports)){
                    $excel->sheet($this->project->name, function($sheet) {
                        $sheet->loadView('excel.weekly')
                            ->with('project', $this->project);
                    });
                }
            }
        })->download('xls');
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
            ->whereNull('performances.deleted_at')
            ->whereNull('reports.deleted_at')
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
                ->where('created_at', '<=', $value->date_end)
                ->orderBy('created_at', 'desc')
                ->get();

            if(!$beginner)
            {
                $beginner = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('project_id', $value->project_id)
                    ->where('experience', 'Beginner')
                    // ->where('created_at', '<=', $value->date_end)
                    ->where('active', true)
                    ->get();                
            }

            $moderately_experienced = DB::table('targets')
                ->where('type', 'Productivity')
                ->where('project_id', $value->project_id)
                ->where('experience', 'Moderately Experienced')
                ->where('created_at', '<=', $value->date_end)
                ->orderBy('created_at', 'desc')
                ->get();

            if(!$moderately_experienced)
            {
                $moderately_experienced = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('project_id', $value->project_id)
                    ->where('experience', 'Moderately Experienced')
                    // ->where('created_at', '<=', $value->date_end)
                    ->where('active', true)
                    ->get();                
            }

            $experienced = DB::table('targets')
                ->where('type', 'Productivity')
                ->where('project_id', $value->project_id)
                ->where('experience', 'Experienced')
                ->where('created_at', '<=', $value->date_end)
                ->orderBy('created_at', 'desc')
                ->get();

            if(!$experienced)
            {
                $experienced = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('project_id', $value->project_id)
                    ->where('experience', 'Experienced')
                    // ->where('created_at', '<=', $value->date_end)
                    ->where('active', true)
                    ->get();

            }

            $quality = DB::table('targets')
                ->where('type', 'Quality')
                ->where('project_id', $value->project_id)
                ->groupBy('position_id')
                ->where('created_at', '<=', $value->date_end)
                ->orderBy('created_at', 'desc')
                ->get();

            if(!$quality)
            {
                $quality = DB::table('targets')
                    ->where('type', 'Quality')
                    ->where('project_id', $value->project_id)
                    ->groupBy('position_id')
                    // ->where('created_at', '<=', $value->date_end)
                    ->where('active', true)
                    ->get();

            }

            if($value->productivity < 100 && $value->quality >= 100)
            {
                $value->quadrant = 'Quadrant 1';
            }
            else if($value->productivity >= 100 && $value->quality >= 100)
            {
                $value->quadrant = 'Quadrant 2';
            }
            else if ($value->productivity >= 100 && $value->quality < 100)
            {
                $value->quadrant = 'Quadrant 3';
            }
            else{
                $value->quadrant = 'Quadrant 4';
            }
        }

        Excel::create('PQR - '. $details->department_name .' ('. $details->project_name.')', function($excel) {
            global $details;
            $date_start_create = date_create($details->date_start);
            $date_end_create = date_create($details->date_end);
            $date_start_format =  date_format($date_start_create,"Y-m-d"); 
            $date_end_format =  date_format($date_end_create,"Y-m-d"); 
            $excel->sheet($date_start_format .' to '. $date_end_format, function($sheet) {
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
        return Report::with('team_leader')->with(['performances' => function($query){ $query->with(['member' => function($query){ $query->with('experiences');}])->with('position'); }])->with(['project' => function($query){ $query->with(['positions' => function($query){ $query->with(['targets' => function($query){ $query->withTrashed()->orderBy('created_at', 'desc'); }]);}]); }])->where('department_id', $id)->where('date_start', Carbon::parse($request->date_start))->where('date_end', Carbon::parse($request->date_end))->orderBy('date_start', 'desc')->get();
    }

    public function search(Request $request)
    {
        return Report::with('team_leader')->with(['performances' => function($query){ $query->with(['member' => function($query){ $query->with('experiences');}])->with('position'); }])->with(['project' => function($query){ $query->with(['positions' => function($query){ $query->with(['targets' => function($query){ $query->withTrashed()->orderBy('created_at', 'desc'); }]);}]); }])->where('department_id', Auth::user()->department_id)->where('date_start', Carbon::parse($request->date_start))->where('date_end', Carbon::parse($request->date_end))->orderBy('date_start', 'desc')->get();
    }
    public function paginateDetails()
    {
        return Report::with('team_leader')->with(['performances' => function($query){ $query->with(['member' => function($query){ $query->with('experiences');}])->with('position'); }])->with(['project' => function($query){ $query->with(['positions' => function($query){ $query->with(['targets' => function($query){ $query->withTrashed()->orderBy('created_at', 'desc'); }]);}]); }])->with('team_leader')->where('department_id', Auth::user()->department_id)->orderBy('date_start', 'desc')->paginate(10);   
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
                    DB::raw('DATE_FORMAT(performances.date_start, "%b. %d, %Y") as date_start_formatted'),
                    DB::raw('DATE_FORMAT(performances.date_end, "%b. %d, %Y") as date_end_formatted'),
                    'results.*',
                    'projects.*',
                    'projects.name as project',
                    'positions.name as position'
                )
                ->whereNull('reports.deleted_at')
                ->whereNull('performances.deleted_at')
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
                    ->where('targets.created_at', '<=', $this->date_end)
                    ->orderBy('targets.created_at', 'desc')
                    ->first();

                if(!$quality_target)
                {
                    $quality_target = DB::table('targets')
                    ->join('positions', 'positions.id', '=', 'targets.position_id')
                    ->join('members', 'members.experience', '=', 'targets.experience')
                    ->select('*')
                    ->where('targets.position_id', $queryValue->position_id)
                    ->where('targets.experience', $queryValue->experience)
                    ->where('targets.type', 'Quality')
                    // ->where('targets.created_at', '<=', $this->date_end)
                    ->where('targets.active', true)
                    ->first();
                }

                    if($queryValue->productivity < 100 && $queryValue->quality >= 100)
                    {
                        $queryValue->quadrant = 'Quadrant 1';
                    }
                    else if($queryValue->productivity >= 100 && $queryValue->quality >= 100)
                    {
                        $queryValue->quadrant = 'Quadrant 2';
                    }
                    else if ($queryValue->productivity >= 100 && $queryValue->quality < 100)
                    {
                        $queryValue->quadrant = 'Quadrant 3';
                    }
                    else{
                        $queryValue->quadrant = 'Quadrant 4';
                    }

                    // $queryValue->quota = (($queryValue->productivity >= 100) && ($queryValue->quality >= $quality_target->value)) ? 'Met' : 'Not met';
            }

                // push each results to custom array
                array_push($report_array, $query);
        }
        return response()->json($report_array);
    }

    public function paginateDepartmentDetails($departmentID)
    {
        return Report::with('team_leader')->with(['performances' => function($query){ $query->with(['member' => function($query){ $query->with('experiences');}])->with('position'); }])->with(['project' => function($query){ $query->with(['positions' => function($query){ $query->with(['targets' => function($query){ $query->withTrashed()->orderBy('created_at', 'desc'); }]);}]); }])->where('department_id', $departmentID)->orderBy('date_start', 'desc')->paginate(10);
    }
    public function paginateDepartment($departmentID)
    {
        $report = Report::with(['performances' => function($query){ $query->with('member', 'position', 'project', 'result'); }])->where('department_id', $departmentID)->orderBy('date_start', 'desc')->paginate(4);
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
                    DB::raw('DATE_FORMAT(performances.date_start, "%b. %d, %Y") as date_start_formatted'),
                    DB::raw('DATE_FORMAT(performances.date_end, "%b. %d, %Y") as date_end_formatted'),
                    'results.*',
                    'projects.*',
                    'projects.name as project',
                    'positions.name as position',
                    'reports.id as id'
                )
                ->whereNull('reports.deleted_at')
                ->whereNull('performances.deleted_at')
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
                        ->where('targets.created_at', '<=', $value->date_end)
                        ->orderBy('targets.created_at', 'desc')
                        ->first();

                    if(!$quality_target)
                    {
                        $quality_target = DB::table('targets')
                            ->join('positions', 'positions.id', '=', 'targets.position_id')
                            ->join('members', 'members.experience', '=', 'targets.experience')
                            ->select('*')
                            ->where('targets.position_id', $queryValue->position_id)
                            ->where('targets.experience', $queryValue->experience)
                            ->where('targets.type', 'Quality')
                            // ->where('targets.created_at', '<=', $value->date_end)
                            ->where('targets.active', true)
                            ->first();
                    }
                        if($queryValue->productivity < 100 && $queryValue->quality >= 100)
                        {
                            $queryValue->quadrant = 'Quadrant 1';
                        }
                        else if($queryValue->productivity >= 100 && $queryValue->quality >= 100)
                        {
                            $queryValue->quadrant = 'Quadrant 2';
                        }
                        else if ($queryValue->productivity >= 100 && $queryValue->quality < 100)
                        {
                            $queryValue->quadrant = 'Quadrant 3';
                        }
                        else{
                            $queryValue->quadrant = 'Quadrant 4';
                        }

                        // $queryValue->quota = (($queryValue->productivity >= 100) && ($queryValue->quality >= $quality_target->value)) ? 'Met' : 'Not met';
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
        return Report::withTrashed()->with('team_leader')->with(['performances' => function($query){ $query->withTrashed()->with(['member' => function($query){ $query->with('experiences');}])->with('position'); }])->with(['project' => function($query){ $query->with(['positions' => function($query){ $query->with(['targets' => function($query){ $query->withTrashed()->orderBy('created_at', 'desc'); }]);}]); }])->with('team_leader')->where('id', $id)->first();
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

        Performance::where('report_id', $id)->delete();
        // Result::where('report_id', $id)->delete();
        DB::table('approvals')->where('report_id')->delete();
        DB::table('performance_approvals')->where('report_id')->delete();
        DB::table('performance_histories')->where('report_id')->delete();
    }
}
