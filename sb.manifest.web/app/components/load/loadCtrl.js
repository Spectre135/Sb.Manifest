'use strict';

var app = angular.module('SbManifest');

app.controller('loadCtrl', function ($rootScope, $scope, $q, $filter, $mdDialog, apiService, config) {

    $scope.loads;
    $scope.query = {
        order: '',
        limit: 5,
        page: 1
    };
    $scope.rows;
    $scope.moved = {}; //array when we move passengers between loads
    $scope.moved.IdCustomer = []; //array when we move passengers between loads

    $scope.selectedIdCustomer;

    //getLoadList
    $scope.getLoadList = function () {
        var params = {};
        var url = config.manifestApi + '/load/list';
        var promise = apiService.getData(url, params, true)
            .then(function (data) {
                $scope.loads = data.DataList;
            });
        return promise;
    };

    //init
    $scope.init = function () {
        $scope.getLoadList();
    };

    //add people to load
    $scope.addPeople = function ($event, dto) {
        //slots left to handle add people to load
        dto.SlotsLeft = $scope.getSlotsLeft(dto.MaxSlots, dto.Id); //TODO tole zdej ne dela
        $mdDialog.show({
            locals: {
                dataToPass: dto
            },
            controller: 'addSlotCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'app/components/load/addSlot.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false
        }).then(function () {
            $scope.getLoadList();
        }).catch(function () { });
    };

    //delete passenger from load
    $scope.showConfirm = function (passenger, productSlot, LoadNo) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Would you like to delete ' + passenger + '?')
            .textContent('You will delete ' + passenger + '-' + productSlot + '\n\rfrom Load ' + LoadNo)
            .ok('Delete')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function () {
            $scope.status = 'Deleted';
        }, function () {
            $mdDialog.hide();
        });
    };

    //confirm load
    $scope.confirmLoad = function ($event, dto) {
        var now = new Date();
        dto.scheduled = new Date(now.getTime() + 20 * 60000);
        $mdDialog.show({
            locals: {
                dataToPass: dto
            },
            controller: 'confirmLoadCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'app/components/load/confirmLoad.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false
        }).then(function () {
            $scope.getLoadList();
        }).catch(function () { });
    };

    //add/edit Load
    $scope.editLoad = function ($event, dto) {
        //init if null to pass the loads array for get max load number
        if (!dto) {
            dto = {};
        }
        dto.Loads = $scope.loads;
        $mdDialog.show({
            locals: {
                dataToPass: dto
            },
            controller: 'editLoadCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'app/components/load/editLoad.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false
        }).then(function () {
            $scope.getLoadList();
        }).catch(function () { });;
    };

    //check if passenger is already in load  
    function isInLoad(item) {
        try {
            var response = false;
            angular.forEach(item.GroupList, function (value, key) {
                angular.forEach(value.LoadList, function (value, key) {
                    if ($.inArray(value.IdCustomer, $scope.moved.IdCustomer) > -1) {
                        response = true;
                    }
                });
            });
            return response;
        } catch (err) { }
    };

    //before drop item we show confirmation dialog
    $scope.beforeDrop = function (event, ui, item) {
        var deferred = $q.defer();
        //we show confirm dialog only load number is changed
        if ($scope.loadMoveId != item.Id) {
            //object to be saved after confirmation
            $scope.moved.IdLoadFrom = $scope.loadMoveId;
            $scope.moved.IdLoadTo = item.Id;

            if (!isInLoad(item)) {
                deferred.resolve();
            } else {
                var confirm = $mdDialog.alert()
                    .title($rootScope.messages.warning)
                    .textContent($scope.PassengerMove + ' already In')
                    .ok('ok')
                $mdDialog.show(confirm).then(function () {
                    $mdDialog.hide();
                }, function () {
                    $mdDialog.hide();
                });
            }
        }
        return deferred.promise;
    };

    //when we start drag item to know what item
    $scope.startCallback = function (event, ui, item) {
        $scope.PassengerMove = [];
        $scope.moved.IdCustomer = [];
        angular.forEach(item.LoadList, function (value, key) {
            $scope.loadMove = value.Number;
            $scope.loadMoveId = value.Id;
            $scope.moved.IdCustomer.push(value.IdCustomer);
            $scope.PassengerMove.push(value.Passenger);
        });
    };

    //on drop item we must save in db
    $scope.dropCallback = function (event, ui) {
        var url = config.manifestApi + '/load/slot/move';
        apiService.postData(url, $scope.moved, true).then(function (data) {
            //init
            $scope.moved = {};
            $scope.moved.IdCustomer = [];
            //we must refresh load list
            $scope.getLoadList();
        });
    };

    $scope.selectCustomer = function (IdCustomer, scope, elem, attrs) {
        if ($scope.selectedIdCustomer == IdCustomer) {
            var slots = angular.element(document).find('.load .slot[data-idcustomer="' + IdCustomer + '"]');
            slots.removeClass('selected');
            $scope.selectedIdCustomer = -1;
        }
        else {
            var slots = angular.element(document).find('.load .slot.selected');
            slots.removeClass('selected');
            slots = angular.element(document).find('.load .slot[data-idcustomer="' + IdCustomer + '"]');
            slots.addClass('selected');
            $scope.selectedIdCustomer = IdCustomer;
        }
    }
});

app.controller('confirmLoadCtrl', function ($scope, $state, $filter, $mdDialog, $window, dataToPass, apiService, config) {
    var self = this;
    $scope.dto = dataToPass; //data from parent ctrl

    self.cancel = function ($event) {
        $mdDialog.cancel();
    };

    self.save = function ($event) {
        var url = config.manifestApi + '/load/confirm';
        apiService.postData(url, $scope.dto, true)
            .then(function () {
                $mdDialog.hide();
            });
    };
});

app.controller('editLoadCtrl', function ($scope, $state, $filter, $mdDialog, $window, dataToPass, apiService, config) {

    var self = this;
    $scope.warning = null;
    $scope.load = dataToPass;
    $scope.label = $scope.load == null ? 'Add new load' : 'Edit ' + $scope.load.Name;

    self.cancel = function ($event) {
        $mdDialog.cancel();
    };

    self.save = function ($event) {
        //before save we clean Loads array if not we have error TypeError: cyclic object value
        $scope.load.Loads = null;
        var url = config.manifestApi + '/load/save';
        apiService.postData(url, $scope.load, true)
            .then(function () {
                $mdDialog.hide();
            });

    };

    $scope.getAircrafts = function () {
        var url = config.manifestApi + '/settings/aircraft';
        var promise = apiService.getData(url, null, false)
            .then(function (data) {
                $scope.aircraftList = data.DataList;
            });
        return promise;
    };

    $scope.setAircraft = function (dto) {
        if (dto) {
            $scope.aircraftList = [{
                Id: dto.IdAircraft,
                Registration: dto.AircraftRegistration,
                Type: dto.AircraftType
            }];
            $scope.getLoadNumber(dto.IdAircraft);
        }
    };

    $scope.getLoadNumber = function (idAircraft) {
        var array = $scope.load.Loads;
        if (idAircraft) {
            var array = $filter('filter')(array, function (item) {
                return item.IdAircraft == idAircraft;
            });
        }
        //get max Load No for aircraft chosen
        var max = Math.max.apply(Math, array.map(function (o) {
            return o.Number;
        }));
        $scope.load.Number = max > 0 ? max + 1 : 1;
    };
});