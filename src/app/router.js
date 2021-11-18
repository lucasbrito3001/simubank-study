var myApp = angular.module('indexPage', ['ui.router']);

myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/');
  
  $stateProvider
    .state('balance', {
      url: '/balance',
      templateUrl: './components/balance/views/balanceView.html',
      controller: 'balanceCtrl',
    })

    .state('statement', {
      url: '/statement',
      templateUrl: './components/statement/views/statementView.html',
      controller: 'statementCtrl'
    })
});