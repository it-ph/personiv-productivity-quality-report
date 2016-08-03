<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Department;
use DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class DepartmentController extends Controller
{
    public function checkDuplicate(Request $request)
    {
        $department = $request->id ? Department::whereNotIn('id', [$request->id])->where('name', $request->name)->first() : Department::where('name', $request->name)->first();

        return response()->json($department ? true : false);
    }

    public function search(Request $request)
    {
        return DB::table('departments')
            ->select('*', DB::raw('UPPER(LEFT(name, 1)) as first_letter'), DB::raw('DATE_FORMAT(created_at, "%h:%i %p, %b. %d, %Y") as created_at'))
            ->where('name', 'like', '%'. $request->userInput .'%')
            ->whereNull('deleted_at')
            ->orderBy('name')
            ->get();
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return DB::table('departments')->select('*', DB::raw('UPPER(LEFT(name, 1)) as first_letter'), DB::raw('DATE_FORMAT(created_at, "%h:%i %p, %b. %d, %Y") as created_at'))->whereNull('deleted_at')->orderBy('name')->get();

        return Department::all();
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
        ]);

        $duplicate = Department::where('name', $request->name)->first();

        if($duplicate){
            return response()->json(true);
        }

        $department = new Department;

        $department->name = $request->name;

        $department->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Department::with('projects', 'members')->where('id', $id)->first();
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
