/* Main Module */
'use strict';

var app = angular.module('SbManifest', [
    'ui.router',
    'ngMaterial',
    'ngMessages'
]);

app.run(function ($state, $rootScope, $mdDialog, apiService, config) {

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
