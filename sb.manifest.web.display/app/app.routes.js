'use strict';

var app = angular.module('SbManifest');

// configure app routes
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/display');
    $locationProvider.hashPrefix('');

    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: 'app/components/main/main.html',
            controller: 'mainCtrl',
            abstract: true
        })
        .state('display', {
            url: '/display',
            templateUrl: 'app/components/display/display.html',
            controller: 'displayCtrl',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('prijava', {
            url: '/prijava',
            templateUrl: 'app/components/prijava/prijava.html',
            controller: 'prijavaCtrl',
            resolve: {
                skipIfAuthenticated: _skipIfAuthenticated,
            }
        });
});

function _skipIfAuthenticated($q) {
    var defer = $q.defer();

    if (sessionStorage.getItem('Authorization') != null) {
        defer.reject();
    } else {
        defer.resolve();
    }
    return defer.promise;
};

function _redirectIfNotAuthenticated($q, $state, $timeout) {
    var defer = $q.defer();
    if (sessionStorage.getItem('Authorization') != null) {
        defer.resolve();
    } else {
        $timeout(function () {
            $state.go('prijava');
        });
        defer.reject();
    }
    return defer.promise;
};