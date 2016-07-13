<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Project;
use DB;
use Auth;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ProjectController extends Controller
{
    public function search(Request $request)
    {
        return DB::table('projects')
            ->select('*', DB::raw('UPPER(LEFT(name, 1)) as first_letter'), DB::raw('DATE_FORMAT(created_at, "%h:%i %p, %b. %d, %Y") as created_at'))
            ->where('name', 'like', '%'. $request->userInput .'%')
            ->whereNull('deleted_at')
            ->groupBy('id')
            ->get();
    }

    public function department($department_id)
    {
        // return DB::table('projects')
        //     ->select(
        //         '*',
        //         DB::raw('UPPER(LEFT(name,1)) as first_letter'),
        //         DB::raw('DATE_FORMAT(created_at, "%h:%i %p, %b. %d, %Y") as created_at')
        //     )
        //     ->where('department_id', $department_id)
        //     ->get();

        return Project::where('department_id', $department_id)->get();
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Project::where('department_id', Auth::user()->department_id)->get();
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
        $this->validate($request, [
            'name' => 'required|string',
            'department_id' => 'required|numeric',
        ]);

        $project = new Project;

        $project->name = $request->name;
        $project->department_id = $request->department_id;

        $project->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Project::with(['positions' => function($query){ $query->with(['targets' => function($query){ $query->where('active', true); }]); }])->where('id', $id)->first();
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
