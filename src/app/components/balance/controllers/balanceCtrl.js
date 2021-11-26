const API_URL = "https://finances-webapp.herokuapp.com/"; // YOUR CRUD CRUD LINK HERE

angular.module('indexPage').controller('balanceCtrl', ['$scope', '$state', '$http',
    function ($scope, $state, $http) {
        // States
        $scope.session = JSON.parse(window.localStorage.getItem('userSession'));
        $scope.typeMovement = '';
        $scope.idToEdit = '';
        $scope.itemInfos = {
            description: '',
            value: ''
        };
        $scope.itemValue = '';
        $scope.inputsList = [
            // {description: 'Teste1', value: 1000},{description: 'Teste1', value: 1000}
        ];
        $scope.outputsList = [
            // {description: 'Teste1', value: 1000},{description: 'Teste1', value: 1000}
        ];

        // Methods
        $scope.startCtrl = function () {
            if (!$scope.session) {
                window.localStorage.clear();
                $state.go('login')
            }
            $scope.getTransactions(resIn => {
                $scope.inputsList = resIn.data;
                $scope.calculateBalances();
                // $scope.getOutputs(resOut => {
                //     $scope.outputsList = resOut.data;
                // })
            })
        }

        $scope.getTransactions = function (callback) {
            $http.get(API_URL + 'transactions/filter/account?accountId=1').then(res => {
                callback(res.data)
            })
        }

        $scope.getOutputs = function (callback) {
            $http.get(API_URL + '/outputs').then(res => {
                callback({
                    data: res.data
                })
            });
        }

        $scope.calculateBalances = function () {
            $scope.reducedInputs = $scope.inputsList.length > 0 ? $scope.inputsList.reduce((prev, next) => prev + next.amount, 0) : 0;
            $scope.reducedOutputs = $scope.outputsList.length > 0 ? $scope.outputsList.reduce((prev, next) => prev + next.value, 0) : 0;
        }

        $scope.setTypeMovement = function (type, item) {
            $scope.typeMovement = type
            if (item) {
                $scope.itemInfos.description = item.description;
                $scope.itemInfos.value = item.value;
                $scope.idToEdit = item._id;
            } else {
                $scope.itemInfos.description = "";
                $scope.itemInfos.value = "";
                $scope.idToEdit = "";
            }
        }

        $scope.addNewItem = function (newItem) {
            $scope.typeMovement === 'Entrada'
                ? $scope.addNewInput(newItem)
                : $scope.addNewOutput(newItem);
        }

        $scope.editItem = function (editingItem) {
            const isInput = $scope.inputsList.filter(ele => ele._id === $scope.idToEdit)[0];
            $http.put(API_URL + (isInput ? '/inputs/' : '/outputs/') + $scope.idToEdit, editingItem).then(() => {
                isInput
                    ? $scope.getInputs(res => {
                        $scope.inputsList = res.data;
                        $scope.calculateBalances();
                    })
                    : $scope.getOutputs(res => {
                        $scope.outputsList = res.data;
                        $scope.calculateBalances();
                    })
            })
        }

        $scope.addNewInput = function (newInput) {
            const teste = {
                accountIdSender: 1,
                accountIdRecipient: 1, 
                typeTransaction: 1,
                amount: 100
            }
            $http.post(API_URL + 'transactions/new', teste).then(() => {
                $scope.getInputs(res => {
                    $scope.inputsList = res.data;
                    $scope.calculateBalances();
                })
            })
        }

        $scope.addNewOutput = function (newOutput) {
            $http.post(API_URL + '/outputs', newOutput).then(() => {
                $scope.getOutputs(res => {
                    $scope.outputsList = res.data;
                    $scope.calculateBalances();
                })
            })
        }

        $scope.deleteItem = function (toDelete) {
            const isInput = $scope.inputsList.filter(ele => ele._id === toDelete._id)[0];
            $http.delete(API_URL + (isInput ? '/inputs/' : '/outputs/') + toDelete._id).then(() => {
                isInput
                    ? $scope.getInputs(res => {
                        $scope.inputsList = res.data;
                        $scope.calculateBalances();
                    })
                    : $scope.getOutputs(res => {
                        $scope.outputsList = res.data;
                        $scope.calculateBalances();
                    })
            })
        }

        $scope.closeSession = function () {
            window.localStorage.clear();
            $state.go('login');
        }

    }]);