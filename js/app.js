var app = angular.module('myApp', ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider.when('/', {
            templateUrlL: 'home.html',
        })
        .when('/subjects', {
            templateUrlL: 'subjects.html',
            controller: 'subjectsCtrl'
        })
        .when('/quiz/:id/:name', {
            templateUrlL: 'quiz-app.html',
            controller: 'quizCtrl'
        })

});
app.controller('subjectsCtrl', function($scope, $http) {
    $scope.list_subject = [];
    $http.get('../db/subjects.js').then(function(res) {
        $scope.list_subject = res.data;
    })
})
app.controller('quizCtrl', function($scope, $http, $routeParams, quizFactory) {
    $http.get('../db/' + '$routeParams.id' + '.js').then(function(res) {
        // $scope.list_subject = res.data;
        quizFactory.questions = res.data;
    })
})
app.directive('quizfpoly', function(quizFactory) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'template-quiz.html',
        link: function(scope, elem, attrs) {
            scope.start = function() {
                scope.start = function() {
                    scope.id = 0;
                    scope.inProgess = true;
                    scope.getQuestion();
                    scope.quizOver = false; // chưa hoan thanh hết các câu hỏi
                }
            };
            scope.reset = function() {
                scope.start = function() {
                    scope.inProgess = false;
                    scope.score = 0;
                }
            };
            scope.getQuestion = function() {
                var quiz = quizFactory.getQuestion(scope.id);
                if (quiz != null) {
                    scope.question = quiz.text;
                    scope.options = quiz.Answer;
                    scope.answerMode = true;
                    scope.answer = AnswerId;
                } else {
                    scope.quizOver = true;
                }
            }
            scope.checkAnswer = function() {
                if (!$('input[name=answer]:checked').length) return;
                var ans = $('input[name=answer]:checked').val();
                if (ans == scope.answer) {
                    alert('dung');
                    scope.scope++;
                    scope.correctAns = true;
                } else {
                    scope.correctAns = false;
                    alert('sai');
                }
                scope.answerMode = false;
            }
            scope.nextQuestion = function() {
                scope.id++;
                scope.getQuestion();
            }
            scope.reset();
        }
    }
});
app.factory('quizFactory', function($http) {
    $http.get('../db/').then(function(res) {
        var questions = res.data;
        var count = questions.length;
    });
    return {
        // nang cao
        getQuestion: function(id) {
            var randomItem = questions[Math.floor(Math.random() * questions.length)];
            var count = questions.length;
            if (count > 10) {
                count = 10;
            };
            if (id < count) {
                return randomItem[i];
            } else {
                return false;
            }
            return questions[id];
        };
        getCount: function() {
            return count > 10 ? 10 : count;
        }
    }
})