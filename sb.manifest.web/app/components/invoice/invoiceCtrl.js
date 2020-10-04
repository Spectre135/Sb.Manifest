'use strict';

var app = angular.module('SbManifest');

app.controller('invoiceCtrl', function ($scope, $state, $window, $mdDialog, dataToPass, apiService, config) {
    var self = this;
    $scope.working = false;
    $scope.dto = dataToPass;

    //get Invoice data
    $scope.getInvoiceData = function () {
        $scope.working = true;
        var url = config.manifestApi + '/post/invoice';
        var params = { 'idCustomer': $scope.dto.Id };

        apiService.getData(url, params, false)
            .then(function (data) {
                $scope.list = data.DataList;
                $scope.rows = data.RowsCount;
            }).finally(function () {
                $scope.working = false;
            });

    };

    $scope.sum = function(){
        var sum=0;
        angular.forEach( $scope.list, function(value, key) {
            sum = sum + value.Amount;
          });

          return sum;
    };

    self.save = function ($event) {
        var url = config.manifestApi + '/post/invoice/pay';
        apiService.postData(url, $scope.list, true)
            .then(function () {
                $mdDialog.hide();
            });
    };

    self.cancel = function ($event) {
        $mdDialog.cancel();
    };
});