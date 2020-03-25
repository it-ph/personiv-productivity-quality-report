<!DOCTYPE html>
<html lang="en" ng-app="teamLeaderModule">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Personiv | Productivity and Quality Report</title>
	<!-- Favicon -->
    <link rel="shortcut icon" href="{{url('/assets/img/2Color-Favicon_512x512-1-raw.png')}}">
	<!-- Goolge Fonts Roboto -->
	<link href='https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic' rel='stylesheet' type='text/css'>
	<!-- Vendor CSS -->
	<link rel="stylesheet" href="{{url('/assets/css/vendor.css')}}">
	<!-- Shared CSS -->
	<link rel="stylesheet" href="{{url('/assets/css/shared.css')}}">
	<!-- Admin CSS -->
	<link rel="stylesheet" href="{{url('/assets/css/team-leader.css')}}">
</head>
<body>
	<!-- Main View -->
	<div class="main-view" ui-view></div>
	<!-- Vendor Scripts -->
	<script src="{{url('/assets/js/vendor.js')}}"></script>
	<!-- Shared Script -->
	<script src="{{url('/assets/js/shared.js')}}"></script>
	<!-- Team Leader Script -->
	<script src="{{url('/assets/js/team-leader.js')}}"></script>
</body>
</html>