'use strict';

var app = angular.module('SbManifest');

app.controller('addSlotCtrl', function ($rootScope, $scope, $mdDialog, $filter, dataToPass, apiService, config) {
  var self = this;
  self.selectedItem = null;
  self.searchText = null;
  $scope.dto = dataToPass; //data from parent ctrl
  $scope.addPassengerList = [];
  $scope.productList = [];
  $scope.productSelected = $scope.dto.IdProductSelected != null ? $scope.dto.IdProductSelected : 1;
  $scope.productSlotList = [];
  $scope.persons = [];
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
    var person = $filter('filter')($scope.persons, function (item) {
      return item.Id == p;
    })[0];

    if (!person.IsStaff) {
      self.warning = null;
    }
    if (!checkFunds(p, d)) {
      self.warning = $rootScope.messages.notfunds + ' ' + person.Name;
    }
    //add person to slot
    var o = {};
    o.IdLoad = $scope.dto.Id; //IdLoad
    o.IdPerson = p;
    o.IdProductSlot = d.Id;
    if ($filter('filter')($scope.addPassengerList, function (item) {
        return item.IdPerson == p;
      }).length > 0) {
      self.warning = $rootScope.messages.duplicatePassengerInLoad;
    }
    //check if already have person with same idProductSlot then replace with new
    $scope.addPassengerList = $scope.addPassengerList.filter(({ IdProductSlot }) => IdProductSlot !== o.IdProductSlot); 
    $scope.addPassengerList.push(o);
    self.searchText = null;

  };

  function checkFunds(p, d) {
    //check if person have enought funds
    try {

      //check if have tickets for selected product
      var person = $filter('filter')($scope.persons, function (item) {
        return item.Id == p && item.IdProductSlot == d.Id && item.AvailableTickets > 0;
      })[0];

      if (person) {
        return true;
      }

      //person don't have tickets check for funds
      var person = $filter('filter')($scope.persons, function (item) {
        return item.Id == p;
      })[0];

      //skip if staff
      if (person.IsStaff) {
        return true;
      }

      //available funds(limit-balance) - cost of ticket if - then warning      
      //TODO user can add person or not ???
      if ((person.AvailableFunds - d.Income) > 0) {
        return true;
      }

      return false;

    } catch (err) {}
  };

  function getPersonList() {
    self.working = true;
    var url = config.manifestApi + '/load/active/';
    var params = {
      search: self.searchText,
      size: 20, //optional default 20
      idLoad: $scope.dto.Id
    };
    var promise = apiService.getData(url, params, false)
      .then(function (data) {
        $scope.persons = noDuplicates($scope.persons.concat(data.DataList));
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
        $scope.persons = noDuplicates($scope.persons.concat(data.DataList));
      }).finally(function () {
        self.working = false;
      });
    return promise;
  };

  $scope.onKeySearch = function ($event) {
    $event.stopPropagation();
    var array = {};
    if (self.searchText) {
      array = $filter('filter')($scope.persons, {
        Name: self.searchText
      });
      if (array.length == 0) {
        getPersonList();
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