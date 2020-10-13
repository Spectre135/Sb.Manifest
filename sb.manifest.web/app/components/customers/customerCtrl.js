'use strict';

var app = angular.module('SbManifest');

app.controller('customerCtrl', function ($scope, $state, $mdDialog, apiService, config) {

    $scope.list;
    $scope.query = {
        order: '',
        limit: 5,
        page: 1,
        filter: '',
        asc:false
    };
    $scope.rows;

    //get Customers list
    $scope.getCustomerList = function () {
        var url = config.manifestApi + '/customer/list';
        $scope.query.asc = !$scope.query.asc;
        var params = {
            search: $scope.search,
            pageIndex: $scope.query.page,
            pageSizeSelected: $scope.query.limit,
            sortKey: $scope.query.order,
            asc:$scope.query.asc

        };
        $scope.promise = apiService.getData(url, params, true)
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
            clickOutsideToClose: false
        }).then(function() {
            $scope.getCustomerList();
        }).catch(function() {});;
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
            clickOutsideToClose: false
        }).then(function() {
            $scope.getCustomerList();
        }).catch(function() {});
    };

    //submit search button on Enter key
    $scope.onKeyPressSearch = function (event) {
        if (event.charCode === 13) { //if enter then hit the search button
            $scope.getCustomerList();
        }
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
        var url = config.manifestApi + '/settings/countries';
        var promise = apiService.getData(url, null, false)
            .then(function (data) {
                $scope.countries = data.DataList;
            });
        return promise;
    };

    $scope.setCountry = function(dto){
        $scope.countries= [{Id:dto.IdCountry,
                           Name:dto.Country}];
    };

});