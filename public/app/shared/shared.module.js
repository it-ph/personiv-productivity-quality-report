var sharedModule = angular.module('sharedModule', [
	/* Vendor Dependencies */
	'ui.router',
	'ngMaterial',
	'ngMessages',
	'infinite-scroll',
], function($interpolateProvider){
	$interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});