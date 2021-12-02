angular.module('indexPage')
    .controller(
        'adminCtrl',
        ['$scope', '$state', '$http',
            function ($scope, $state, $http) {

                // State
                $scope.session = window.localStorage.getItem('userSession') ? JSON.parse(window.localStorage.getItem('userSession'))[0] : '';
                $scope.loginMessage = "";
                $scope.loginInfos = {
                    email: "",
                    password: ""
                };
                $scope.actionsList = {
                    1: { image: 'deposit', value: 1, text: 'Depósito' },
                    4: { image: 'loan', value: 4, text: 'Empréstimo' }
                };


                // Methods
                $scope.startCtrl = function () {
                    // if (!$scope.session) {
                    //     window.localStorage.clear();
                    //     $state.go('login')
                    // } else {
                        $scope.getTransactions(resIn => {
                            $scope.inputsList = resIn.data.filter(ele => (ele.typeTransaction === 1 || ele.typeTransaction === 4) && ele.transactionStatus === 'pending');
                        })
                    // }
                }
        
                $scope.getTransactions = function (callback) {
                    $http.get(API_URL + `transactions/admin/all`).then(res => {
                        callback(res.data)
                    })
                }

                $scope.completeTransaction = function (transaction, isCancel = false) {
                    $http.put(API_URL + `transactions/confirm?transactionId=${transaction.id}&confirmerId=${$scope.session.accountId}&isCancel=${isCancel}`).then(res => {
                        if(res.data.status === 200) {
                            $scope.inputsList.splice($scope.inputsList.indexOf(transaction), 1)
                        }
                    })
                }

                $scope.closeSession = function () {
                    window.localStorage.clear();
                    $state.go('login');
                }
            }
        ]
    );