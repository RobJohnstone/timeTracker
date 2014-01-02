"use strict";

var timeTracker = angular.module('timeTracker', [
	'ngRoute'
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
				controller: 'DayViewCtrl'
			}).
			when('/day/', {
				redirectTo: '/day/' + utils.convertJsToApiDate(new Date(), 'day')
			}).
			otherwise({
				redirectTo: '/day/'
			});
	}])

timeTracker.controller('MonthSummaryCtrl', ['$scope', '$routeParams', '$http',
	function($scope, $routeParams, $http) {
		$scope.date = utils.convertApiToJsDate($routeParams.month);
		$scope.prevMonth = utils.convertJsToApiDate(utils.offsetMonth($scope.date, -1), 'month');
		$scope.nextMonth = utils.convertJsToApiDate(utils.offsetMonth($scope.date, 1), 'month');
		$http.get('api/tasks/'+$routeParams.month).success(function(data) {
			$scope.tasks = data;
		});
	}
]);

timeTracker.controller('DayViewCtrl', ['$scope', '$routeParams', '$http',
	function($scope, $routeParams, $http) {
		$scope.date = utils.convertApiToJsDate($routeParams.day);
		$scope.prevDay = utils.convertJsToApiDate(utils.offsetDay($scope.date, -1), 'day');
		$scope.nextDay = utils.convertJsToApiDate(utils.offsetDay($scope.date, 1), 'day');
		$http.get('api/tasks/'+$routeParams.day).success(function(data) {
			$scope.tasks = data[$routeParams.day] || [];
		});

		$scope.saveTask = function($index) {
			$http.post('api/tasks/'+$routeParams.day, $scope.tasks[$index]);
		};

		$scope.addTask = function() {
			$scope.tasks.push({
				date: $routeParams.day,
				task: $scope.newTask
			});
			$scope.newTask = '';
			$scope.saveTask($scope.tasks.length - 1);
		};
	}
]);

