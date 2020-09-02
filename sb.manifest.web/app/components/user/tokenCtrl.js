'use strict';

var app = angular.module('SbManifest');

app.controller('tokenCtrl', function ($scope, $state, config, apiService) {

    $scope.user = {};
    $scope.data = [];
    $scope.label = 'Pošlji SMS žeton';
    $scope.working = false;
    $scope.response = ''; 

    //remove previouse  single use token if exists
    sessionStorage.removeItem('SingleUseAuthorization');

    $scope.SendSMSToken = function () {
        $scope.working = true;
        $scope.label = 'Pošiljam...';
        var url = config.authApi + '/api/ad/singleuse/token/';
        apiService.postData(url, $scope.user, true).then(function (data) {
            if (data){
                sessionStorage.setItem('SingleUseAuthorization', data);
                $scope.working = false;
                $state.go('user',{user: $scope.user});
            }else{
                $scope.working = false;
                $scope.label = 'Pošlji SMS žeton';
                $scope.response = 'Pošiljanje SMS žetona ni uspelo !';
            }          
        },function (response) {

            $scope.label = 'Pošlji SMS žeton';
            $scope.working = false;
            $scope.response = response.data;

        });
        
    };

});