"use strict";

var timeTracker = angular.module('timeTracker', [
    'ngRoute',
    'ngAnimate'
]);

timeTracker.config(['$routeProvider', 
    function($routeProvider) {
        $routeProvider.
            when('/month/:month', {
                templateUrl: 'partials/monthSummary.html',
                controller: 'MonthSummaryCtrl'
            }).
            when('/month/', {
                redirectTo: '/month/' + utils.convertJsToApiDate(new Date(), 'month')
            }).
            when('/day/:day', {
                templateUrl: 'partials/dayView.html',
                controller: 'DaySummaryCtrl'
            }).
            when('/day/', {
                redirectTo: '/day/' + utils.convertJsToApiDate(new Date(), 'day')
            }).
            otherwise({
                redirectTo: '/day/'
            });
    }]);