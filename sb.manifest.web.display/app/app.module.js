/* Main Module */
'use strict';

var app = angular.module('SbManifest', [
    'ui.router',
    'ngMaterial',
    'ngMessages'
]);

app.run(function ($state, $rootScope, $mdDialog, apiService, config) {

    //load server time
    apiService.getData(config.manifestApi + '/server/time', null, false).then(function (data) {
        $rootScope.newDateServerTime = new Date(data) - new Date();
        console.log('Server time ' + new Date(data));
        console.log('Time diff from server in miliseconds ' + $rootScope.newDateServerTime);
    });

    //to get Date from server
    $rootScope.getDate = function () {
        var copiedDate = new Date();
        return new Date(copiedDate.getTime() + $rootScope.newDateServerTime);
    };
    //calculate diff time from server and client
    $rootScope.getTimeDiffInMInutes = function (date) {
        var copiedDate = new Date();
        var now = new Date(copiedDate.getTime() + $rootScope.newDateServerTime);
        var scheduled = new Date(date);
        var diff = scheduled - now;
        return Math.floor(diff / 60000);
    };

    window.myAppErrorLog = [];

    $state.defaultErrorHandler(function (error) {
        // This is a naive example of how to silence the default error handler.
        window.myAppErrorLog.push(error);
    });

    //alert dialog
    $rootScope.showDialog = function (title, message) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#main')))
            .clickOutsideToClose(true)
            .title(title)
            .textContent(message)
            .ariaLabel('Alert Dialog')
            .ok('close')
        );
    };

    //we check if user is authenticated
    if (sessionStorage.getItem('Authorization') === null) {
        $state.go('prijava'); // go to login
    }

});
