<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Experience;
use Auth;
use DB;
use Carbon\Carbon;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ExperienceController extends Controller
{
    public function members($project_id)
    {
        return Experience::with('member')->where('project_id', $project_id)->get();
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Carbon::today());
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
        $experiences = Experience::where('member_id', $request->input('0.member_id'))->delete();

        for ($i=0; $i < count($request->all()); $i++) { 
            $this->validate($request, [
                $i.'.member_id' => 'required|numeric',
                // $i.'.id' => 'required|numeric',
                $i.'.date_started' => 'required',
            ]);

            if($request->input($i.'.project')){            
                $experience = new Experience;

                $experience->member_id = $request->input($i.'.member_id');
                $experience->project_id = $request->input($i.'.project.id');
                $experience->date_started = Carbon::parse($request->input($i.'.date_started'));

                $tenure = Carbon::today()->diffInMonths(Carbon::parse($request->input($i.'.date_started')));
                $experience->experience = $tenure < 3 ? 'Beginner' : (($tenure >= 3 && $tenure < 6) ? 'Moderately Experienced' : 'Experienced');

                $experience->save();
            }
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
