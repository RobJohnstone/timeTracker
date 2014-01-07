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

timeTracker.controller('DaySummaryCtrl', ['$scope', '$routeParams', '$http',
    function($scope, $routeParams, $http) {
        $scope.date = utils.convertApiToJsDate($routeParams.day);
        $scope.prevDay = utils.convertJsToApiDate(utils.offsetDay($scope.date, -1), 'day');
        $scope.nextDay = utils.convertJsToApiDate(utils.offsetDay($scope.date, 1), 'day');
        $http.get('api/tasks/'+$routeParams.day).success(function(data) {
            $scope.tasks = data[$routeParams.day] || [];
        });

        $scope.saveTask = function($index) {
            var task = $scope.tasks[$index];
            $http.post('api/tasks/'+$routeParams.day, task).success(function(id) {
                task.id = id;
            });
        };

        $scope.addTask = function() {
            $scope.tasks.push({
                date: $routeParams.day,
                task: $scope.newTask
            });
            $scope.newTask = '';
            $scope.saveTask($scope.tasks.length - 1);
        };

        $scope.deleteTask = function($index) {
            var id = $scope.tasks[$index].id;
            if (id !== undefined) {
                $scope.tasks.splice($index, 1);
                $http.delete('api/tasks/'+id);
            }
        };
    }
]);