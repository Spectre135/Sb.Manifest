'use strict';

var app = angular.module('SbManifest');

app.controller('userCtrl', function ($scope, $state, config, apiService) {

    $scope.user = $state.params.user;
    $scope.data = [];
    $scope.label = 'Spremeni geslo';
    $scope.working = false;
    $scope.response = '';

    $scope.ChangePass = function () {
        sessionStorage.setItem('Authorization', sessionStorage.getItem('SingleUseAuthorization'));
        $scope.working = true;
        $scope.label = 'Delam...';
        var url = config.authApi + '/api/ad/user/reset/';
        apiService.postData(url, $scope.user, true).then(function (data) {
            if (data){
                $scope.working = false;
                sessionStorage.removeItem('Authorization');
                sessionStorage.removeItem('SingleUseAuthorization');
                $state.go('prijava',{success: 'Geslo je uspešno spremenjeno ! Lahko se prijavite z novim geslom.'});
            }else{
                $scope.working = false;
                $scope.label = 'Spremeni geslo';
                $scope.response = 'Sprememba gesla ni uspelo !';
            }          
        },function (response) {

            $scope.label = 'Spremeni geslo';
            $scope.working = false;
            $scope.response = response.data;

        });
    };

});