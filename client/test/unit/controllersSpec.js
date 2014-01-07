"use strict";

describe('controllers', function(){
    beforeEach(module('timeTracker'));

    describe('MonthSummaryCtrl', function() {
        var ctrl, scope, routeParams, $httpBackend;

        beforeEach(inject(function($controller, $rootScope, _$httpBackend_) {
            scope = $rootScope.$new(), 
            routeParams = {
                month: '2013-12' 
            },
            $httpBackend = _$httpBackend_,
            ctrl = $controller('MonthSummaryCtrl', {$scope: scope, $routeParams: routeParams});
        }));

        it('should set date correctly', function() {
            expect(scope.date).toEqual(new Date(2013, 11, 1));
        });

        it('should set previous month correctly', function() {
            expect(scope.prevMonth).toBe('2013-11');
        });

        it('should set next month correctly', function() {
            expect(scope.nextMonth).toBe('2014-01');
        });

        it('should get the month\'s tasks', function() {
            $httpBackend.expectGET('api/tasks/2013-12')
                        .respond('{"2014-01-03":[{"id":"4","date":"2014-01-03","task":"A January task"}],"2014-01-02":[{"id":"28","date":"2014-01-02","task":"arg"},{"id":"29","date":"2014-01-02","task":"rag"},{"id":"31","date":"2014-01-02","task":"drg"},{"id":"36","date":"2014-01-02","task":"arg"}],"2013-12-31":[{"id":"43","date":"2013-12-31","task":"ath"},{"id":"67","date":"2013-12-31","task":"srth"}]}');
            $httpBackend.flush();
            expect(Object.keys(scope.tasks).length).toBe(3);
            expect(scope.tasks['2014-01-02'].length).toBe(4);
        });
    });

    describe('DaySummaryCtrl', function() {
        var ctrl, scope, routeParams, $httpBackend;

        beforeEach(inject(function($controller, $rootScope, _$httpBackend_) {
            scope = $rootScope.$new(),
            routeParams = {
                day: '2013-12-31'
            },
            $httpBackend = _$httpBackend_,
            ctrl = $controller('DaySummaryCtrl', {$scope: scope, $routeParams: routeParams});
            $httpBackend.expectGET('api/tasks/2013-12-31')
                        .respond('{"2013-12-31":[{"id":"10","date":"2013-12-31","task":"test"},{"date":"2013-12-31","task":"srth"}]}');
        }));

        it('should set date correctly', function() {
            expect(scope.date).toEqual(new Date(2013, 11, 31));
        });

        it('should set previous day correctly', function() {
            expect(scope.prevDay).toBe('2013-12-30');
        });

        it('should set next day correctly', function() {
            expect(scope.nextDay).toBe('2014-01-01');
        });

        it('should get the day\'s tasks', function() {
            $httpBackend.flush();
            expect(Object.keys(scope.tasks).length).toBe(2);
        });

        it('should save task when requested and return id', function() {
            $httpBackend.flush();
            $httpBackend.expectPOST('api/tasks/2013-12-31', scope.tasks[0]).respond('100');
            scope.saveTask(0);
            $httpBackend.flush();
            expect(scope.tasks[0].id).toBe('100');
        });

        describe('add tasks', function() {

            beforeEach(function() {
                $httpBackend.flush();
            });

            it('should add task when requested', function() {
                expect(scope.tasks.length).toBe(2);
                scope.newTask = 'new task';
                scope.addTask();
                expect(scope.tasks.length).toBe(3);
            });

            it('should set new task to an empty string after a task is added', function() {
                scope.newTask = 'new task';
                scope.addTask();
                expect(scope.newTask).toBe('');
            });

            it('should save task after it has been added', function() {
                scope.newTask = 'new task';
                spyOn(scope, 'saveTask');
                scope.addTask();
                expect(scope.saveTask).toHaveBeenCalled();
            });
        });

        describe('delete tasks', function() {

            beforeEach(function() {
                $httpBackend.flush();
            });

            it('should delete task when requested', function() {
                expect(scope.tasks.length).toBe(2);
                scope.deleteTask(0);
                expect(scope.tasks.length).toBe(1);
            });

            it('should not delete task if the task id is undefined', function() {
                expect(scope.tasks.length).toBe(2);
                scope.deleteTask(1);
                expect(scope.tasks.length).toBe(2);
            });

            it('should send delete request to server', function() {
                $httpBackend.expectDELETE('api/tasks/10');
                scope.deleteTask(0);
            });
        });
    });
});
