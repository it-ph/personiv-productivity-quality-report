<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Target;
use App\Report;
use DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class TargetController extends Controller
{
    public function project($report_id)
    {
        $report = Report::where('id', $report_id)->first();
        $project = DB::table('projects')->where('id', $report->project_id)->first();

        $project->positions = DB::table('positions')->where('project_id', $report->project_id)->get();

        $project->beginner_productivity =  array();
        $project->moderately_experienced_productivity =  array();
        $project->experienced_productivity =  array();
        
        $project->beginner_quality =  array();
        $project->moderately_experienced_quality =  array();
        $project->experienced_quality =  array();

        foreach ($project->positions as $key => $value) {
            /* Productivity */
            $beginner_productivity_query = Target::where('position_id', $value->id)->where('type', 'Productivity')->where('experience', 'Beginner')->where('created_at', '<=', $report->date_end)->orderBy('created_at', 'desc')->first();
            
            if($beginner_productivity_query)
            {
                $beginner_productivity = $beginner_productivity_query->value;
            }
            else{
               $beginner_productivity = Target::where('position_id', $value->id)->where('type', 'Productivity')->where('experience', 'Beginner')->orderBy('created_at', 'desc')->first()->value;
            }

            $moderately_experienced_productivity_query = Target::where('position_id', $value->id)->where('type', 'Productivity')->where('experience', 'Moderately Experienced')->where('created_at', '<=', $report->date_end)->orderBy('created_at', 'desc')->first();
            if($moderately_experienced_productivity_query)
            {
                $moderately_experienced_productivity = $moderately_experienced_productivity_query->value;
            }
            else{
                $moderately_experienced_productivity = Target::where('position_id', $value->id)->where('type', 'Productivity')->where('experience', 'Moderately Experienced')->orderBy('created_at', 'desc')->first()->value;
            }
            

            $experienced_productivity_query = Target::where('position_id', $value->id)->where('type', 'Productivity')->where('experience', 'Experienced')->where('created_at', '<=', $report->date_end)->orderBy('created_at', 'desc')->first();

            if($experienced_productivity_query){
                $experienced_productivity = $experienced_productivity_query->value;
            }
            else{
                $experienced_productivity = Target::where('position_id', $value->id)->where('type', 'Productivity')->where('experience', 'Experienced')->orderBy('created_at', 'desc')->first()->value;                
            }

            /* Quality */
            $beginner_quality_query = Target::where('position_id', $value->id)->where('type', 'Quality')->where('experience', 'Beginner')->where('created_at', '<=', $report->date_end)->orderBy('created_at', 'desc')->first();

            if($beginner_quality_query)
            {
                $beginner_quality = $beginner_quality_query->value;
            }
            else{
                $beginner_quality = Target::where('position_id', $value->id)->where('type', 'Quality')->where('experience', 'Beginner')->orderBy('created_at', 'desc')->first()->value;
            }
            

            $moderately_experienced_quality_query = Target::where('position_id', $value->id)->where('type', 'Quality')->where('experience', 'Moderately Experienced')->where('created_at', '<=', $report->date_end)->orderBy('created_at', 'desc')->first();

            if($moderately_experienced_quality_query){
                $moderately_experienced_quality = $moderately_experienced_quality_query->value;
            }
            else{
                $moderately_experienced_quality = Target::where('position_id', $value->id)->where('type', 'Quality')->where('experience', 'Moderately Experienced')->orderBy('created_at', 'desc')->first()->value;    
            }
            
            
            $experienced_quality_query = Target::where('position_id', $value->id)->where('type', 'Quality')->where('experience', 'Experienced')->where('created_at', '<=', $report->date_end)->orderBy('created_at', 'desc')->first();

            if($experienced_quality_query){
                $experienced_quality = $experienced_quality_query->value;
            }
            else{
                $experienced_quality = Target::where('position_id', $value->id)->where('type', 'Quality')->where('experience', 'Experienced')->orderBy('created_at', 'desc')->first()->value;
            }

            array_push($project->beginner_productivity, $beginner_productivity);
            array_push($project->moderately_experienced_productivity, $moderately_experienced_productivity);
            array_push($project->experienced_productivity, $experienced_productivity);
            
            array_push($project->beginner_quality, $beginner_quality);
            array_push($project->moderately_experienced_quality, $moderately_experienced_quality);
            array_push($project->experienced_quality, $experienced_quality);
        }

        return response()->json($project);
    }
    public function productivity($position_id)
    {
        return Target::where('position_id', $position_id)->where('type', 'Productivity')->where('active', true)->get();
    }
    public function quality($position_id)
    {
        return Target::where('position_id', $position_id)->where('type', 'Quality')->where('active', true)->get();
    }
    // public function department($department_id)
    // {
    //     return DB::table('targets')
    //         ->join('positions', 'positions.id', '=', 'targets.position_id')
    //         ->join('projects', 'projects.id', '=', 'targets.project_id')
    //         ->select(
    //             'targets.*',
    //             'positions.name as position',
    //             'projects.name as project',
    //             DB::raw('UPPER(LEFT(targets.experience, 1)) as first_letter')
    //         )
    //         ->where('targets.department_id', $department_id)
    //         ->groupBy('targets.id')
    //         ->orderBy('projects.name')
    //         ->orderBy('positions.name')
    //         ->orderBy('targets.experience')
    //         ->get();
    // }
    public function position($position_id)
    {
        return DB::table('targets')
            ->select(
                '*',
                DB::raw('UPPER(LEFT(type, 1)) as first_letter'),
                DB::raw('CONCAT(UPPER(LEFT(type, 1)), SUBSTRING(type, 2)) as type')
            )
            ->where('position_id', $position_id)
            ->where('active', true)
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
        for ($i=0; $i < count($request->all()); $i++) { 
            
            $this->validate($request, [
                $i.'.productivity' => 'required|numeric',
                $i.'.quality' => 'required|numeric',
                // $i.'.type' => 'required|string',
                $i.'.experience' => 'required|string',
                $i.'.position_id' => 'required|numeric',
                $i.'.project_id' => 'required|numeric',
                $i.'.department_id' => 'required|numeric',
            ]);

            $target = new Target;

            $target->productivity = $request->input($i.'.productivity');
            $target->quality = $request->input($i.'.quality');
            // $target->type = $request->input($i.'.type');
            $target->experience = $request->input($i.'.experience');
            $target->position_id = $request->input($i.'.position_id');
            $target->project_id = $request->input($i.'.project_id');
            $target->department_id = $request->input($i.'.department_id');
            // $target->active = true;

            $target->save();
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
            
            $this->validate($request, [
                // $i.'.value' => 'required|numeric',
                $i.'.productivity' => 'required|numeric',
                $i.'.quality' => 'required|numeric',
                // $i.'.type' => 'required|string',
                $i.'.experience' => 'required|string',
                $i.'.position_id' => 'required|numeric',
                $i.'.project_id' => 'required|numeric',
                $i.'.department_id' => 'required|numeric',
            ]);

            $target = Target::where('id', $request->input($i.'.id'))->delete();
            // $target->active = false;
            // $target->save();

            $new_target = new Target;

            // $new_target->value = $request->input($i.'.value');
            $new_target->productivity = $request->input($i.'.productivity');
            $new_target->quality = $request->input($i.'.quality');
            // $new_target->type = $request->input($i.'.type');
            $new_target->experience = $request->input($i.'.experience');
            $new_target->position_id = $request->input($i.'.position_id');
            $new_target->project_id = $request->input($i.'.project_id');
            $new_target->department_id = $request->input($i.'.department_id');
            // $new_target->active = true;

            $new_target->save();
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
