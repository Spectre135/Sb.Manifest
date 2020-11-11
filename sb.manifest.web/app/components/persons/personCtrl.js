'use strict';

var app = angular.module('SbManifest');

app.controller('personCtrl', function ($scope, $state, $mdDialog, apiService, config) {
    $scope.list = $state.params.list;
    $scope.query = $state.params.query;
    $scope.rows = $state.params.rows;

    //get persons list
    $scope.getPersonList = function () {
        var url = config.manifestApi + '/person/list';
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
            $scope.getPersonList();
        }).catch(function () {});;
    };

    //Purchase products
    $scope.purchase = function ($event, dto) {
        //dodamo idperson za purchase metodo
        dto.Idperson = dto.Id;
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
        }).then(function () {
            $scope.getPersonList();
        }).catch(function () {});
    };

    //add/edit person
    $scope.editPerson = function ($event, dto) {
        $mdDialog.show({
            locals: {
                dataToPass: dto
            },
            controller: 'editPersonCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'app/components/persons/editPerson.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false
        }).then(function () {
            $scope.getPersonList();
        }).catch(function () {});
    };

    //submit search button on Enter key
    $scope.onKeyPressSearch = function ($event) {
        if ($event.charCode === 13) { //if enter then hit the search button
            $scope.getPersonList();
        }
    };

    //show person details
    $scope.detailPerson = function (dto) {
        $state.go('detailPerson', {
            dto: dto,
            list: $scope.list,
            query: $scope.query,
            rows: $scope.rows,
        });
    };
    //init
    $scope.init = function () {
        $scope.getPersonList();
    };

});

app.controller('editPersonCtrl', function ($scope, $mdDialog, dataToPass, apiService, config) {

    var self = this;
    $scope.warning = null;
    $scope.person = dataToPass;
    $scope.label = $scope.person == null ? 'Add new person' : $scope.person.Name;
    $scope.countries;
    $scope.person.BirthDate = $scope.person.BirthDate == null ? new Date(1950, 0, 1) : $scope.person.BirthDate;

    self.cancel = function ($event) {
        $mdDialog.cancel();
    };

    self.save = function ($event) {
        $scope.person.BirthDate = convertLocalDate($scope.person.BirthDate);
        var url = config.manifestApi + '/person/save';
        apiService.postData(url, $scope.person, true)
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

    //check if email aready taken unique attribute in database
    $scope.checkEmail = function () {
        var url = config.manifestApi + '/person/email/exist';
        var params = {
            email: $scope.person.Email
        };
        var promise = apiService.getData(url, params, false)
            .then(function (data) {
                if (data.RowsCount>0){
                    $scope.form.email.$setValidity('emailexist', false);
                }
            });
        return promise;
    };

});

app.controller('detailPersonCtrl', function ($scope, $state, $mdDialog, apiService, config) {

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
        var url = config.manifestApi + '/person/ticketpost/list';
        $scope.query.asc = !$scope.query.asc;
        var params = {
            search: $scope.search,
            idPerson: $scope.dto.Id,
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
        var url = config.manifestApi + '/person/load/list';
        $scope.query.asc = !$scope.query.asc;
        var params = {
            search: $scope.search,
            idPerson: $scope.dto.Id,
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
        //dodamo idPerson za purchase metodo
        $scope.dto.IdPerson = $scope.dto.Id;
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

    //back to all person list
    $scope.back = function () {
        $state.go('persons', {
            list: $scope.pList,
            rows: $scope.pRows,
            query: $scope.pQuery
        });
    };

});
