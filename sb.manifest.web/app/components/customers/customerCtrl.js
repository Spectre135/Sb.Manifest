'use strict';

var app = angular.module('SbManifest');

app.controller('customerCtrl', function ($scope, $state, $mdDialog, apiService, config) {
    $scope.list = $state.params.list;
    $scope.query = $state.params.query;
    $scope.rows = $state.params.rows;

    //get Customers list
    $scope.getCustomerList = function () {
        var url = config.manifestApi + '/customer/list';
        $scope.query.asc = !$scope.query.asc;
        var params = {
            search: $scope.search,
            pageIndex: $scope.query.page,
            pageSizeSelected: $scope.query.limit,
            sortKey: $scope.query.order,
            asc: $scope.query.asc

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
            templateUrl: 'app/components/shop/invoice.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false
        }).then(function () {
            $scope.getCustomerList();
        }).catch(function () {});;
    };

    //Purchase products
    $scope.purchase = function ($event, dto) {
        //dodamo idCustomer za purchase metodo
        dto.IdCustomer = dto.Id;
        $mdDialog.show({
            locals: {
                dataToPass: dto
            },
            controller: 'purchaseCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'app/components/shop/purchase.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false
        }).then(function () {}).catch(function () {});
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
        }).then(function () {
            $scope.getCustomerList();
        }).catch(function () {});
    };

    //submit search button on Enter key
    $scope.onKeyPressSearch = function ($event) {
        if ($event.charCode === 13) { //if enter then hit the search button
            $scope.getCustomerList();
        }
    };

    //show customer details
    $scope.detailsCustomer = function (dto) {
        $state.go('detailsCustomer', {
            dto: dto,
            list: $scope.list,
            query: $scope.query,
            rows: $scope.rows,
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
    $scope.label = $scope.customer == null ? 'Add new customer' : $scope.customer.Name;
    $scope.countries;
    $scope.customer.BirthDate = $scope.customer.BirthDate == null ? new Date(1950, 0, 1) : $scope.customer.BirthDate;

    self.cancel = function ($event) {
        $mdDialog.cancel();
    };

    self.save = function ($event) {
        $scope.customer.BirthDate = convertLocalDate($scope.customer.BirthDate);
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

    $scope.setCountry = function (dto) {
        $scope.countries = [{
            Id: dto.IdCountry,
            Name: dto.Country
        }];
    };

});

app.controller('detailsCustomerCtrl', function ($scope, $state, $mdDialog, apiService, config) {

    //parent parameters we needed to return on exact page
    $scope.pList = $state.params.list;
    $scope.pQuery = $state.params.query;
    $scope.pRows = $state.params.rows;
    $scope.dto = $state.params.dto;
    $scope.query = {
        order: '',
        limit: 5,
        page: 1,
        filter: '',
        asc: false
    };
    $scope.rows;

    //get Ticket Post list
    $scope.getTicketPostList = function () {
        var url = config.manifestApi + '/customer/ticketpost/list';
        $scope.query.asc = !$scope.query.asc;
        var params = {
            search: $scope.search,
            idCustomer: $scope.dto.Id,
            pageIndex: $scope.query.page,
            pageSizeSelected: $scope.query.limit,
            sortKey: $scope.query.order,
            asc: $scope.query.asc

        };
        $scope.promise = apiService.getData(url, params, true)
            .then(function (data) {
                $scope.tickets = data.DataList;
                $scope.rows = data.RowsCount;
            });
    };

    //get Jump activity
    $scope.getLoadList = function () {
        var url = config.manifestApi + '/customer/load/list';
        $scope.query.asc = !$scope.query.asc;
        var params = {
            search: $scope.search,
            idCustomer: $scope.dto.Id,
            pageIndex: $scope.query.page,
            pageSizeSelected: $scope.query.limit,
            sortKey: $scope.query.order,
            asc: $scope.query.asc

        };
        $scope.promise = apiService.getData(url, params, true)
            .then(function (data) {
                $scope.jumps = data.DataList;
                $scope.rows = data.RowsCount;
            });
    };

    //submit search button on Enter key
    $scope.onKeyPressSearch = function ($event) {
        if ($event.charCode === 13) { //if enter then hit the search button
            $scope.getTicketPostList();
        }
    };

    //Purchase products
    $scope.purchase = function ($event) {
        //dodamo idCustomer za purchase metodo
        $scope.dto.IdCustomer = $scope.dto.Id;
        $mdDialog.show({
            locals: {
                dataToPass: $scope.dto
            },
            controller: 'purchaseCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'app/components/shop/purchase.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false
        }).then(function () {}).catch(function () {});
    };
    //init
    $scope.init = function () {
        //$scope.getTicketPostList();
        $scope.getLoadList();
    };

    //back to all customer list
    $scope.back = function () {
        $state.go('customers', {
            list: $scope.pList,
            rows: $scope.pRows,
            query: $scope.pQuery
        });
    };

});
