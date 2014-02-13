"use strict";

var timeTracker = angular.module('timeTracker', [
    'ngRoute',
    'ngAnimate',
    'ngCookies'
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

timeTracker.controller('menuCtrl', ['$scope', '$http', '$cookies',
    function($scope, $http, $cookies) {
        $scope.logout = function() {
            $http.post('api/logout/').success(function() {
                location.reload();
            });
            delete $cookies.session;
        };
}]);