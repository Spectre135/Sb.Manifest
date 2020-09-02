'use strict';

var app = angular.module('SbManifest');

app.controller('settingsCtrl',  function ($rootScope, $scope, $state, apiService, config, obvestila) {
    
    $scope.label;
    $scope.working = false;
    $scope.isChangePass = false;
    $scope.isChangePhone = false;
    $scope.response = $state.params.response;
    $scope.user = $state.params.user;
    $scope.telefonObvestilo1 = obvestila.telefon1;
    $scope.telefonObvestilo2 = obvestila.telefon2;
    $scope.telefonObvestilo3 = obvestila.telefon3;
    $scope.smsSend = false;

    $scope.setChangePass = function(flag){
        if (flag){
            $scope.label = 'Spremeni geslo';
            $scope.isChangePhone = !flag;
        }
        $scope.isChangePass = flag;
        $scope.response=null;
    };

    $scope.setChangePhone = function(flag){
        if (flag){
            $scope.label = 'Pošlji SMS žeton za spremembo tel. številke';
            $scope.isChangePass = !flag;
        }
        $scope.isChangePhone = flag;
        $scope.response=null;
    };

    if (!$scope.user){
        $scope.user={};
        $scope.user.UporabniskoIme = $rootScope.user.nameid;
    }

    $scope.ChangePass = function () {
        $scope.response=null;
        $scope.working = true;
        $scope.label = 'Delam...';
        var url = config.authApi + '/api/ad/user/change/';
        apiService.postData(url, $scope.user, true).then(function (data) {
            if (data){
                $scope.working = false;
                sessionStorage.removeItem('Authorization');
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

    $scope.SendSMSToken = function () {
        $scope.working = true;
        $scope.label = 'Pošiljam...';
        var url = config.authApi + '/api/ad/singleuse/token/';
        apiService.postData(url, $scope.user, true).then(function (data) {
            $scope.working = false; 
            $scope.smsSend = true;       
            $scope.label = 'Spremeni tel. številko';
        },function (response) {
            $scope.label = 'Pošlji SMS žeton za spremembo tel. številke';
            $scope.working = false;
            $scope.response = response.data;
        });
        
    };
});