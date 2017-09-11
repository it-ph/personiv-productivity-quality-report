<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Position;
use DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Auth;

class PositionController extends Controller
{
    public function checkDuplicate(Request $request)
    {
        $position = $request->id ? Position::whereNotIn('id', [$request->id])->where('name', $request->name)->where('department_id', $request->department_id)->where('project_id', $request->project_id)->first() : Position::where('name', $request->name)->where('department_id', $request->department_id)->where('project_id', $request->project_id)->first();

        return response()->json($position ? true : false);
    }
    public function unique($id)
    {
        $id = (int)$id;

        return $id ? Position::where('department_id', $id)->groupBy('name')->get() : Position::where('department_id', Auth::user()->department_id)->groupBy('name')->get();
    }

    public function department($id)
    {
        return Position::where('department_id', $id)->groupBy('name')->get();
    }
    public function search(Request $request)
    {
        return DB::table('positions')
            ->select('*', DB::raw('UPPER(LEFT(name, 1)) as first_letter'), DB::raw('DATE_FORMAT(created_at, "%h:%i %p, %b. %d, %Y") as created_at'))
            ->where('name', 'like', '%'. $request->userInput .'%')
            ->whereNull('deleted_at')
            ->groupBy('id')
            ->get();
    }
    // fetch positions by project
    public function project($id)
    {
        // return DB::table('positions')->select('*', DB::raw('UPPER(LEFT(name, 1)) as first_letter'), DB::raw('DATE_FORMAT(created_at, "%h:%i %p, %b. %d, %Y") as created_at'))->where('project_id', $id)->orderBy('name')->get();
        return Position::where('project_id', $id)->get();
    }

  

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Position::where('department_id', Auth::user()->department_id)->groupBy('name')->get();
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
            'project_id' => 'required|numeric',
        ]);

        $duplicate = Position::where('name', $request->name)->where('department_id', $request->department_id)->where('project_id', $request->project_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $position = new Position;

        $position->name = $request->name;
        $position->department_id = $request->department_id;
        $position->project_id = $request->project_id;

        $position->save();

        return $position;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Position::with('targets')->with('project')->where('id', $id)->first();
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
        $this->validate($request, [
            'name' => 'required|string',
            // 'department_id' => 'required|numeric',
            // 'project_id' => 'required|numeric',
        ]);

        $duplicate = Position::whereNotIn('id', [$request->id])->where('name', $request->name)->where('department_id', $request->department_id)->where('project_id', $request->project_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $position = Position::where('id', $id)->first();

        $position->name = $request->name;
        // $position->department_id = $request->department_id;
        // $position->project_id = $request->project_id;

        $position->save();

        return $position;
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
