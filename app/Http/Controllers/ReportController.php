<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Report;
use App\Performance;
use App\Result;
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
        $project->members = Experience::with('member')->where('project_id', $project->id)->get();

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
                        $member->average_output = $member->total_output / $member->total_hours_worked * $first_report->daily_work_hours;
                        $member->monthly_productivity = round($member->average_output / $target->productivity * 100);
                        $member->monthly_quality = round((1 - $member->total_output_error / $member->total_output) * 100);

                        if($member->monthly_productivity < $target->productivity && $member->monthly_quality >= $target->quality)
                        {
                            $member->quadrant = 'Quadrant 1'; 
                        }
                        else if($member->monthly_productivity >= $target->productivity && $member->monthly_quality >= $target->quality)
                        {
                            $member->quadrant = 'Quadrant 2'; 
                        }
                        else if($member->monthly_productivity >= $target->productivity && $member->monthly_quality < $target->quality)
                        {
                            $member->quadrant = 'Quadrant 3'; 
                        }
                        else if($member->monthly_productivity < $target->productivity && $member->monthly_quality < $target->quality)
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
        $this->date_start = ($request->month && $request->year) ? new Carbon('first Monday of '. $request->month .' '. $request->year) : new Carbon('first Monday of this month'); // first Monday of the month
        $this->date_end = ($request->month && $request->year) ? new Carbon('last Monday of '. $request->month .' '. $request->year) : new Carbon('last Monday of this month'); // last Monday of the month

        $this->projects = Project::with('positions')->where('department_id', Auth::user()->department_id)->get();
        foreach ($this->projects as $project_key => $project) {
            // if(!$request->daily_work_hours){
                $first_report = !$request->daily_work_hours ? Report::where('project_id', $project->id)->whereBetween('date_start', [$this->date_start, $this->date_end])->orderBy('date_start')->first() : null;
            // }
            // if($first_report){
            $daily_work_hours = $first_report ? $first_report->daily_work_hours : $request->daily_work_hours;
            // }
                $project->reports = Report::with('project')->where('project_id', $project->id)->whereBetween('date_start', [$this->date_start, $this->date_end])->where('daily_work_hours', 'like', $daily_work_hours.'%')->get();   
                $project->members = Experience::with('member')->where('project_id', $project->id)->get();

                foreach ($project->members as $member_key => $member) {
                    $member->total_output = 0;
                    $member->total_output_error = 0;
                    $member->total_hours_worked = 0;
                    $member->average_output = 0;
                    $member->monthly_productivity = 0;
                    $member->monthly_quality = 0;
                }
                
                foreach ($project->reports as $report_key => $report) {
                    $project->position = $report->project->positions[0];
                    $report->members = Experience::with('member')->where('project_id', $report->project_id)->get();

                    foreach ($report->members as $member_key => $member) {
                        $member->performance = Performance::with('position')->with(['target' => function($query){ $query->withTrashed(); }])->where('member_id', $member->member_id)->where('report_id', $report->id)->where('position_id', $project->position->id)->first();
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
                                if($project->reports[$i]->members[$member_key]->performance->position_id == $project->position->id){
                                    $target = $project->reports[$i]->members[$member_key]->performance->target;
                                    $member->average_output = $member->total_output / $member->total_hours_worked * $daily_work_hours;
                                    $member->monthly_productivity = round($member->average_output / $target->productivity * 100);
                                    $member->monthly_quality = round((1 - $member->total_output_error / $member->total_output) * 100);

                                    if($member->monthly_productivity < $target->productivity && $member->monthly_quality >= $target->quality)
                                    {
                                        $member->quadrant = 'Quadrant 1'; 
                                    }
                                    else if($member->monthly_productivity >= $target->productivity && $member->monthly_quality >= $target->quality)
                                    {
                                        $member->quadrant = 'Quadrant 2'; 
                                    }
                                    else if($member->monthly_productivity >= $target->productivity && $member->monthly_quality < $target->quality)
                                    {
                                        $member->quadrant = 'Quadrant 3'; 
                                    }
                                    else if($member->monthly_productivity < $target->productivity && $member->monthly_quality < $target->quality)
                                    {
                                        $member->quadrant = 'Quadrant 4'; 
                                    }
                                }
                            }
                        }
                    }
                }

                $project->date_cover_start = $this->date_start->toFormattedDateString();
                $project->date_cover_end = $this->date_end->toFormattedDateString();
            // }   
        }

        return $this->projects;
    }

    public function teamPerformance($month, $year, $daily_work_hours)
    {
        $months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $daily_work_hours = (float)$daily_work_hours;
        $this->date_start = new Carbon('last day of last month '. $months[(int)$month-1] .' '. $year);
        $this->date_end = new Carbon('first day of next month'. $months[(int)$month-1] .' '. $year);

        $this->projects = DB::table('projects')->get();

        foreach ($this->projects as $project_key => $project_value) {
            // for each projects fetch its positions
            $positions = DB::table('positions')->where('project_id', $project_value->id)->get();
            $project_value->positions = $positions;
            
            if(count($positions)){
                foreach ($positions as $position_key => $position_value) {
                    /* Head Count */

                    $position_head_count_array = array();
                    // instantiate date end
                    $date_end = Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year)->addWeek();
                    // start at first monday of the month then increment it weekly 
                    for ($date_start = Carbon::parse('first Monday of'. $months[(int)$month-1] .' '. (int)$year); $date_start->lt($this->date_end); $date_start->addWeek()) { 
                        // fetch the performances by members to check the positions
                        $performances = DB::table('performances')
                            ->join('positions', 'positions.id', '=', 'performances.position_id')
                            ->join('members', 'members.id', '=', 'performances.member_id')
                            ->select(
                                'performances.*',
                                'positions.name as position'
                            )
                            ->where('performances.position_id', $position_value->id)
                            ->whereBetween('performances.date_start', [$date_start, $date_end])
                            ->whereNull('performances.deleted_at')
                            ->groupBy('performances.member_id')
                            ->get();

                        array_push($position_head_count_array, $performances);

                        // increment the date end
                        $date_end->addWeek();              
                    }
                    // for each positions count the members per week and compare its head count
                    foreach ($position_head_count_array as $position_head_count_array_key => $position_head_count_array_value) {
                        if($position_head_count_array_key == 0){
                            $position_value->head_count = count($position_head_count_array_value);
                        }
                        else{
                            $position_value->head_count = $position_value->head_count < count($position_head_count_array_value) ? count($position_head_count_array_value) : $position_value->head_count;
                        }
                    }

                    $project_value->beginner_total_output = 0;
                    $project_value->beginner_total_man_hours = 0;
                    $project_value->beginner_total_average_output = 0;
                    
                    $project_value->moderately_experienced_total_output = 0;
                    $project_value->moderately_experienced_total_man_hours = 0;
                    $project_value->moderately_experienced_total_average_output = 0;
                    
                    $project_value->experienced_total_output = 0;
                    $project_value->experienced_total_man_hours = 0;
                    $project_value->experienced_total_average_output = 0;
                    $project_value->beginner = array();
                    $project_value->moderately_experienced = array();
                    $project_value->experienced = array();

                    $beginner = DB::table('performances')
                        ->join('members', 'members.id', '=', 'performances.member_id')
                        ->select('performances.*')
                        ->where('members.experience', 'Beginner')
                        ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                        ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                        ->where('performances.project_id', $project_value->id)
                        ->whereNull('performances.deleted_at')
                        ->get();

                    if($beginner)
                    {
                        foreach ($beginner as $beginnerKey => $beginnerValue) {
                             $project_value->beginner_total_output += $beginnerValue->output;
                             $project_value->beginner_total_man_hours += $beginnerValue->hours_worked;
                        }

                        $project_value->beginner_total_average_output = $project_value->beginner_total_output / $project_value->beginner_total_man_hours * $daily_work_hours;
                        
                        $project_value->beginner = DB::table('performances')
                            ->join('positions', 'positions.id', '=', 'performances.position_id')
                            ->join('members', 'members.id', '=', 'performances.member_id')
                            ->select(
                                'performances.*',
                                'positions.name as position'
                            )
                            ->where('members.experience', 'Beginner')
                            ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                            ->whereNull('performances.deleted_at')
                            ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                            ->where('performances.project_id', $project_value->id)
                            ->groupBy('positions.id')
                            ->get();

                        foreach ($project_value->beginner as $beginnerKey => $beginnerValue) {
                            $query = DB::table('performances')
                                ->join('members', 'members.id', '=', 'performances.member_id')
                                ->where('members.experience', 'Beginner')
                                ->where('performances.position_id', $beginnerValue->position_id)
                                ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                                ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                                ->where('performances.project_id', $project_value->id)
                                ->whereNull('performances.deleted_at')
                                ->get();

                            $beginnerValue->total_output = 0;
                            $beginnerValue->total_man_hours = 0;
                            $beginnerValue->total_average_output = 0;

                            if($query)
                            {
                                foreach ($query as $queryKey => $queryValue) {
                                    $beginnerValue->total_output += $queryValue->output;
                                    $beginnerValue->total_man_hours += $queryValue->hours_worked;
                                }

                                $beginnerValue->total_average_output = round($beginnerValue->total_output / $beginnerValue->total_man_hours * $daily_work_hours, 2);
                            }
                        }
                    }

                    $moderately_experienced = DB::table('performances')
                        ->join('members', 'members.id', '=', 'performances.member_id')
                        ->select('performances.*')
                        ->where('members.experience', 'Moderately Experienced')
                        ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                        ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                        ->where('performances.project_id', $project_value->id)
                        ->whereNull('performances.deleted_at')
                        ->get();

                    if($moderately_experienced)
                    {
                        foreach ($moderately_experienced as $moderatelyExperiencedKey => $moderatelyExperiencedValue) {
                             $project_value->moderately_experienced_total_output += $moderatelyExperiencedValue->output;
                             $project_value->moderately_experienced_total_man_hours += $moderatelyExperiencedValue->hours_worked;
                        }

                        $project_value->moderately_experienced_total_average_output = $project_value->moderately_experienced_total_output / $project_value->moderately_experienced_total_man_hours * $daily_work_hours;
                        
                        $project_value->moderately_experienced = DB::table('performances')
                            ->join('positions', 'positions.id', '=', 'performances.position_id')
                            ->join('members', 'members.id', '=', 'performances.member_id')
                            ->select(
                                'performances.*',
                                'positions.name as position'
                            )
                            ->where('members.experience', 'Moderately Experienced')
                            ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                            ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                            ->where('performances.project_id', $project_value->id)
                            ->whereNull('performances.deleted_at')
                            ->groupBy('positions.id')
                            ->get();

                        foreach ($project_value->moderately_experienced as $moderatelyExperiencedKey => $moderatelyExperiencedValue) {
                            $query = DB::table('performances')
                                ->join('members', 'members.id', '=', 'performances.member_id')
                                ->where('members.experience', 'Moderately Experienced')
                                ->where('performances.position_id', $moderatelyExperiencedValue->position_id)
                                ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                                ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                                ->where('performances.project_id', $project_value->id)
                                ->whereNull('performances.deleted_at')
                                ->get();

                            $moderatelyExperiencedValue->total_output = 0;
                            $moderatelyExperiencedValue->total_man_hours = 0;
                            $moderatelyExperiencedValue->total_average_output = 0;

                            if($query)
                            {
                                foreach ($query as $queryKey => $queryValue) {
                                    $moderatelyExperiencedValue->total_output += $queryValue->output;
                                    $moderatelyExperiencedValue->total_man_hours += $queryValue->hours_worked;
                                }

                                $moderatelyExperiencedValue->total_average_output = round($moderatelyExperiencedValue->total_output / $moderatelyExperiencedValue->total_man_hours * $daily_work_hours, 2);
                            }
                        }
                    }

                    $experienced = DB::table('performances')
                        ->join('members', 'members.id', '=', 'performances.member_id')
                        ->select('performances.*')
                        ->where('members.experience', 'Experienced')
                        ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                        ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                        ->where('performances.project_id', $project_value->id)
                        ->whereNull('performances.deleted_at')
                        ->get();

                    if($experienced)
                    {
                        foreach ($experienced as $experiencedKey => $experiencedValue) {
                             $project_value->experienced_total_output += $experiencedValue->output;
                             $project_value->experienced_total_man_hours += $experiencedValue->hours_worked;
                        }

                        $project_value->experienced_total_average_output = $project_value->experienced_total_output / $project_value->experienced_total_man_hours * $daily_work_hours;
                        
                        $project_value->experienced = DB::table('performances')
                            ->join('positions', 'positions.id', '=', 'performances.position_id')
                            ->join('members', 'members.id', '=', 'performances.member_id')
                            ->select(
                                'performances.*',
                                'positions.name as position'
                            )
                            ->where('members.experience', 'Experienced')
                            ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                            ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                            ->where('performances.project_id', $project_value->id)
                            ->groupBy('positions.id')
                            ->whereNull('performances.deleted_at')
                            ->get();

                        foreach ($project_value->experienced as $experiencedKey => $experiencedValue) {
                            $query = DB::table('performances')
                                ->join('members', 'members.id', '=', 'performances.member_id')
                                ->where('members.experience', 'Experienced')
                                ->where('performances.position_id', $experiencedValue->position_id)
                                ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                                ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                                ->where('performances.project_id', $project_value->id)
                                ->whereNull('performances.deleted_at')
                                ->get();

                            $experiencedValue->total_output = 0;
                            $experiencedValue->total_man_hours = 0;
                            $experiencedValue->total_average_output = 0;

                            if($query)
                            {
                                foreach ($query as $queryKey => $queryValue) {
                                    $experiencedValue->total_output += $queryValue->output;
                                    $experiencedValue->total_man_hours += $queryValue->hours_worked;
                                }

                                $experiencedValue->total_average_output = round($experiencedValue->total_output / $experiencedValue->total_man_hours * $daily_work_hours, 2);
                            }
                        }
                    }

                    $project_value->overall_total_output = $project_value->beginner_total_output + $project_value->moderately_experienced_total_output + $project_value->experienced_total_output;
                    $project_value->overall_total_man_hours = $project_value->beginner_total_man_hours + $project_value->moderately_experienced_total_man_hours + $project_value->experienced_total_man_hours;
                    if(!$project_value->overall_total_man_hours)
                    {
                        $project_value->overall_total_average_output = 0;
                    }
                    else{
                        $project_value->overall_total_average_output = round($project_value->overall_total_output / $project_value->overall_total_man_hours * $daily_work_hours, 2);
                    }
                }
            }
            else{
                $project_value->beginner_total_output = 0;
                $project_value->beginner_total_man_hours = 0;
                $project_value->beginner_total_average_output = 0;
                
                $project_value->moderately_experienced_total_output = 0;
                $project_value->moderately_experienced_total_man_hours = 0;
                $project_value->moderately_experienced_total_average_output = 0;
                
                $project_value->experienced_total_output = 0;
                $project_value->experienced_total_man_hours = 0;
                $project_value->experienced_total_average_output = 0;
                $project_value->beginner = array();
                $project_value->moderately_experienced = array();
                $project_value->experienced = array();

                $project_value->overall_total_output = 0;
                $project_value->overall_total_man_hours = 0;
                $project_value->overall_total_average_output = 0;
            }
        }

        // return $this->projects;  

        Excel::create('PQR Project Summary Report '. $months[(int)$month-1] .' '. $year, function($excel){
            foreach ($this->projects as $key => $value) {
                $this->details = $value;
                $excel->sheet($value->name, function($sheet) {
                    $sheet->loadView('excel.team-performance')
                        ->with('details', $this->details);
                });
            }
        })->download('xlsx');
    }

    public function searchMonthly(Request $request)
    {
        $all = array();
        $daily_work_hours = (float)$request->daily_work_hours;
        // $this->date_start = new Carbon('last day of last month '. $request->month .' '. $request->year);
        // $this->date_end = new Carbon('first day of next month'. $request->month .' '. $request->year);
        $this->date_start = new Carbon('first Monday of '. $request->month .' '. $request->year);
        $this->date_end = new Carbon('last Monday of '. $request->month .' '. $request->year);
        $this->projects = DB::table('projects')->get();

        foreach ($this->projects as $key => $value) {
            $details = DB::table('performances')
                ->join('members', 'members.id', '=', 'performances.member_id')
                ->join('positions', 'positions.id', '=', 'performances.position_id')
                ->leftJoin('projects', 'projects.id', '=', 'performances.project_id')
                ->select(
                    '*',
                    'members.id as member_id',
                    'members.experience',
                    'positions.name as position',
                    'projects.id as project_id'
                )
                ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                ->where('projects.id', $value->id)
                ->whereNull('performances.deleted_at')
                ->orderBy('positions.name')
                ->orderBy('members.full_name')
                ->orderBy('performances.date_start')
                // ->groupBy('positions.id')
                ->groupBy('members.id')
                ->get();

                // return $details;

            if(count($details)){            
                $details[0]->positions = DB::table('positions')->where('project_id', $value->id)->orderBy('name')->get();
                $details[0]->program_head_count = count($details);
                $details[0]->position_head_count = array();
                $details[0]->date_cover_start = Carbon::parse('first Monday of '. $request->month .' '. $request->year)->toFormattedDateString();
                $details[0]->date_cover_end = Carbon::parse('last Monday of '. $request->month .' '. $request->year)->addDays(5)->toFormattedDateString();

                foreach ($details[0]->positions as $positionKey => $positionValue) {
                    $position_head_count_array = array();
                    // instantiate date end
                    $date_end = Carbon::parse('first Monday of'. $request->month .' '. $request->year)->addWeek();
                    // start at first monday of the month then increment it weekly 
                    for ($date_start = Carbon::parse('first Monday of'. $request->month .' '. $request->year); $date_start->lt($this->date_end); $date_start->addWeek()) { 
                        // fetch the performances by members to check the positions
                        $performances = DB::table('performances')
                            ->join('positions', 'positions.id', '=', 'performances.position_id')
                            ->join('members', 'members.id', '=', 'performances.member_id')
                            ->select(
                                'performances.*',
                                'positions.name as position'
                            )
                            ->where('performances.position_id', $positionValue->id)
                            ->whereBetween('performances.date_start', [$date_start, $date_end])
                            ->whereNull('performances.deleted_at')
                            ->groupBy('performances.member_id')
                            ->get();

                        array_push($position_head_count_array, $performances);

                        // increment the date end
                        $date_end->addWeek();              
                    }
                    // for each positions count the members per week and compare its head count
                    foreach ($position_head_count_array as $position_head_count_array_key => $position_head_count_array_value) {
                        if($position_head_count_array_key == 0){
                            $head_count = count($position_head_count_array_value);
                        }
                        else{
                            $head_count = $head_count < count($position_head_count_array_value) ? count($position_head_count_array_value) : $head_count;
                        }
                    }

                    array_push($details[0]->position_head_count, $head_count);
                }

                $details[0]->beginner_total_output = 0;
                $details[0]->beginner_total_man_hours = 0;
                $details[0]->beginner_total_average_output = 0;
                
                $details[0]->moderately_experienced_total_output = 0;
                $details[0]->moderately_experienced_total_man_hours = 0;
                $details[0]->moderately_experienced_total_average_output = 0;
                
                $details[0]->experienced_total_output = 0;
                $details[0]->experienced_total_man_hours = 0;
                $details[0]->experienced_total_average_output = 0;

                $beginner = DB::table('performances')
                    ->join('members', 'members.id', '=', 'performances.member_id')
                    ->select('performances.*')
                    ->where('members.experience', 'Beginner')
                    ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                    ->whereNull('performances.deleted_at')
                    ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                    ->where('performances.project_id', $value->id)
                    ->get();

                if($beginner)
                {
                    foreach ($beginner as $beginnerKey => $beginnerValue) {
                         $details[0]->beginner_total_output += $beginnerValue->output;
                         $details[0]->beginner_total_man_hours += $beginnerValue->hours_worked;
                    }

                    $details[0]->beginner_total_average_output = $details[0]->beginner_total_output / $details[0]->beginner_total_man_hours * $daily_work_hours;
                    
                    $details[0]->beginner = DB::table('performances')
                        ->join('positions', 'positions.id', '=', 'performances.position_id')
                        ->join('members', 'members.id', '=', 'performances.member_id')
                        ->select(
                            'performances.*',
                            'positions.name as position'
                        )
                        ->where('members.experience', 'Beginner')
                        ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                        ->whereNull('performances.deleted_at')
                        ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                        ->where('performances.project_id', $value->id)
                        ->groupBy('positions.id')
                        ->get();

                    foreach ($details[0]->beginner as $beginnerKey => $beginnerValue) {
                        $query = DB::table('performances')
                            ->join('members', 'members.id', '=', 'performances.member_id')
                            ->where('members.experience', 'Beginner')
                            ->where('performances.position_id', $beginnerValue->position_id)
                            ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                            ->whereNull('performances.deleted_at')
                            ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                            ->where('performances.project_id', $value->id)
                            ->get();

                        $beginnerValue->total_output = 0;
                        $beginnerValue->total_man_hours = 0;
                        $beginnerValue->total_average_output = 0;

                        if($query)
                        {
                            foreach ($query as $queryKey => $queryValue) {
                                $beginnerValue->total_output += $queryValue->output;
                                $beginnerValue->total_man_hours += $queryValue->hours_worked;
                            }

                            $beginnerValue->total_average_output = round($beginnerValue->total_output / $beginnerValue->total_man_hours * $daily_work_hours, 2);
                        }
                    }
                }

                $moderately_experienced = DB::table('performances')
                    ->join('members', 'members.id', '=', 'performances.member_id')
                    ->select('performances.*')
                    ->where('members.experience', 'Moderately Experienced')
                    ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                    ->whereNull('performances.deleted_at')
                    ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                    ->where('performances.project_id', $value->id)
                    ->get();

                if($moderately_experienced)
                {
                    foreach ($moderately_experienced as $moderatelyExperiencedKey => $moderatelyExperiencedValue) {
                         $details[0]->moderately_experienced_total_output += $moderatelyExperiencedValue->output;
                         $details[0]->moderately_experienced_total_man_hours += $moderatelyExperiencedValue->hours_worked;
                    }

                    $details[0]->moderately_experienced_total_average_output = $details[0]->moderately_experienced_total_output / $details[0]->moderately_experienced_total_man_hours * $daily_work_hours;
                    
                    $details[0]->moderately_experienced = DB::table('performances')
                        ->join('positions', 'positions.id', '=', 'performances.position_id')
                        ->join('members', 'members.id', '=', 'performances.member_id')
                        ->select(
                            'performances.*',
                            'positions.name as position'
                        )
                        ->where('members.experience', 'Moderately Experienced')
                        ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                        ->whereNull('performances.deleted_at')
                        ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                        ->where('performances.project_id', $value->id)
                        ->groupBy('positions.id')
                        ->get();

                    foreach ($details[0]->moderately_experienced as $moderatelyExperiencedKey => $moderatelyExperiencedValue) {
                        $query = DB::table('performances')
                            ->join('members', 'members.id', '=', 'performances.member_id')
                            ->whereNull('performances.deleted_at')
                            ->where('members.experience', 'Moderately Experienced')
                            ->where('performances.position_id', $moderatelyExperiencedValue->position_id)
                            ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                            ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                            ->where('performances.project_id', $value->id)
                            ->get();

                        $moderatelyExperiencedValue->total_output = 0;
                        $moderatelyExperiencedValue->total_man_hours = 0;
                        $moderatelyExperiencedValue->total_average_output = 0;

                        if($query)
                        {
                            foreach ($query as $queryKey => $queryValue) {
                                $moderatelyExperiencedValue->total_output += $queryValue->output;
                                $moderatelyExperiencedValue->total_man_hours += $queryValue->hours_worked;
                            }

                            $moderatelyExperiencedValue->total_average_output = round($moderatelyExperiencedValue->total_output / $moderatelyExperiencedValue->total_man_hours * $daily_work_hours, 2);
                        }
                    }
                }

                $experienced = DB::table('performances')
                    ->join('members', 'members.id', '=', 'performances.member_id')
                    ->select('performances.*')
                    ->whereNull('performances.deleted_at')
                    ->where('members.experience', 'Experienced')
                    ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                    ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                    ->where('performances.project_id', $value->id)
                    ->get();

                if($experienced)
                {
                    foreach ($experienced as $experiencedKey => $experiencedValue) {
                         $details[0]->experienced_total_output += $experiencedValue->output;
                         $details[0]->experienced_total_man_hours += $experiencedValue->hours_worked;
                    }

                    $details[0]->experienced_total_average_output = round($details[0]->experienced_total_output / $details[0]->experienced_total_man_hours * $daily_work_hours, 2);
                    
                    $details[0]->experienced = DB::table('performances')
                        ->join('positions', 'positions.id', '=', 'performances.position_id')
                        ->join('members', 'members.id', '=', 'performances.member_id')
                        ->select(
                            'performances.*',
                            'positions.name as position'
                        )
                        ->whereNull('performances.deleted_at')
                        ->where('members.experience', 'Experienced')
                        ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                        ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                        ->where('performances.project_id', $value->id)
                        ->groupBy('positions.id')
                        ->get();

                    foreach ($details[0]->experienced as $experiencedKey => $experiencedValue) {
                        $query = DB::table('performances')
                            ->join('members', 'members.id', '=', 'performances.member_id')
                            ->whereNull('performances.deleted_at')
                            ->where('members.experience', 'Experienced')
                            ->where('performances.position_id', $experiencedValue->position_id)
                            ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                            ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                            ->where('performances.project_id', $value->id)
                            ->get();

                        $experiencedValue->total_output = 0;
                        $experiencedValue->total_man_hours = 0;
                        $experiencedValue->total_average_output = 0;

                        if($query)
                        {
                            foreach ($query as $queryKey => $queryValue) {
                                $experiencedValue->total_output += $queryValue->output;
                                $experiencedValue->total_man_hours += $queryValue->hours_worked;
                            }

                            $experiencedValue->total_average_output = round($experiencedValue->total_output / $experiencedValue->total_man_hours * $daily_work_hours, 2);
                        }
                    }
                }

                $details[0]->overall_total_output = $details[0]->beginner_total_output + $details[0]->moderately_experienced_total_output + $details[0]->experienced_total_output;
                $details[0]->overall_total_man_hours = $details[0]->beginner_total_man_hours + $details[0]->moderately_experienced_total_man_hours + $details[0]->experienced_total_man_hours;
                $details[0]->overall_total_average_output = round($details[0]->overall_total_output / $details[0]->overall_total_man_hours * $daily_work_hours, 2);
            }

            foreach ($details as $key1 => $value1) {
                $this->productivity_average = 0;
                $this->quality_average = 0;
                $total_output = 0;
                $total_output_error = 0;
                $total_hours_worked = 0;

                $target = DB::table('targets')
                    ->where('position_id', $value1->position_id)
                    ->where('type', 'Productivity')
                    ->where('experience', $value1->experience)
                    ->where('created_at', '<=', $this->date_end)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if(!$target)
                {
                    $target = DB::table('targets')
                        ->where('position_id', $value1->position_id)
                        ->where('type', 'Productivity')
                        ->where('experience', $value1->experience)
                        ->where('active', true)
                        ->first();
                }

                $results = DB::table('performances')
                    ->leftJoin('results', 'results.performance_id', '=', 'performances.id')
                    ->leftJoin('projects', 'projects.id', '=', 'performances.project_id')
                    ->leftJoin('members', 'members.id', '=', 'performances.member_id')
                    ->leftJoin('positions', 'positions.id', '=', 'performances.position_id')
                    ->select(
                        '*',
                        'performances.id as performance_id',
                        'positions.name as position',
                        DB::raw('DATE_FORMAT(performances.date_start, "%b. %d") as date_start'),
                        DB::raw('DATE_FORMAT(performances.date_end, "%b. %d") as date_end')
                    )
                    ->whereNull('performances.deleted_at')
                    ->where('members.id', $value1->member_id)
                    ->where('projects.id', $value->id)
                    ->where('performances.daily_work_hours', 'like', $daily_work_hours.'%')
                    ->whereBetween('performances.date_start', [$this->date_start, $this->date_end])
                    // ->whereBetween('performances.date_end', [$this->date_start, $this->date_end])
                    ->orderBy('positions.name')
                    ->orderBy('members.full_name')
                    ->orderBy('performances.date_start')
                    ->get();

                // foreach members performance add its results 
                foreach ($results as $key2 => $value4) {
                    $total_output += $value4->output;
                    $total_output_error += $value4->output_error;
                    $total_hours_worked += $value4->hours_worked;
                }

                $this->productivity_average = round((($total_output /  $total_hours_worked * $daily_work_hours) / $target->value) * 100, 1);
                $this->quality_average =  round((1 - $total_output_error / $total_output) * 100, 1);
                
                // average its results
                // $this->productivity_average = round($this->productivity_average / count($results), 1); 
                // $this->quality_average = round($this->quality_average / count($results), 1);

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
                    ->where('targets.created_at', '<=', $this->date_end)
                    ->orderBy('targets.created_at', 'desc')
                    ->first();

                if(!$quality_target)
                {
                    $quality_target = DB::table('targets')
                        ->join('positions', 'positions.id', '=', 'targets.position_id')
                        ->join('members', 'members.experience', '=', 'targets.experience')
                        ->select('*')
                        ->where('targets.position_id', $value1->position_id)
                        ->where('targets.experience', $value1->experience)
                        ->where('targets.type', 'Quality')
                        // ->where('targets.created_at', '<=', $this->date_end)
                        ->where('targets.active', true)
                        ->first();
                }

                if($this->productivity_average < 100 && $this->quality_average >= 100)
                {
                    $details[$key1]->quadrant = 'Quadrant 1';
                }
                else if($this->productivity_average >= 100 && $this->quality_average >= 100)
                {
                    $details[$key1]->quadrant = 'Quadrant 2';
                }
                else if ($this->productivity_average >= 100 && $this->quality_average < 100)
                {
                    $details[$key1]->quadrant = 'Quadrant 3';
                }
                else{
                    $details[$key1]->quadrant = 'Quadrant 4';
                }
                // $details[$key1]->quota = (($this->productivity_average >= 100) && ($this->quality_average >= $quality_target->value)) ? 'Met' : 'Not met';
                
            }

            array_push($all, $details);
        }

        return $all;
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
                $project->members = Experience::with('member')->where('project_id', $project->id)->get();

                foreach ($project->members as $member_key => $member) {
                    $member->positions = $project->positions;
                    $overall_monthly_productivity = 0;
                    $overall_monthly_quality = 0;
                    $overall_count = 0;

                    foreach ($member->positions as $position_key => $position) {
                        $position->performances = Performance::with('project', 'position', 'target')->with(['member' => function($query){ $query->with(['experiences' => function($query){ $query->with('project'); }]);}])->where('daily_work_hours', 'like', $project->first_report->daily_work_hours .'%')->where('position_id', $position->id)->where('member_id', $member->id)->whereBetween('date_start', [$this->date_start, $this->date_end])->get();

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
                }
            }            
        }

        return $projects;
    }

    public function downloadMonthlySummary($month, $year, $daily_work_hours)
    {
        $this->projects = DB::table('projects')->get();
        $months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $this->date_start = new Carbon('last day of last month '. $months[(int)$month-1] .' '. $year);
        $this->date_end = new Carbon('first day of next month'. $months[(int)$month-1] .' '. $year);
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
                    ->where('created_at', '<=', $this->date_end)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if(!$beginner)
                {
                    $beginner = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('position_id', $value2->id)
                    ->where('experience', 'Beginner')
                    // ->where('created_at', '<=', $this->date_end)
                    ->where('active', true)
                    ->first();
                }

                $moderately_experienced = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('position_id', $value2->id)
                    ->where('experience', 'Moderately Experienced')
                    ->where('created_at', '<=', $this->date_end)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if(!$moderately_experienced)
                {
                     $moderately_experienced = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('position_id', $value2->id)
                    ->where('experience', 'Moderately Experienced')
                    // ->where('created_at', '<=', $this->date_end)
                    ->where('active', true)
                    ->first();
                }

                $experienced = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('position_id', $value2->id)
                    ->where('experience', 'Experienced')
                    ->where('created_at', '<=', $this->date_end)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if(!$experienced)
                {
                    $experienced = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('position_id', $value2->id)
                    ->where('experience', 'Experienced')
                    // ->where('created_at', '<=', $this->date_end)
                    ->where('active', true)
                    ->first();                    
                }

                $quality = DB::table('targets')
                    ->where('type', 'Quality')
                    ->where('position_id', $value2->id)
                    ->where('created_at', '<=', $this->date_end)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if(!$quality)
                {
                    $quality = DB::table('targets')
                        ->where('type', 'Quality')
                        ->where('position_id', $value2->id)
                        // ->where('created_at', '<=', $this->date_end)
                        ->where('active', true)
                        ->first();
                }

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

            $reports = DB::table('reports')
                ->select(
                    '*',
                    DB::raw('DATE_FORMAT(date_start, "%b. %d") as date_start_formatted'),
                    DB::raw('DATE_FORMAT(date_end, "%b. %d") as date_end_formatted')
                )
                ->whereNull('deleted_at')
                ->where('project_id', $value->id)
                ->whereBetween('date_start', [$this->date_start, $this->date_end])
                ->where('daily_work_hours', 'like', $daily_work_hours. '%')
                // ->groupBy('date_start')
                ->get();

            // if($parentKey == 2){
            //     return $reports;
            // }

            // fetch all members of per project
            $members = DB::table('performances')
                ->join('members', 'members.id', '=', 'performances.member_id')
                ->join('positions', 'positions.id', '=', 'performances.position_id')
                ->leftJoin('projects', 'projects.id', '=', 'performances.project_id')
                ->select(
                    '*',
                    'members.id as member_id',
                    'members.experience',
                    'positions.name as position',
                    DB::raw('DATE_FORMAT(performances.date_start, "%b. %d") as date_start'),
                    DB::raw('DATE_FORMAT(performances.date_end, "%b. %d") as date_end')
                )
                ->whereNull('performances.deleted_at')
                ->where('projects.id', $value->id)
                ->groupBy('members.id')
                ->get();

            // foreach members fetch its performance
            foreach ($members as $key1 => $value3) {
                $this->productivity_average = 0;
                $this->quality_average = 0;
                $this->total_output = 0;
                $this->total_output_error = 0;
                $this->total_hours_worked = 0;
                $results = array();

                $target = DB::table('targets')
                    ->where('position_id', $value3->position_id)
                    ->where('type', 'Productivity')
                    ->where('experience', $value3->experience)
                    ->where('created_at', '<=', $this->date_end)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if(!$target)
                {
                    $target = DB::table('targets')
                        ->where('position_id', $value3->position_id)
                        ->where('type', 'Productivity')
                        ->where('experience', $value3->experience)
                        // ->where('created_at', '<=', $this->date_end)
                        ->where('active', true)
                        ->first();                    
                }

                foreach ($reports as $report_key => $report_value) {
                    $query = DB::table('performances')
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
                        ->whereNull('performances.deleted_at')
                        ->where('members.id', $value3->member_id)
                        ->where('performances.report_id', $report_value->id)
                        ->whereBetween('performances.date_start', [$report_value->date_start, $report_value->date_end])
                        ->orderBy('positions.name')
                        ->orderBy('members.full_name')
                        ->first();

                    if($query){
                        array_push($results, $query);

                        $this->total_output += $query->output;
                        $this->total_output_error += $query->output_error;
                        $this->total_hours_worked += $query->hours_worked;
                    }
                    else{
                        $blank = new Performance;
                        $blank->productivity = 0;
                        $blank->quality = 0;
                        array_push($results, $blank);

                        $this->total_output += $blank->output;
                        $this->total_output_error += $blank->output_error;
                        $this->total_hours_worked += $blank->hours_worked;
                    }

                    
                }

                $this->productivity_average = count($reports) && $this->total_hours_worked ? round((($this->total_output / $this->total_hours_worked * $daily_work_hours) / $target->value) * 100, 1) : 0; 
                $this->quality_average = count($reports) && $this->total_output ? round((1 - $this->total_output_error / $this->total_output) * 100, 1) : 0;

                $members[$key1]->results = $results;
                $members[$key1]->productivity_average = $this->productivity_average;
                $members[$key1]->quality_average = $this->quality_average;
                $members[$key1]->total_output = $this->total_output;
                $members[$key1]->total_output_error = $this->total_output_error;
                $members[$key1]->total_hours_worked = $this->total_hours_worked;

                $quality_target = DB::table('targets')
                    ->join('positions', 'positions.id', '=', 'targets.position_id')
                    ->join('members', 'members.experience', '=', 'targets.experience')
                    ->select('*')
                    ->where('targets.position_id', $value3->position_id)
                    ->where('targets.experience', $value3->experience)
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
                        ->where('targets.position_id', $value3->position_id)
                        ->where('targets.experience', $value3->experience)
                        ->where('targets.type', 'Quality')
                        // ->where('targets.created_at', '<=', $this->date_end)
                        ->where('targets.active', true)
                        ->first();    
                }
                if($this->productivity_average < 100 && $this->quality_average >= 100)
                {
                    $members[$key1]->quadrant = 'Quadrant 1';
                }
                else if($this->productivity_average >= 100 && $this->quality_average >= 100)
                {
                    $members[$key1]->quadrant = 'Quadrant 2';
                }
                else if ($this->productivity_average >= 100 && $this->quality_average < 100)
                {
                    $members[$key1]->quadrant = 'Quadrant 3';
                }
                else{
                    $members[$key1]->quadrant = 'Quadrant 4';
                }

                // $members[$key1]->quota = (($this->productivity_average >= 100) && ($this->quality_average >= $quality_target->value)) ? 'Met' : 'Not met';

                // foreach members performance add its results 
                
                // average its results
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

    public function downloadMonthlyDepartment($department_id, $month, $year, $daily_work_hours, $project, $position)
    {
        $months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $this->date_start = new Carbon('last day of last month '. $months[(int)$month-1] .' '. $year);
        $this->date_end = new Carbon('first day of next month'. $months[(int)$month-1] .' '. $year);
        $department = DB::table('departments')->where('id', $department_id)->first();

        $this->position = $position;

        $project = Project::where('id', $project)->first();

        // foreach ($this->projects as $project_key => $project) {
            $project->reports = Report::with(['project' => function($query){ $query->with(['positions' => function($query){ $query->where('id', $this->position); }]); }])->where('project_id', $project->id)->whereBetween('date_start', [$this->date_start, $this->date_end])->where('daily_work_hours', 'like', $daily_work_hours.'%')->orderBy('date_start')->get();   
            $project->members = Experience::with('member')->where('project_id', $project->id)->get();

            foreach ($project->members as $member_key => $member) {
                $member->total_output = 0;
                $member->total_output_error = 0;
                $member->total_hours_worked = 0;
                $member->average_output = 0;
                $member->monthly_productivity = 0;
                $member->monthly_quality = 0;
            }
            
            foreach ($project->reports as $report_key => $report) {
                $project->position = $report->project->positions[0];
                $report->department = $department;

                $report->department->beginner = array();
                $report->department->moderately_experienced = array();
                $report->department->experienced = array();
                $report->department->quality = array();

                $report->members = Experience::with('member')->where('project_id', $report->project_id)->get();

                foreach ($report->members as $member_key => $member) {
                    $member->performance = Performance::with('position')->with(['target' => function($query){ $query->withTrashed(); }])->where('member_id', $member->member_id)->where('report_id', $report->id)->where('position_id', $report->project->positions[0]->id)->first();
                    if($member->performance){
                        $project->members[$member_key]->total_output += $member->performance->output;
                        $project->members[$member_key]->total_output_error += $member->performance->output_error;
                        $project->members[$member_key]->total_hours_worked += $member->performance->hours_worked;
                    }
                }

                foreach ($report->project->positions as $position_key => $position) {
                    // Beginner
                    $previous_beginner_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Beginner')->where('created_at', '<', $report->date_start)->orderBy('created_at', 'desc')->first();
                    $beginner_productivity = count($previous_beginner_target) ? $previous_beginner_target : Target::where('position_id', $position->id)->where('experience', 'Beginner')->first();

                    // Moderately Experienced
                    $previous_moderately_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Moderately Experienced')->where('created_at', '<', $report->date_start)->orderBy('created_at', 'desc')->first();
                    $moderately_experienced_productivity = count($previous_moderately_experienced_target) ? $previous_moderately_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Moderately Experienced')->first();

                    // Experienced
                    $previous_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Experienced')->where('created_at', '<', $report->date_start)->orderBy('created_at', 'desc')->first();
                    $experienced_productivity = count($previous_experienced_target) ? $previous_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Experienced')->first();
                    
                    // Quality
                    $previous_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Experienced')->where('created_at', '<', $report->date_start)->orderBy('created_at', 'desc')->first();
                    $quality = count($previous_experienced_target) ? $previous_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Experienced')->first();
                    
                    array_push($report->department->beginner, $beginner_productivity);
                    array_push($report->department->moderately_experienced, $moderately_experienced_productivity);
                    array_push($report->department->experienced, $experienced_productivity);
                    array_push($report->department->quality, $quality);
                }

                $report->date_start = Carbon::parse($report->date_start)->toFormattedDateString();
                $report->date_end = Carbon::parse($report->date_end)->toFormattedDateString();
            }

            // if(count($project->reports)){            
            //     foreach ($project->members as $member_key => $member) {
            //         $target = $project->reports[0]->members[$member_key]->performance->target;
            //         $member->average_output = $member->total_output / $member->total_hours_worked * $daily_work_hours;
            //         $member->monthly_productivity = round($member->average_output / $target->productivity * 100);
            //         $member->monthly_quality = round((1 - $member->total_output_error / $member->total_output) * 100);

            //         if($member->monthly_productivity < $target->productivity && $member->monthly_quality >= $target->quality)
            //         {
            //             $member->quadrant = 'Quadrant 1'; 
            //         }
            //         else if($member->monthly_productivity >= $target->productivity && $member->monthly_quality >= $target->quality)
            //         {
            //             $member->quadrant = 'Quadrant 2'; 
            //         }
            //         else if($member->monthly_productivity >= $target->productivity && $member->monthly_quality < $target->quality)
            //         {
            //             $member->quadrant = 'Quadrant 3'; 
            //         }
            //         else if($member->monthly_productivity < $target->productivity && $member->monthly_quality < $target->quality)
            //         {
            //             $member->quadrant = 'Quadrant 4'; 
            //         }
            //     }
            // }
            if(count($project->reports)){            
                foreach ($project->members as $member_key => $member) {
                    for ($i=0; $i < count($project->reports); $i++) { 
                        if($project->reports[$i]->members[$member_key]->performance){                            
                            if($project->reports[$i]->members[$member_key]->performance->position_id == $project->position->id){
                                $target = $project->reports[$i]->members[$member_key]->performance->target;
                                $member->average_output = $member->total_output / $member->total_hours_worked * $daily_work_hours;
                                $member->monthly_productivity = round($member->average_output / $target->productivity * 100);
                                $member->monthly_quality = round((1 - $member->total_output_error / $member->total_output) * 100);

                                if($member->monthly_productivity < $target->productivity && $member->monthly_quality >= $target->quality)
                                {
                                    $member->quadrant = 'Quadrant 1'; 
                                }
                                else if($member->monthly_productivity >= $target->productivity && $member->monthly_quality >= $target->quality)
                                {
                                    $member->quadrant = 'Quadrant 2'; 
                                }
                                else if($member->monthly_productivity >= $target->productivity && $member->monthly_quality < $target->quality)
                                {
                                    $member->quadrant = 'Quadrant 3'; 
                                }
                                else if($member->monthly_productivity < $target->productivity && $member->monthly_quality < $target->quality)
                                {
                                    $member->quadrant = 'Quadrant 4'; 
                                }
                            }
                        }
                        else{
                            $project->reports[$i]->members[$member_key]->performance = new Performance;
                            $project->reports[$i]->members[$member_key]->performance->productivity = 0;
                            $project->reports[$i]->members[$member_key]->performance->quality = 0;
                        }
                    }
                }
            }
        // }


        $this->project = $project;
        // return $this->project;

        Excel::create('PQR '. $department->name .' Monthly Report '. $months[(int)$month-1] .' '. $year, function($excel){
            $excel->sheet($this->project->name, function($sheet) {
                if(count($this->project->reports)){
                    $sheet->loadView('excel.monthly')
                        ->with('project', $this->project);
                }
            });
        })->download('xls');
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
            ->whereNull('reports.deleted_at')
            ->where('reports.daily_work_hours', 'like', $daily_work_hours. '%')
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
                ->whereNull('reports.deleted_at')
                ->where('performances.report_id', $value->report_id)
                ->where('results.report_id', $value->report_id)
                ->groupBy('performances.id')
                ->orderBy('positions.name')
                ->orderBy('members.full_name')
                ->get();
            
            foreach ($reports as $report_key => $report_value) {

                if($report_value->productivity < 100 && $report_value->quality >= 100)
                {
                    $report_value->quadrant = 'Quadrant 1';
                }
                else if($report_value->productivity >= 100 && $report_value->quality >= 100)
                {
                    $report_value->quadrant = 'Quadrant 2';
                }
                else if ($report_value->productivity >= 100 && $report_value->quality < 100)
                {
                    $report_value->quadrant = 'Quadrant 3';
                }
                else{
                    $report_value->quadrant = 'Quadrant 4';
                }
            }

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
                    ->where('created_at', '<=', $date_end)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if(!$beginner)
                {
                    $beginner = DB::table('targets')
                        ->where('type', 'Productivity')
                        ->where('position_id', $value->id)
                        ->where('experience', 'Beginner')
                        // ->where('created_at', '<=', $date_end)
                        ->where('active', true)
                        ->first();                    
                }

                $moderately_experienced = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('position_id', $value->id)
                    ->where('experience', 'Moderately Experienced')
                    ->where('created_at', '<=', $date_end)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if(!$moderately_experienced)
                {
                    $moderately_experienced = DB::table('targets')
                        ->where('type', 'Productivity')
                        ->where('position_id', $value->id)
                        ->where('experience', 'Moderately Experienced')
                        // ->where('created_at', '<=', $date_end)
                        ->where('active', true)
                        ->first();                    
                }

                $experienced = DB::table('targets')
                    ->where('type', 'Productivity')
                    ->where('position_id', $value->id)
                    ->where('experience', 'Experienced')
                    ->where('created_at', '<=', $date_end)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if(!$experienced)
                {
                    $experienced = DB::table('targets')
                        ->where('type', 'Productivity')
                        ->where('position_id', $value->id)
                        ->where('experience', 'Experienced')
                        // ->where('created_at', '<=', $date_end)
                        ->where('active', true)
                        ->first();
                }

                $quality = DB::table('targets')
                    ->where('type', 'Quality')
                    ->where('position_id', $value->id)
                    ->where('created_at', '<=', $date_end)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if(!$quality)
                {
                    $quality = DB::table('targets')
                        ->where('type', 'Quality')
                        ->where('position_id', $value->id)
                        // ->where('created_at', '<=', $date_end)
                        ->where('active', true)
                        ->first();                    
                }            

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

    public function downloadWeeklyDepartment($department_id, $date_start, $date_end, $daily_work_hours)
    {
        $this->reports = Report::with(['performances' => function($query){ $query->with('member')->with('position'); }])->with(['project' => function($query){ $query->with('positions'); }])->where('department_id', $department_id)->where('date_start', Carbon::parse($date_start))->where('date_end', Carbon::parse($date_end))->where('daily_work_hours', 'like', $daily_work_hours.'%')->orderBy('date_start', 'desc')->get();   
        
        $this->department = DB::table('departments')->where('id', $department_id)->first();
        
        $this->department->beginner = array();
        $this->department->moderately_experienced = array();
        $this->department->experienced = array();
        $this->department->quality = array();

        foreach ($this->reports as $report_key => $report) {
            foreach ($report->performances as $performance_key => $performance) {
                $performance->experience = Experience::where('member_id', $performance->member_id)->where('project_id', $performance->project_id)->first()->experience;
            }

            foreach ($report->project->positions as $position_key => $position) {
                // Beginner
                $previous_beginner_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Beginner')->where('created_at', '<', $report->date_start)->orderBy('created_at', 'desc')->first();
                $beginner_productivity = count($previous_beginner_target) ? $previous_beginner_target : Target::where('position_id', $position->id)->where('experience', 'Beginner')->first();

                // Moderately Experienced
                $previous_moderately_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Moderately Experienced')->where('created_at', '<', $report->date_start)->orderBy('created_at', 'desc')->first();
                $moderately_experienced_productivity = count($previous_moderately_experienced_target) ? $previous_moderately_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Moderately Experienced')->first();

                // Experienced
                $previous_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Experienced')->where('created_at', '<', $report->date_start)->orderBy('created_at', 'desc')->first();
                $experienced_productivity = count($previous_experienced_target) ? $previous_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Experienced')->first();
                
                // Quality
                $previous_experienced_target = Target::onlyTrashed()->where('position_id', $position->id)->where('experience', 'Experienced')->where('created_at', '<', $report->date_start)->orderBy('created_at', 'desc')->first();
                $quality = count($previous_experienced_target) ? $previous_experienced_target : Target::where('position_id', $position->id)->where('experience', 'Experienced')->first();
                
                array_push($this->department->beginner, $beginner_productivity);
                array_push($this->department->moderately_experienced, $moderately_experienced_productivity);
                array_push($this->department->experienced, $experienced_productivity);
                array_push($this->department->quality, $quality);
            }
        }

        Excel::create('PQR '. $this->department->name .' Weekly Summary '. Carbon::parse($date_start)->toFormattedDateString() . ' to ' . Carbon::parse($date_end)->toFormattedDateString(), function($excel)
        {
            foreach ($this->reports as $report_key => $report_value) {
                $this->report_value = $report_value;
                $excel->sheet($report_value->project->name, function($sheet) {
                    $sheet->loadView('excel.weekly')
                        ->with('report', $this->report_value)
                        ->with('department', $this->department);
                });
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
        return Report::with(['performances' => function($query){ $query->with(['member' => function($query){ $query->with('experiences');}])->with('position'); }])->with(['project' => function($query){ $query->with(['positions' => function($query){ $query->with(['targets' => function($query){ $query->withTrashed()->get(); }]);}]); }])->where('department_id', $id)->where('date_start', Carbon::parse($request->date_start))->where('date_end', Carbon::parse($request->date_end))->orderBy('date_start', 'desc')->get();
    }

    public function search(Request $request)
    {
        return Report::with(['performances' => function($query){ $query->with(['member' => function($query){ $query->with('experiences');}])->with('position'); }])->with(['project' => function($query){ $query->with(['positions' => function($query){ $query->with(['targets' => function($query){ $query->withTrashed()->get(); }]);}]); }])->where('department_id', Auth::user()->department_id)->where('date_start', Carbon::parse($request->date_start))->where('date_end', Carbon::parse($request->date_end))->orderBy('date_start', 'desc')->get();
    }
    public function paginateDetails()
    {
        return Report::with(['performances' => function($query){ $query->with(['member' => function($query){ $query->with('experiences');}])->with('position'); }])->with(['project' => function($query){ $query->with(['positions' => function($query){ $query->with(['targets' => function($query){ $query->withTrashed()->get(); }]);}]); }])->where('department_id', Auth::user()->department_id)->orderBy('date_start', 'desc')->paginate(10);   
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
        return Report::with(['performances' => function($query){ $query->with(['member' => function($query){ $query->with('experiences');}])->with('position'); }])->with(['project' => function($query){ $query->with(['positions' => function($query){ $query->with(['targets' => function($query){ $query->withTrashed()->get(); }]);}]); }])->where('department_id', $departmentID)->orderBy('date_start', 'desc')->paginate(10);
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

        Performance::where('report_id', $id)->delete();
        Result::where('report_id', $id)->delete();
        DB::table('approvals')->where('report_id')->delete();
        DB::table('performance_approvals')->where('report_id')->delete();
        DB::table('performance_histories')->where('report_id')->delete();
    }
}
