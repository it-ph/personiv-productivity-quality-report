<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Programme;
use DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ProgrammeController extends Controller
{
    public function search(Request $request)
    {
        return DB::table('programmes')
            ->select('*', DB::raw('UPPER(LEFT(label, 1)) as first_letter'), DB::raw('DATE_FORMAT(created_at, "%b. %d, %Y") as created_at_formatted'))
            ->where('daily_work_hours', 'like', '%'. $request->userInput .'%')
            ->orWhere('label', 'like', '%'. $request->userInput .'%')
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->get();
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return DB::table('programmes')
        //     ->select('*', DB::raw('UPPER(LEFT(label, 1)) as first_letter'), DB::raw('DATE_FORMAT(created_at, "%b. %d, %Y") as created_at_formatted'))
        //     ->whereNull('deleted_at')
        //     ->orderBy('created_at')
        //     ->get();

        return Programme::all();
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
            'daily_work_hours' => 'required|numeric',
            'label' => 'required',
        ]);

        $programme = new Programme;

        $programme->daily_work_hours = $request->daily_work_hours;
        $programme->label = $request->label;

        $programme->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Programme::where('id', $id)->first();
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
            'daily_work_hours' => 'required|numeric',
            'label' => 'required',
        ]);

        $programme = Programme::where('id', $id)->first();

        $programme->daily_work_hours = $request->daily_work_hours;
        $programme->label = $request->label;

        $programme->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Programme::where('id', $id)->delete();
    }
}
