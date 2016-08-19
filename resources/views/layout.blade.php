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
	<!-- <style>
		body {
			overflow: auto;
		}
	</style> -->
</head>
<body>
	<script src="/assets/js/vendor.js"></script>
	<script src="/assets/js/shared.js"></script>
	<!-- Main View -->
	<div class="main-view">
		<md-content class="full-height-max" flex layout="column">
			<div class="hide-overflow" layout="row" flex>
				<div layout="column" flex class="overflow-y-hidden">
					<md-content flex layout="column">
						@yield('content')
					</md-content>
				</div>
			</div>
		</md-content>
	</div>
	<!-- Vendor Scripts -->
	<!-- Shared Script -->
</body>
</html>