'use strict';

var app = angular.module('SbManifest');

app.controller('settingsCtrl', function ($scope, $rootScope, $state, $mdDialog, apiService, config) {

    $rootScope.page = 'Settings | ';
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

    //delete Product
    $scope.deleteProduct = function ($event, dto) {
        $rootScope.confirmDialog('Confirm delete', 'Would you like to delete product ' + dto.Name + '?', 'Delete', 'Cancel')
            .then(function onSuccess(result) {
                var url = config.manifestApi + '/settings/sales/product/delete';
                apiService.postData(url, dto, true).then(function () {
                    $scope.getProducts();
                });
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
    //delete ProductSlot
    $scope.deleteProductSlot = function ($event, dto) {
        $rootScope.confirmDialog('Confirm delete', 'Would you like to delete product slot ' + dto.Name + '?', 'Delete', 'Cancel')
            .then(function onSuccess(result) {
                var url = config.manifestApi + '/settings/sales/product/slot/delete';
                apiService.postData(url, dto, true).then(function () {
                    $scope.getProductSlot();
                });
            });
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

    //delete Aircraft
    $scope.deleteAircraft = function ($event, dto) {
        $rootScope.confirmDialog('Confirm delete', 'Would you like to delete Aircraft ' + dto.Registration + ' ' + dto.Name + '?', 'Delete', 'Cancel')
            .then(function onSuccess(result) {
                var url = config.manifestApi + '/settings/aircraft/delete';
                apiService.postData(url, dto, true).then(function () {
                    $scope.getAircrafts();
                });
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
    $scope.label = $scope.dto == null ? 'Add new ' : $scope.dto.Name;

    self.cancel = function ($event) {
        $mdDialog.cancel();
    };

    $scope.getAccounts = function () {
        var url = config.manifestApi + '/settings/account';
        var promise = apiService.getData(url, null, true)
            .then(function (data) {
                $scope.accountList = data.DataList;
            });
        return promise;
    };


    $scope.init = function () {
        if ($scope.dto) {
            if ($scope.dto.IdAccount) {
                $scope.accountList = [{
                    'Id': $scope.dto.IdAccount,
                    'Name': $scope.dto.AccountDescription
                }];
            }
        }
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
    $scope.label = $scope.dto == null ? 'Add new ' : $scope.dto.Name;


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

    $scope.getProducts = function () {
        var url = config.manifestApi + '/settings/sales/product';
        apiService.getData(url, null, true)
            .then(function (data) {
                $scope.productList = data.DataList;
            })
    };

    $scope.getAccounts = function () {
        var url = config.manifestApi + '/settings/account';
        var promise = apiService.getData(url, null, true)
            .then(function (data) {
                $scope.accountList = data.DataList;
            });
        return promise;
    };

    //init
    $scope.init = function () {

        if ($scope.dto) {
            if ($scope.dto.IdProduct) {
                $scope.productList = [{
                    'Id': $scope.dto.IdProduct,
                    'Name': $scope.dto.ProductName
                }];
            }

            if ($scope.dto.IdAccount) {
                $scope.accountList = [{
                    'Id': $scope.dto.IdAccount,
                    'Name': $scope.dto.AccountDescription
                }];
            }
        }
    };
});

app.controller('editAircraftCtrl', function ($scope, $mdDialog, dataToPass, apiService, config) {
    var self = this;
    $scope.warning = null;
    $scope.dto = dataToPass;
    $scope.label = $scope.dto == null ? 'Add new ' : $scope.dto.Registration;

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