'use strict';

var app = angular.module('SbManifest');

app.controller('addSlotCtrl', function ($rootScope, $scope, $mdDialog, $filter, dataToPass, apiService, config) {
  var self = this;
  $scope.warning = null;
  self.selectedItem = null;
  self.searchText = null;
  $scope.dto = dataToPass; //data from parent ctrl
  $scope.addPassengerList = [];
  $scope.productList = [];
  $scope.productSelected = 1; //default product selected
  $scope.productSlotList = [];
  $scope.customers = [];
  $scope.working = false;

  self.cancel = function ($event) {
    $mdDialog.cancel();
  };

  self.add = function ($event) {
    var url = config.manifestApi + '/load/slot/add';
    apiService.postData(url, $scope.addPassengerList, true)
      .then(function () {
        $mdDialog.hide();
      });
  };

  $scope.productChange = function (id) {
    $scope.warning = null;
    $scope.productSlot = $filter('filter')($scope.productSlotList, function (item) {
      return item.IdProduct == id;
    });
    if ($scope.dto.SlotsLeft < $scope.productSlot.length) {
      $scope.warning = $rootScope.messages.nomoreslots;
    }
  };

  $scope.isValid = function () {
    try {
      if ($scope.productSlot == null) {
        return false;
      }
      return ($scope.productSlot.length <= $scope.addPassengerList.length);
    } catch (error) {
      return false;
    }
  };

  $scope.addPassenger = function (p, d) {
    var o = {};
    o.IdLoad = $scope.dto.Id; //IdLoad
    o.IdCustomer = p;
    o.IdProductSlot = d;
    $scope.addPassengerList.push(o);
    self.searchText = null;
  };

  function getCustomerList() {
    $scope.working = true;
    var url = config.manifestApi + '/load/active/';
    var params = {
      search: self.searchText,
      size: 20, //optional default 20
      idLoad:$scope.dto.Id
    };
    apiService.getData(url, params, false)
      .then(function (data) {
        $scope.customers = noDuplicates($scope.customers.concat(data.DataList));
      }).finally(function () {
        $scope.working = false;
      });
  };

  function getActiveToday() {
    $scope.working = true;
    var url = config.manifestApi + '/load/active/today';
    var params = {
      idLoad:$scope.dto.Id
    };
    apiService.getData(url, params, false)
      .then(function (data) {
        $scope.customers = noDuplicates($scope.customers.concat(data.DataList));
      }).finally(function () {
        $scope.working = false;
      });
  };

  $scope.onKeySearch = function ($event) {
    $event.stopPropagation();
    var array = {};
    if (self.searchText) {
      array = $filter('filter')($scope.customers, {
        Name: self.searchText
      });
      if (array.length == 0) {
        getCustomerList();
      }
    }
  };

  $scope.init = function () {
    var url = config.manifestApi + '/settings/sales/product';
    var params = {};
    apiService.getData(url, params, true)
      .then(function (data) {
        $scope.productList = data.DataList;
        //load productslot list 
        //TODO if we have large dataset load only selected product id
        var url = config.manifestApi + '/settings/sales/product/slot';
        var params = {};
        apiService.getData(url, params, true)
          .then(function (data) {
            $scope.productSlotList = data.DataList;
            //nastavimo product 1 selected
            $scope.productChange($scope.productSelected);
            getActiveToday();
          });
      });
  };
});