'use strict';

var app = angular.module('SbManifest');

app.controller('prijavaCtrl', function ($scope, $state, config, apiService) {

    $scope.user = {};
    $scope.data = [];
    $scope.prijava = 'login';
    $scope.working = false;
    $scope.response = $state.params.response;
    $scope.success =  $state.params.success; //dobimo odgovor o uspešni menjavi gesla

    $scope.Login = function () {

        $scope.prijava = 'login...';
        $scope.working = true;
        $scope.success='';
        $scope.response='';
        var url = config.manifestApi + '/token/';
        apiService.postData(url, $scope.user, true).then(function (data) {
            if (data){
                sessionStorage.setItem('Authorization', data);
                $scope.working = false;
                $scope.Prijavljen();
            }else{
                $scope.prijava = 'login';
                $scope.working = false;
                $scope.response = 'Your login attempt was not successful.';
            }
            
        }, function (response) {

            $scope.prijava = 'login';
            $scope.working = false;
            $scope.response = response.data;
            
            if (response.status == 306){//admin set user must change pass
                $state.go('changepass',{response:$scope.response,user:$scope.user});
            }

            if (response.status == 403) {
                $scope.response = 'Nimate dovoljenja za dostop do aplikacije.';
            }

        });
    };

    $scope.Prijavljen = function () {
        $state.go('main'); // go to.
    };

    $('#prijava').keyup(function(event) {
        if (event.keyCode === 13) {
            $scope.Login();
        }
    });
});