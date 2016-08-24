<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Member;
use App\User;
use DB;
use Carbon\Carbon;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Auth;

class MemberController extends Controller
{
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->id ? Member::whereNotIn('id', [$request->id])->where('full_name', $request->full_name)->where('department_id', Auth::user()->department_id)->first() : Member::where('full_name', $request->full_name)->where('department_id', Auth::user()->department_id)->first();

        return response()->json($duplicate ? true : false);
    }

    public function department($id)
    {
        // return DB::table('members')
        //     ->join('users', 'users.id', '=', 'members.team_leader_id')
        //     ->select(
        //         'members.*',
        //         DB::raw('UPPER(LEFT(members.full_name, 1)) as first_letter'),
        //         DB::raw('DATE_FORMAT(date_hired, "%b. %d, %Y") as date_hired')
        //     )
        //     ->where('users.department_id', $department_id)
        //     ->whereNull('deleted_at')
        //     ->orderBy('members.full_name')
        //     ->get();

        $id = (int)$id;

        return $id ? Member::with(['experiences' => function($query){ $query->with('project');}])->where('department_id', $id)->orderBy('full_name')->get() : Member::with(['experiences' => function($query){ $query->with('project');}])->where('department_id', Auth::user()->department_id)->orderBy('full_name')->get();
    }
    public function updateTenure()
    {
        $members = Member::with('experiences')->where('department_id', Auth::user()->department_id)->get();

        foreach ($members as $member_key => $member_value) {
            foreach($member_value->experiences as $experience_key => $experience_value){            
                $tenure = Carbon::today()->diffInMonths(Carbon::parse($experience_value->date_started));
                $experience_value->experience = $tenure < 3 ? 'Beginner' : (($tenure >= 3 && $tenure < 6) ? 'Moderately Experienced' : 'Experienced');
                $experience_value->save();
            }
        }
    }
    public function search(Request $request)
    {
        return Member::with(['experiences' => function($query){ $query->with('project');}])->where('department_id', Auth::user()->department_id)->where('full_name', 'like', '%' .$request->searchText. '%')->orderBy('full_name')->get();
    }
    public function teamLeader($team_leader_id)
    {
        $team_leader = User::where('id', $team_leader_id)->first();

        return Member::with(['experiences' => function($query){ $query->with('project'); }])->where('department_id', $team_leader->department_id)->get();
        // return DB::table('members')
        //     ->select(
        //         'members.*',
        //         DB::raw('UPPER(LEFT(members.full_name, 1)) as first_letter'),
        //         DB::raw('DATE_FORMAT(date_hired, "%b. %d, %Y") as date_hired')
        //     )
        //     ->where('members.team_leader_id', $team_leader_id)
        //     ->whereNull('deleted_at')
        //     ->orderBy('members.full_name')
        //     ->get();
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {   
        return Member::with('experiences')->where('department_id', Auth::user()->department_id)->get();   
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
        ]);

        $duplicate = Member::where('full_name', $request->full_name)->where('department_id', Auth::user()->department_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $member = new Member;

        $member->full_name = $request->full_name;
        // $member->date_hired = $request->date_hired;
        $member->department_id = Auth::user()->department_id;

        // get the difference of months from date hired to present
        // $tenure = date_diff(Carbon::today(), date_create($request->date_hired))->format("%m");
        // $member->experience = $tenure < 3 ? 'Beginner' : (($tenure > 3 && $tenure < 6) ? 'Moderately Experienced' : 'Experienced');

        $member->save();

        return $member->id;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Member::with(['experiences' => function($query){ $query->with('project');}])->where('id', $id)->first();
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
            'full_name' => 'required|string',
            // 'date_hired' => 'required|date',
            // 'team_leader_id' => 'required|numeric',
        ]);

        $duplicate = Member::whereNotIn('id', [$id])->where('full_name', $request->full_name)->where('department_id', Auth::user()->department_id)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $member = Member::where('id', $id)->first();

        $member->full_name = $request->full_name;
        // $member->date_hired = $request->date_hired;
        // $member->team_leader_id = $request->team_leader_id;

        // get the difference of months from date hired to present
        // $tenure = date_diff(Carbon::today(), date_create($request->date_hired))->format("%m");
        // $member->experience = $tenure < 3 ? 'Beginner' : (($tenure > 3 && $tenure < 6) ? 'Moderately Experienced' : 'Experienced');

        $member->save();

        return $member->id;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Member::where('id', $id)->delete();
    }
}
