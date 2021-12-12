const API_URL = "https://finances-webapp.herokuapp.com/"; // HEROKU API URL
// const API_URL = "http://localhost:4200/" // LOCALHOST API URL

angular.module('indexPage').controller('balanceCtrl', ['$scope', '$state', '$http',
    function ($scope, $state, $http) {
        // States
        $scope.session = window.localStorage.getItem('userSession') ? JSON.parse(window.localStorage.getItem('userSession'))[0] : '';
        $scope.typeMovement = '';
        $scope.idToEdit = '';
        $scope.itemInfos = {
            description: '',
            value: ''
        };

        $scope.recipientDeposit = true;
        $scope.itemValue = '';
        $scope.inputsList = [];
        $scope.outputsList = [];

        $scope.setRecipientDeposit = function () { 
            $scope.recipientDeposit = !$scope.recipientDeposit;
        }
        
        $scope.actionsList = [
            { image: 'deposit', value: 1, text: 'Depósito' },
            { image: 'transfer', value: 2, text: 'Transferência' },
            { image: 'payment', value: 3, text: 'Solicitação de pagamento' },
            { image: 'loan', value: 4, text: 'Empréstimo' }
        ];

        $scope.statusList = {
            completed: {text: "Aceito", color: "success"},
            declined: {text: "Negado", color: "danger"},
            pending: {text: "Pendente", color: "warning"}
        };

        $scope.newMovement = {
            senderName: null,
            accountIdSender: null,
            accountIdRecipient: null,
            typeTransaction: null,
            amount: null
        }

        // Methods
        $scope.startCtrl = function () {
            if (!$scope.session) {
                window.localStorage.clear();
                $state.go('login')
            } else {
                $scope.getTransactions(resIn => {
                    $scope.inputsList = resIn.data;
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
            $scope.reducedInputs = $scope.inputsList.length > 0 ? $scope.inputsList.reduce((prev, next) => {
                if(next.transactionStatus === 'completed') {
                    if(next.accountIdSender == Number($scope.session.accountId)) {
                        return prev - next.amount
                    } else {
                        return prev + next.amount
                    }
                } else {
                    return prev
                }
            }, 0) : 0;

            $scope.reducedPendingInputs = $scope.inputsList.length > 0 ? $scope.inputsList.reduce((prev, next) => {
                if(next.transactionStatus === 'pending') {
                    return prev + next.amount
                } else {
                    return prev
                }
            }, 0) : 0;
        }

        $scope.addNewTransaction = function () {
            
            if($scope.newMovement.typeTransaction === 1) $scope.newMovement.accountIdRecipient = $scope.newMovement.accountIdRecipient 
            ? $scope.newMovement.accountIdRecipient 
            : $scope.session.accountId
            else if($scope.newMovement.typeTransaction === 3 || $scope.newMovement.typeTransaction === 4) $scope.newMovement.accountIdRecipient = $scope.session.accountId
            else $scope.newMovement.accountIdSender = $scope.session.accountId

            $scope.newMovement.senderName = $scope.session.name;

            $http.post(API_URL + 'transactions/new?accountId=' + $scope.session.accountId, $scope.newMovement).then(() => {
                $scope.startCtrl();
                $scope.newMovement = {
                    accountIdSender: null,
                    accountIdRecipient: null,
                    typeTransaction: null,
                    amount: null
                }
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

        $scope.closeActionsModal = function () {
            $scope.recipientDeposit = true;
            $scope.newMovement = {
                accountIdSender: null,
                accountIdRecipient: null,
                typeTransaction: null,
                amount: null
            };
        }

        $scope.closeSession = function () {
            window.localStorage.clear();
            $state.go('login');
        }

    }]);