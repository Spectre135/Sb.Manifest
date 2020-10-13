"use strict";var app=angular.module("SbManifest");function _skipIfAuthenticated($q){var defer=$q.defer();return null!=sessionStorage.getItem("Authorization")?defer.reject():defer.resolve(),defer.promise}function _redirectIfNotAuthenticated($q,$state,$timeout){var defer=$q.defer();return null!=sessionStorage.getItem("Authorization")?defer.resolve():($timeout((function(){$state.go("prijava")})),defer.reject()),defer.promise}app.config((function($stateProvider,$urlRouterProvider,$locationProvider){$urlRouterProvider.otherwise("/main/home"),$locationProvider.hashPrefix(""),$stateProvider.state("main",{url:"/main",templateUrl:"app/components/main/main.html",controller:"mainCtrl",abstract:!0}).state("prijava",{url:"/prijava",templateUrl:"app/components/prijava/prijava.html",controller:"prijavaCtrl",params:{success:null,response:null},resolve:{skipIfAuthenticated:_skipIfAuthenticated}}).state("user",{url:"/user",templateUrl:"app/components/user/user.html",controller:"userCtrl",params:{user:null},resolve:{redirectIfNotAuthenticated:_skipIfAuthenticated}}).state("changepass",{url:"/changepass",templateUrl:"app/components/user/changepass.html",controller:"settingsCtrl",params:{response:null,user:null},resolve:{redirectIfNotAuthenticated:_redirectIfNotAuthenticated}}).state("token",{url:"/token",templateUrl:"app/components/user/token.html",controller:"tokenCtrl",resolve:{skipIfAuthenticated:_skipIfAuthenticated}}).state("home",{url:"/home",parent:"main",resolve:{redirectIfNotAuthenticated:_redirectIfNotAuthenticated},views:{"@main":{templateUrl:"app/components/home/home.html",controller:"homeCtrl"}}}).state("load",{url:"/load",parent:"main",resolve:{redirectIfNotAuthenticated:_redirectIfNotAuthenticated},templateUrl:"app/components/load/load.html",controller:"loadCtrl"}).state("customers",{url:"/customers",parent:"main",resolve:{redirectIfNotAuthenticated:_redirectIfNotAuthenticated},templateUrl:"app/components/customers/customers.html",controller:"customerCtrl"}).state("payments",{url:"/payments",parent:"main",resolve:{redirectIfNotAuthenticated:_redirectIfNotAuthenticated},templateUrl:"app/components/payments/payments.html",controller:"paymentsCtrl"}).state("settings",{url:"/settings",parent:"main",params:{from:void 0,to:void 0,rows:null,page:1,limit:10,order:null},resolve:{redirectIfNotAuthenticated:_redirectIfNotAuthenticated},templateUrl:"app/components/settings/settings.html",controller:"settingsCtrl"}).state("report",{url:"/reports",parent:"main",resolve:{redirectIfNotAuthenticated:_redirectIfNotAuthenticated},templateUrl:"app/components/reports/report.html",controller:"reportCtrl"})}));