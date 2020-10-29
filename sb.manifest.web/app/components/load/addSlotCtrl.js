'use strict';

var app = angular.module('SbManifest');

app.controller('addSlotCtrl', function ($rootScope, $scope, $mdDialog, $filter, dataToPass, apiService, config) {
  var self = this;
  self.selectedItem = null;
  self.searchText = null;
  $scope.dto = dataToPass; //data from parent ctrl
  $scope.addPassengerList = [];
  $scope.productList = [];
  $scope.productSelected = $scope.dto.IdProductSelected!=null ? $scope.dto.IdProductSelected:1; 
  $scope.productSlotList = [];
  $scope.customers = [];
  self.working = false;

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
    self.warning = null;
    $scope.productSlot = $filter('filter')($scope.productSlotList, function (item) {
      return item.IdProduct == id;
    });
    if ($scope.dto.SlotsLeft < $scope.productSlot.length) {
      self.warning = $rootScope.messages.nomoreslots;
    }
  };

  $scope.isValid = function () {
    try {
      if ($scope.productSlot == null || self.warning) {
        return false;
      }
      return ($scope.productSlot.length <= $scope.addPassengerList.length);
    } catch (error) {
      return false;
    }
  };

  $scope.addPassenger = function (p, d) {
    //check if person have enought funds
    if (!checkFunds(p, d)) {
      var name = $filter('filter')($scope.customers, function (item) {
        return item.Id == p;
      })[0].Name;
      self.warning = $rootScope.messages.notfunds + ' ' + name;
    }
    //add person to slot
    var o = {};
    o.IdLoad = $scope.dto.Id; //IdLoad
    o.IdCustomer = p;
    o.IdProductSlot = d.Id;
    if ($filter('filter')($scope.addPassengerList, function (item) {
        return item.IdCustomer == p;
      }).length > 0) {
      self.warning = $rootScope.messages.duplicatePassengerInLoad;
    }
    $scope.addPassengerList.push(o);
    self.searchText = null;

  };

  function checkFunds(p, d) {
    //check if person have enought funds
    try {

      //find person from list customers
      var person = $filter('filter')($scope.customers, function (item) {
        return item.Id == p;
      })[0];

      //skip if staff
      if (person.IsStaff){
        return true;
      }

      //check if have tickets for selected product
      if (person.AvaibleTickets>0 && person.IdProductSlot==d.Id){
        return true;
      }

      //avaible funds(limit-balance) - cost of ticket if - then warning      
      //TODO user can add person or not ???
      if ((person.AvaibleFunds - d.Income) > 0) {
        return true;
      }

      return false;
      
    } catch (err) {}
  };

  function getCustomerList() {
    self.working = true;
    var url = config.manifestApi + '/load/active/';
    var params = {
      search: self.searchText,
      size: 20, //optional default 20
      idLoad: $scope.dto.Id
    };
    var promise = apiService.getData(url, params, false)
      .then(function (data) {
        $scope.customers = noDuplicates($scope.customers.concat(data.DataList));
      }).finally(function () {
        self.working = false;
      });
    return promise;
  };

  function getActiveToday() {
    self.working = true;
    var url = config.manifestApi + '/load/active/today';
    var params = {
      idLoad: $scope.dto.Id
    };
    var promise = apiService.getData(url, params, false)
      .then(function (data) {
        $scope.customers = noDuplicates($scope.customers.concat(data.DataList));
      }).finally(function () {
        self.working = false;
      });
    return promise;
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