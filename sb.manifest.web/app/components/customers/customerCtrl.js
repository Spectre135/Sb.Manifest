'use strict';

var app = angular.module('SbManifest');

app.controller('customerCtrl', function ($scope, $state, $mdDialog, apiService, config) {

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

    //get Customers list
    $scope.getCustomerList = function () {
        $scope.myPage = 1;
        var url = config.manifestApi + '/customer/list';
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
            templateUrl: 'app/components/invoice/invoice.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            onRemoving: function (event, removePromise) {
                $scope.getCustomerList();
            }
        });
    };

    //add/edit Customer
    $scope.editCustomer = function ($event, dto) {
        $mdDialog.show({
            locals: {
                dataToPass: dto
            },
            controller: 'editCustomerCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'app/components/customers/editCustomer.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            onRemoving: function (event, removePromise) {
                $scope.getCustomerList();
            }
        });
    };

    //init
    $scope.init = function () {
        $scope.getCustomerList();
    };

});

app.controller('editCustomerCtrl', function ($scope, $mdDialog, dataToPass, apiService, config) {

    var self = this;
    $scope.warning = null;
    $scope.customer = dataToPass;
    $scope.label = $scope.customer == null ? 'Add new customer' : 'Edit ' + $scope.customer.Name;
    $scope.countries;

    self.cancel = function ($event) {
        $mdDialog.cancel();
    };

    self.save = function ($event) {
        var url = config.manifestApi + '/customer/save';
        apiService.postData(url, $scope.customer, true)
            .then(function () {
                $mdDialog.hide();
            });
    };

    $scope.getCountries = function () {
        $scope.workingCountries = true;
        var url = config.manifestApi + '/settings/countries';
        var promise = apiService.getData(url, null, false)
            .then(function (data) {
                $scope.countries = data.DataList;
            });
        return promise;
    };


});