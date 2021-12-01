var myApp = angular.module('indexPage', ['ui.router']);

myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/');
  
  $stateProvider
    .state('home', {
      abstract: true,
      url: '/',
      templateUrl: './index.html',
      controller: 'indexController',
    })

    .state('balance', {
      url: '/balance',
      templateUrl: './src/app/components/balance/views/balanceView.html',
      controller: 'balanceCtrl',
    })

    .state('confirmation', {
      url: '/confirmation',
      templateUrl: './src/app/components/confirmation/views/confirmationView.html',
      controller: 'confirmationCtrl'
    })

    .state('login', {
      url: '/login',
      templateUrl: './src/app/components/login/views/loginView.html',
      controller: 'loginCtrl'
    })

    .state('register', {
      url: '/register',
      templateUrl: './src/app/components/register/views/registerView.html',
      controller: 'registerCtrl'
    })
});