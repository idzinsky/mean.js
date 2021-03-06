var appTodo = angular.module('appTodo', []);

function mainController($scope, $http) {
  $scope.formData = {};

  $http.get('/api/todo/all')
    .success(function(data) {
      $scope.todos = data;
      console.log(data);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  $scope.createTodo = function() {
    $http.post('/api/todo', $scope.formData)
      .success(function(data) {
        $scope.formData= {};
        $scope.todos = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  $scope.deleteTodo = function(id) {
    $http.delete('/api/todo/' + id)
      .success(function(data) {
        $scope.todos = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };
}