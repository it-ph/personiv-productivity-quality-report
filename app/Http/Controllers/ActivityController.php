<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use DB;
use Carbon\Carbon;
use App\Activity;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ActivityController extends Controller
{
    public function reportSubmitted(Request $request)
    {
        $date_start = $request->month && $request->year ? Carbon::parse('first day of '. $request->month .' '. $request->year) : Carbon::parse('first day of this month');
        $date_end = $request->month && $request->year ? Carbon::parse('last day of '. $request->month .' '. $request->year): Carbon::parse('last day of this month');

        if($request->user()->role == 'admin')
        {
            return Activity::with(['report' => function($query){ $query->withTrashed(); }])->with('activity_type', 'user')->where('activity_type_id', 1)->whereBetween('created_at', [$date_start, $date_end])->get();
        }

        return Activity::with(['report' => function($query){ $query->withTrashed(); }])->with('activity_type', 'user')->where('user_id', $request->user()->id)->where('activity_type_id', 1)->whereBetween('created_at', [$date_start, $date_end])->get();            
    }

    public function reportUpdated(Request $request)
    {
        $date_start = $request->month && $request->year ? Carbon::parse('first day of '. $request->month .' '. $request->year) : Carbon::parse('first day of this month');
        $date_end = $request->month && $request->year ? Carbon::parse('last day of '. $request->month .' '. $request->year): Carbon::parse('last day of this month');

        if($request->user()->role == 'admin')
        {
            return Activity::with(['report' => function($query){ $query->withTrashed(); }])->with('activity_type', 'user')->where('activity_type_id', 2)->whereBetween('created_at', [$date_start, $date_end])->get();
        }

        return Activity::with(['report' => function($query){ $query->withTrashed(); }])->with('activity_type', 'user')->where('user_id', $request->user()->id)->where('activity_type_id', 2)->whereBetween('created_at', [$date_start, $date_end])->get();  
    }

    public function reportDeleted(Request $request)
    {
        $date_start = $request->month && $request->year ? Carbon::parse('first day of '. $request->month .' '. $request->year) : Carbon::parse('first day of this month');
        $date_end = $request->month && $request->year ? Carbon::parse('last day of '. $request->month .' '. $request->year): Carbon::parse('last day of this month');

        if($request->user()->role == 'admin')
        {
            return Activity::with(['report' => function($query){ $query->withTrashed(); }])->with('activity_type', 'user')->where('activity_type_id', 3)->whereBetween('created_at', [$date_start, $date_end])->get();
        }

        return Activity::with(['report' => function($query){ $query->withTrashed(); }])->with('activity_type', 'user')->where('user_id', $request->user()->id)->where('activity_type_id', 3)->whereBetween('created_at', [$date_start, $date_end])->get();  
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
