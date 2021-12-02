var Module = angular.module('indexPage').controller('registerCtrl', ['$scope', '$state', '$http',
    function ($scope, $state, $http) {
        $scope.API_URL = "https://finances-webapp.herokuapp.com/"; // HEROKU API URL
        // $scope.API_URL = "http://localhost:4200/"; // LOCALHOST API URL
        $scope.registerInfos = {
            name: null,
            phone: null,
            email: null,
            password: null
        };

        $scope.registerNewAccount = function () {
            $http.post($scope.API_URL + 'accounts/register', {...$scope.registerInfos, agencyId: 1}).then((res) => {
                if(res.data.status === 201) {
                    $state.go('login');
                }
            }).catch(err => {
                console.log(err.data.message)
            })
        }
    }
]);