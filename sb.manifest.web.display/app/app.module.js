/* Main Module */
'use strict';

var app = angular.module('SbManifest', [
    'ui.router',
    'ngMaterial',
    'ngMessages'
]);

app.run(function ($state, $rootScope,apiService) {

    window.myAppErrorLog = [];

    $state.defaultErrorHandler(function (error) {
        // This is a naive example of how to silence the default error handler.
        window.myAppErrorLog.push(error);
    });

    //we check if user is authenticated
    if (sessionStorage.getItem('Authorization') === null) {
        $state.go('prijava'); // go to login
    }

});
