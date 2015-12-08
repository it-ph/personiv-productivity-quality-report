<!DOCTYPE html>
<html lang="en" ng-app="sharedModule">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Personiv | Productivity and Quality Report</title>
	<!-- Favicon -->
    <link rel="shortcut icon" href="/assets/img/Personiv-Favicon.png">
	<!-- Goolge Fonts Roboto -->
	<link href='https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic' rel='stylesheet' type='text/css'>
	<!-- Vendor CSS -->
	<link rel="stylesheet" href="/assets/css/vendor.css">
	<!-- Shared CSS -->
	<link rel="stylesheet" href="/assets/css/admin.css">
</head>
<body>
	<!-- Main View -->
	<div class="main-view hidden-custom" ng-controller="homePageController" ng-init="show()" id="main">
		<md-content flex layout="column" layout-align="center center" class="full-height-min main-content">
			<a href="/">
				<img show-gt-md hide-md hide-sm src="/assets/img/Personiv-Final_white_transparent.png" alt="Personiv Logo" class="personiv-logo">
				<img show-sm show-md hide-gt-md src="/assets/img/Personiv-icon_large-white.png" alt="" class="personiv-logo">
			</a>
			<h1 class="white-text md-headline weight-300">Productivity and Quality Report System</h1>
			<br>
			@if (count($errors) > 0)
			    <div class="alert alert-danger">
			        <ul>
			            @foreach ($errors->all() as $error)
			                <li>{{ $error }}</li>
			            @endforeach
			        </ul>
			    </div>
			@endif
			@yield('content')
		</md-content>
	</div>
	<!-- Vendor Scripts -->
	<script src="/assets/js/vendor.js"></script>
	<!-- Shared Script -->
	<script src="/assets/js/shared.js"></script>
</body>
</html>