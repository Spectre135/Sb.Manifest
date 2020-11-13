'use strict';

var app = angular.module('SbManifest');

app.controller('purchaseCtrl', function ($scope, $filter, $mdDialog, dataToPass, apiService, config) {
    var self = this;
    $scope.working = false;
    $scope.dto = dataToPass;
    $scope.dto.IdPayMethod = 1; //default Cash
    $scope.dto.Quantity = 1; //default Quantity

    function getProductsSlot() {
        var url = config.manifestApi + '/settings/sales/product/slot';
        var promise = apiService.getData(url, null, true)
            .then(function (data) {
                $scope.productList = $filter('filter')(data.DataList, function (item) {
                    return item.IsStaffJob == false && item.Income > 0
                });
                getProducts();
            })
        return promise;
    };

    function getProducts() {
        var url = config.manifestApi + '/settings/sales/product';
        var promise = apiService.getData(url, null, true)
            .then(function (data) {
                $scope.productList = $scope.productList.concat($filter('filter')(data.DataList, function (item) {
                    return item.IsProductSlot == false;
                }));
                getPayMethod();
            })
        return promise;
    };

    function getPayMethod() {
        var url = config.manifestApi + '/settings/paymethod';
        var promise = apiService.getData(url, null, true)
            .then(function (data) {
                $scope.payMethodList = data.DataList;
            })
        return promise;
    };

    self.save = function ($event) {
        var url = config.manifestApi + '/post/shop/buy';
        apiService.postData(url, $scope.dto, true)
            .then(function () {
                $mdDialog.hide();
            });
    };

    self.cancel = function ($event) {
        $mdDialog.cancel();
    };

    $scope.init = function () {
        getProductsSlot();
    };

    $scope.sum = function () {
        try {
            var array = $filter('filter')($scope.productList, function (item) {
                return item.Id == $scope.dto.IdProduct;
            });
            $scope.dto.Price = (array[0].Income * $scope.dto.Quantity);
            //populate details from product for post table
            //TODO input text with more text if needed
            $scope.dto.Details = array[0].Name + ' ' + array[0].Description;

        } catch (error) {

        }
    };
});