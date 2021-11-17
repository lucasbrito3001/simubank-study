var myApp = angular.module('indexPage', ['ui.router']);

myApp.config(function ($stateProvider) {
  
  $stateProvider
    .state('balance', {
      url: '/balance',
      templateUrl: './components/balance/view/balanceView.html',
      controller: 'balanceCtrl'
    })

    .state('statement', {
      url: '/statement',
      templateUrl: './components/statement/view/balanceView.html',
      controller: 'statementCtrl'
    })
});