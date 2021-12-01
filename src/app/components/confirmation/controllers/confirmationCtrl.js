angular.module('indexPage').controller('confirmationCtrl', ['$scope', '$state', '$http',
    function ($scope, $state, $http) {
        // States
        $scope.session = window.localStorage.getItem('userSession') ? JSON.parse(window.localStorage.getItem('userSession'))[0] : '';
        $scope.actionsList = [
            { image: 'deposit', value: 1, text: 'Depósito' },
            { image: 'transfer', value: 2, text: 'Transferência' },
            { image: 'payment', value: 3, text: 'Solicitação de pagamento' },
            { image: 'loan', value: 4, text: 'Empréstimo' }
        ];

        // Methods
        $scope.startCtrl = function () {
            if (!$scope.session) {
                window.localStorage.clear();
                $state.go('login')
            } else {
                $scope.getTransactions(resIn => {
                    $scope.inputsList = resIn.data.filter(transaction => ((transaction.typeTransaction === 3) || (transaction.typeTransaction === 1)) && transaction.transactionStatus === 'pending');
                    $scope.calculateBalances();
                })
            }
        }

        $scope.getTransactions = function (callback) {
            $http.get(API_URL + `transactions/filter/account?accountId=${$scope.session.accountId}`).then(res => {
                callback(res.data)
            })
        }

        $scope.calculateBalances = function () {
            $scope.reducedPendingInputs = $scope.inputsList.length > 0 ? $scope.inputsList.reduce((prev, next) => {
                return prev + next.amount
            }, 0) : 0;
        }

        $scope.confirmTransaction = function (transaction) {
            $http.put(API_URL + `transactions/confirm?transactionId=${transaction.id}&confirmerId=${$scope.session.accountId}`).then(res => {
                if(res.data.status === 200) {
                    $scope.inputsList.splice($scope.inputsList.indexOf(transaction), 1)
                }
            })
        }

        $scope.closeSession = function () {
            window.localStorage.clear();
            $state.go('login');
        }

    }]);