var Module = angular.module('indexPage').controller('indexController', ['$scope', '$state',
function ($scope, $state) {
    console.log($state)
    $state.go('login')
}]);