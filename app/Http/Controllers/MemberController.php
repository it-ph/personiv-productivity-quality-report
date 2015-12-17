<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Member;
use DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class MemberController extends Controller
{
    public function search(Request $request)
    {
        return DB::table('members')
            // ->join('positions', 'positions.id', '=', 'members.position_id')
            ->select(
                'members.*',
                // 'positions.name as position',
                DB::raw('UPPER(LEFT(members.full_name, 1)) as first_letter')
            )
            ->where('members.team_leader_id', $request->team_leader_id)
            ->where('members.full_name', 'like', '%'. $request->userInput .'%')
            // ->orWhere('positions.name', 'like', '%'. $request->userInput .'%')
            ->orWhere('members.experience', 'like', '%'. $request->userInput .'%')
            // ->groupBy('members.id')
            ->get();
    }
    public function teamLeader($team_leader_id)
    {
        return DB::table('members')
            // ->join('positions', 'positions.id', '=', 'members.position_id')
            ->select(
                'members.*',
                // 'positions.name as position',
                DB::raw('UPPER(LEFT(members.full_name, 1)) as first_letter')
            )
            ->where('members.team_leader_id', $team_leader_id)
            // ->orderBy('positions.name')
            ->orderBy('members.full_name')
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
        $this->validate($request, [
            'full_name' => 'required|string',
            // 'position_id' => 'required|numeric',
            'experience' => 'required|string',
            'team_leader_id' => 'required|numeric',
        ]);

        $member = new Member;

        $member->full_name = $request->full_name;
        // $member->position_id = $request->position_id;
        $member->experience = $request->experience;
        $member->team_leader_id = $request->team_leader_id;

        $member->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Member::where('id', $id)->first();
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
