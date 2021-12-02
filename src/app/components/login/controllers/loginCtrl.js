
const API_URL = "https://finances-webapp.herokuapp.com/"; // HEROKU API URL
// const API = "http://localhost:4200/" // LOCALHOST API URL
var Module = angular.module('indexPage').controller('loginCtrl', ['$scope', '$http', '$state',

function ($scope, $http, $state) {
        $scope.email = "";
        $scope.password = "";
        $scope.loginMessage = "";

        $scope.startComponent = function() {
            if(window.localStorage.getItem('userSession')) {
                $state.go('balance')
            }
        }

        $scope.login = function () {
            $scope.loginMessage = "";
            $http.post(API + 'accounts/login', {email: $scope.email, password: $scope.password}).then((res) => {
                let session = res.data.data;
                window.localStorage.setItem('userSession', JSON.stringify(session))
                if(session[0].name.toLowerCase() === 'administrador') $state.go('admin-dashboard')
                else $state.go('balance')
            }).catch(err => {
                $scope.loginMessage = err.data.message;
            })
        }

    }

]);