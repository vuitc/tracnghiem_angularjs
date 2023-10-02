var app = angular.module('myApp', ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'home.html',
    }).when('/subjects', {
        templateUrl: 'subjects.html',
        controller: 'subjectsCtrl'
    }).when('/quiz/:id/:name', {
        templateUrl: 'quiz-app.html',
        controller: 'quizsCtrl',
    })
});
app.controller('subjectsCtrl', function($scope, $http) {
    $scope.list_subject = [];
    $http.get('../db/Subjects.js').then(function(res) {
        $scope.list_subject = res.data;
    })
})
app.controller('quizsCtrl', function($scope, $http, $routeParams, quizFactory) {
    $http.get('../db/Quizs/' + $routeParams.id + '.js')
        .then(function(res) {
            quizFactory.question = res.data;
        })
})
app.directive('quizfpoly', function(quizFactory, $routeParams) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'template-quiz.html',
        link: function(scope, elem, attrs) {
            scope.start = function() {
                quizFactory.getQs().then(function() {
                    scope.subjectName = $routeParams.name;
                    scope.id = 0;
                    scope.inProgess = true;
                    scope.getQuestion();
                    scope.count = quizFactory.getCount();
                    scope.quizOver = false; // chưa hoan thanh hết các câu hỏi
                })
            }

            scope.reset = function() {
                scope.inProgess = false;
                scope.score = 0;
                scope.quizOver = false; // Đặt lại để cho biết trò chơi chưa kết thúc
            }
            scope.getQuestion = function() {
                var quiz = quizFactory.getQuestion(scope.id);
                if (quiz) {
                    scope.question = quiz.Text;
                    scope.options = quiz.Answers;
                    scope.answer = quiz.AnswerId;
                    scope.answerMode = true;
                } else {
                    scope.quizOver = true;
                }
            }
            scope.checkAnswer = function() {
                if (!$('input[name=answer]:checked').length) return;
                var ans = $('input[name=answer]:checked').val(); // Sử dụng .val() để lấy giá trị đã chọn
                if (ans == scope.answer) {
                    // alert("Đúng");
                    scope.score++;
                    scope.correct = true;
                } else {
                    // alert("Sai");
                    scope.correct = false;
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
app.factory('quizFactory', function($http, $routeParams) {
    var question = []; // Khởi tạo mảng questions để lưu trữ câu hỏi

    // // Sử dụng $http để tải dữ liệu từ tệp 'ADAV.js'
    // $http.get('../db/Quizs/ADAV.js').then(function(res) {
    //     question = res.data;
    //     // Đảm bảo rằng câu hỏi đã được tải thành công
    //     // alert(question.length);
    // });

    return {
        getQs: function() {
            return $http.get('../db/Quizs/' + $routeParams.id + '.js').then(function(res) {
                question = res.data
            })
        },
        getQuestion: function(id) {
            var randomItem = question[Math.floor(Math.random() * question.length)];
            var count = question.length;
            if (count > 2) {
                count = 2;
            };
            if (id < count) {
                return randomItem;
            } else {
                return false;
            }
            // return question[id];
        },
        getCount: function() {
            return question.length > 10 ? 10 : question.length;
        }
    }
});