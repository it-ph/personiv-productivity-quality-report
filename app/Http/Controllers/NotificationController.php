<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Notification;
use DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class NotificationController extends Controller
{
    public function unseen()
    {
        return DB::table('reports')
            ->join('users', 'users.id', '=', 'reports.user_id')
            ->join('projects', 'projects.id', '=', 'reports.project_id')
            ->join('notifications', 'notifications.event_id', '=', 'reports.id')
            ->select(
                'reports.*',
                'users.*',
                'projects.*',
                'notifications.*',
                DB::raw('LEFT(users.first_name, 1) as first_letter'),
                DB::raw('DATE_FORMAT(notifications.created_at, "%h:%i %p %b. %d, %Y") as created_at')
            )
            ->where('notifications.seen', false)
            ->orderBy('notifications.updated_at', 'desc')
            ->get();
    }
    public function seen($id)
    {
        $notification = Notification::where('id', $id)->first();

        $notification->seen = true;

        $notification->save();
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
