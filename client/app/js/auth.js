"use strict";

var timeTrackerAuth = angular.module('timeTrackerAuth', [
    'ngRoute',
    'ngAnimate'
]);

timeTrackerAuth.config(['$routeProvider', 
    function($routeProvider) {
        $routeProvider.
            when('/login/', {
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl'
            }).
            when('/signup/', {
                templateUrl: 'partials/signup.html',
                controller: 'SignupCtrl'
            }).
            when('/info/', {
                templateUrl: 'partials/info.html',
                controller: 'InfoCtrl'
            }).
            otherwise({
                redirectTo: '/login/'
            });
    }]);

timeTrackerAuth.controller('LoginCtrl', ['$scope', '$http',
    function($scope, $http) {
        $scope.invalid = false;

        $scope.login = function(user) {
        	$http.post('api/auth/', user).success(function(response) {
                if (response.success) {
                    location.reload(true);
                } else {
                    $scope.invalid = response.reason;
                }
            });
        };

        $scope.signup = function(user) {
            $http.post('api/signup/', user).success(function(response) {
                if (response.success) {
                    location.reload(true);
                } else {
                    $scope.invalid = response.reason;
                }
            });
        };

        $scope.dismissError = function() {
            $scope.invalid = false;
        };
    }
]);