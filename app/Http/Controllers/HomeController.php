<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function role(Request $request)
    {
    	return view($request->user()->role.'.home');
    }

    public function home()
    {
    	if (Auth::check()) {
			return redirect('/home');
	    }

	    return view('auth.login');
    }
}
