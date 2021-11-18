const API_URL = 'https://crudcrud.com/api/b4484ac9a3fe49c9a349b9120c26aa92STOP';

angular.module('indexPage').controller('balanceCtrl', ['$scope', '$http',
    function ($scope, $http) {
        // States
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
            $scope.getInputs(resIn => {
                $scope.inputsList = resIn.data;
                $scope.getOutputs(resOut => {
                    $scope.outputsList = resOut.data;
                    $scope.calculateBalances();
                })
            })
        }

        $scope.getInputs = function (callback) {
            $http.get(API_URL + '/inputs').then(res => {
                callback({
                    data: res.data
                })
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
            $scope.reducedInputs = $scope.inputsList.reduce((prev, next) => prev + next.value, 0);
            $scope.reducedOutputs = $scope.outputsList.reduce((prev, next) => prev + next.value, 0);
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
            $http.post(API_URL + '/inputs', newInput).then(() => {
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

    }]);