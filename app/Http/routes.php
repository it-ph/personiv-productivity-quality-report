<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', function () {
	if (Auth::check()) {
		return redirect('/home');
    }
    return view('auth.login');
});

// Authentication routes...
Route::get('auth/login', 'Auth\AuthController@getLogin');
Route::post('auth/login', 'Auth\AuthController@postLogin');
Route::get('auth/logout', 'Auth\AuthController@getLogout');

// Registration routes...
// Route::get('auth/register', 'Auth\AuthController@getRegister');
// Route::post('auth/register', 'Auth\AuthController@postRegister');

// Shell Page
Route::get('home', 'HomeController@role');

// Route resource
Route::resource('department', 'DepartmentController');
Route::resource('member', 'MemberController');
Route::resource('notification', 'NotificationController');
Route::resource('position', 'PositionController');
Route::resource('project', 'ProjectController');
Route::resource('performance', 'PerformanceController');
Route::resource('result', 'ResultController');
Route::resource('target', 'TargetController');
Route::resource('user', 'UserController');

// Route resource paginate
Route::get('member-paginate/{teamLeaderID}', 'MemberController@paginateTeamLeader');
Route::get('notification-paginate', 'NotificationController@paginate');
Route::get('performance-paginate', 'PerformanceController@paginate');
Route::get('performance-paginate/{departmentID}', 'PerformanceController@paginateDepartment');
Route::get('result-paginate', 'ResultController@paginate');

// Route resource search
Route::post('department-search', 'DepartmentController@search');
Route::post('member-search', 'MemberController@search');
Route::post('notification-search', 'NotificationController@search');
Route::post('result-search', 'ResultController@search');
Route::post('target-search', 'TargetController@search');
Route::post('result-search', 'ResultController@search');

// Other Routes
Route::get('position-project/{projectID}', 'PositionController@project');
Route::get('user-team-leader', 'UserController@teamLeader');
Route::get('member-team-leader/{teamLeaderID}', 'MemberController@teamLeader');
Route::get('target-position/{positionID}', 'TargetController@position');
Route::get('project-department/{departmentID}', 'ProjectController@department');