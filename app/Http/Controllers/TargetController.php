<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Target;
use DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class TargetController extends Controller
{
    public function department($department_id)
    {
        return DB::table('targets')
            ->join('positions', 'positions.id', '=', 'targets.position_id')
            ->join('projects', 'projects.id', '=', 'targets.project_id')
            ->select(
                'targets.*',
                'positions.name as position',
                'projects.name as project',
                DB::raw('UPPER(LEFT(positions.name, 1)) as first_letter')
            )
            ->where('targets.department_id', $department_id)
            ->groupBy('targets.id')
            ->orderBy('positions.name')
            ->get();
    }
    public function position($position_id)
    {
        return DB::table('targets')
            ->select(
                '*',
                DB::raw('UPPER(LEFT(type, 1)) as first_letter'),
                DB::raw('CONCAT(UPPER(LEFT(type, 1)), SUBSTRING(type, 2)) as type')
            )
            ->where('position_id', $position_id)
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
                $i.'.value' => 'required|numeric',
                $i.'.type' => 'required|string',
                $i.'.experience' => 'required|string',
                $i.'.position_id' => 'required|numeric',
                $i.'.project_id' => 'required|numeric',
                $i.'.department_id' => 'required|numeric',
            ]);

            $target = new Target;

            $target->value = $request->input($i.'.value');
            $target->type = $request->input($i.'.type');
            $target->experience = $request->input($i.'.experience');
            $target->position_id = $request->input($i.'.position_id');
            $target->project_id = $request->input($i.'.project_id');
            $target->department_id = $request->input($i.'.department_id');

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
