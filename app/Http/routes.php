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
Route::resource('report', 'ReportController');

// Route resource paginate
Route::get('member-paginate/{teamLeaderID}', 'MemberController@paginateTeamLeader');
Route::get('notification-paginate', 'NotificationController@paginate');
Route::get('report-paginate', 'ReportController@paginate');
Route::get('report-paginate-details', 'ReportController@paginateDetails');
Route::get('report-paginate/{departmentID}', 'ReportController@paginateDepartment');
Route::get('report-paginate-details/{departmentID}', 'ReportController@paginateDepartmentDetails');

// Route resource search
Route::post('department-search', 'DepartmentController@search');
Route::post('project-search', 'ProjectController@search');
Route::post('position-search', 'PositionController@search');
Route::post('member-search', 'MemberController@search');
Route::post('report-search', 'ReportController@search');
Route::post('report-search-department/{departmentID}', 'ReportController@searchDepartment');
// Route::post('result-search', 'ResultController@search');
// Route::post('target-search', 'TargetController@search');

// Other Routes
Route::get('position-project/{projectID}', 'PositionController@project');
Route::get('user-team-leader', 'UserController@teamLeader');
Route::get('member-team-leader/{teamLeaderID}', 'MemberController@teamLeader');
Route::get('target-position/{positionID}', 'TargetController@position');
Route::get('target-department/{departmentID}', 'TargetController@department');
Route::get('project-department/{departmentID}', 'ProjectController@department');
Route::get('notification-unseen', 'NotificationController@unseen');
Route::put('notification-seen/{notificationID}', 'NotificationController@seen');
Route::get('target-productivity/{positionID}', 'TargetController@productivity');
Route::get('target-quality/{positionID}', 'TargetController@quality');
Route::put('member-update-tenure/{teamLeaderID}', 'MemberController@updateTenure');
Route::post('performance-check-limit/{memberID}', 'PerformanceController@checkLimit');
Route::post('performance-check-limit-edit/{memberID}', 'PerformanceController@checkLimitEdit');
Route::get('report-download/{reportID}', 'ReportController@download');
Route::get('report-download-summary/{date_start}/to/{date_end}', 'ReportController@downloadSummary');
Route::get('performance-report/{reportID}', 'PerformanceController@report');
Route::get('report-download-monthly-summary/{month}/year/{year}', 'ReportController@downloadMonthlySummary');

Route::get('report-monthly', 'ReportController@monthly');