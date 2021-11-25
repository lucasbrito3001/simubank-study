var Module = angular.module('indexPage').controller('indexController', ['$scope', '$state',
function ($scope, $state) {
    $state.go('login')
}]);