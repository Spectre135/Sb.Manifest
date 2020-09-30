'use strict';

var app = angular.module('SbManifest');

app.controller('paymentsCtrl', function ($scope, $state, $window, $mdDialog, apiService, config) {

    $scope.data = $state.params.data;
    $scope.list = $state.params.list;
    $scope.myPage = $state.params.page;
    $scope.myLimit = $state.params.limit;
    $scope.myOrder = $state.params.order;
    $scope.query = {
        order: 'name',
        limit: 5,
        page: 1
    };
    $scope.rows = $state.params.rows;

    //get Post list
    $scope.getPaymentsList = function () {
        $scope.myPage = 1; //pagging
        var url = config.manifestApi + '/post/list';
        var params = {};

        apiService.getData(url, params, true)
            .then(function (data) {
                $scope.list = data.DataList;
                $scope.rows = data.RowsCount;
            });

    };

    //get Invoice
    $scope.getInvoice = function ($event, dto) {
        $mdDialog.show({
            locals: {
                dataToPass: dto
            },
            controller: 'invoiceCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'app/components/payments/invoice.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            onRemoving: function (event, removePromise) {
                $scope.getLoadList();
            }
        });
    };
    //init
    $scope.init = function () {
        ///če še nimamo liste potem je to verjetno prvi obisk strani
        if (!$state.params.list) {
            $scope.getPaymentsList();
        }
    };

});

app.controller('invoiceCtrl', function ($scope, $state, $window, $mdDialog, dataToPass, apiService, config) {
    var self = this;
    $scope.dto = dataToPass; //data from parent ctrl
    $scope.working = false;

    //get Invoice data
    $scope.getInvoiceData = function () {
        $scope.working = true;
        var url = config.manifestApi + '/post/invoice';
        var params = { 'idCustomer': $scope.dto.IdCustomer };

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

    self.cancel = function ($event) {
        $mdDialog.cancel();
    };
});