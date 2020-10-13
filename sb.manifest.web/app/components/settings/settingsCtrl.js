'use strict';

var app = angular.module('SbManifest');

app.controller('settingsCtrl', function ($scope, $state, $mdDialog, apiService, config) {

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

    function getData(url, params) {
        $scope.myPage = 1; //pagging
        apiService.getData(url, params, true)
            .then(function (data) {
                $scope.list = data.DataList;
                $scope.rows = data.RowsCount;
            });
    };

    //get Product list
    $scope.getProducts = function () {
        var url = config.manifestApi + '/settings/sales/product';
        var params = {};
        getData(url, params);
    };

    //add/edit new Product
    $scope.editProduct = function ($event, dto) {
        $mdDialog.show({
            locals: {
                dataToPass: dto
            },
            controller: 'editProductCtrl',
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/components/settings/editProduct.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            onRemoving: function (event, removePromise) {
                $scope.getProducts();
            }
        });
    };

    //add/edit new Product Slot
    $scope.editProductSlot = function ($event, dto) {
        $mdDialog.show({
            locals: {
                dataToPass: dto
            },
            controller: 'editProductSlotCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'app/components/settings/editProductSlot.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            onRemoving: function (event, removePromise) {
                $scope.getProductSlot();
            }
        });
    };

    //get Product Slot list
    $scope.getProductSlot = function () {
        var url = config.manifestApi + '/settings/sales/product/slot';
        var params = {};
        getData(url, params);
    };

    //get Aircrafts list
    $scope.getAircrafts = function () {
        var url = config.manifestApi + '/settings/aircraft';
        var params = {};
        getData(url, params);
    };

    //add/edit new Aircfrat
    $scope.editAircraft = function ($event, dto) {
        $mdDialog.show({
            locals: {
                dataToPass: dto
            },
            controller: 'editAircraftCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'app/components/settings/editAircraft.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            onRemoving: function (event, removePromise) {
                $scope.getAircrafts();
            }
        });
    };

    //init
    $scope.init = function () {
        //nimamo še podatkov prvič na strani
        if (!$scope.list) {
            $scope.getProducts();
        }
    };

});

app.controller('editProductCtrl', function ($scope, $mdDialog, dataToPass, apiService, config) {

    var self = this;
    $scope.warning = null;
    $scope.dto = dataToPass;
    $scope.label = $scope.dto == null ? 'Add new ' : 'Edit Product ' + $scope.dto.Name;

    self.cancel = function ($event) {
        $mdDialog.cancel();
    };

    self.save = function ($event) {
        var url = config.manifestApi + '/settings/sales/product/save';
        apiService.postData(url, $scope.dto, true)
            .then(function () {
                $mdDialog.hide();
            });
    };

});

app.controller('editProductSlotCtrl', function ($scope, $mdDialog, dataToPass, apiService, config) {
    var self = this;
    $scope.warning = null;
    $scope.dto = dataToPass;
    $scope.label = $scope.dto == null ? 'Add new ' : 'Edit ' + $scope.dto.Name;

    self.cancel = function ($event) {
        $mdDialog.cancel();
    };

    self.save = function ($event) {
        var url = config.manifestApi + '/settings/sales/product/slot/save';
        apiService.postData(url, $scope.dto, true)
            .then(function () {
                $mdDialog.hide();
            });
    };

    function getProducts() {
        var url = config.manifestApi + '/settings/sales/product';
        apiService.getData(url, null, true)
            .then(function (data) {
                $scope.productList = data.DataList;
                getAccounts();
            })
    };

    function getAccounts() {
        var url = config.manifestApi + '/settings/account';
        apiService.getData(url, null, true)
            .then(function (data) {
                $scope.accountList = data.DataList;
            })
    };

    //init
    $scope.init = function(){
        getProducts();
    };
});

app.controller('editAircraftCtrl', function ($scope, $mdDialog, dataToPass, apiService, config) {
    var self = this;
    $scope.warning = null;
    $scope.dto = dataToPass;
    $scope.label = $scope.dto == null ? 'Add new ' : 'Edit ' + $scope.dto.Registration;

    self.cancel = function ($event) {
        $mdDialog.cancel();
    };

    self.save = function ($event) {
        var url = config.manifestApi + '/settings/aircraft/save';
        apiService.postData(url, $scope.dto, true)
            .then(function () {
                $mdDialog.hide();
            });
    };
});