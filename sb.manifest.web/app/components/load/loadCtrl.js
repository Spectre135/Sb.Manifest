'use strict';

var app = angular.module('SbManifest');

app.controller('loadCtrl', function ($scope, $state, $q, $filter, $mdDialog, $window, apiService, config) {

    $scope.loads;
    $scope.query = {
        order: '',
        limit: 5,
        page: 1
    };
    $scope.rows;
    $scope.moved = {}; //array when we move passengers between loads
    $scope.moved.IdCustomer = []; //array when we move passengers between loads

    //getLoadList
    $scope.getLoadList = function () {
        var params = {};
        var url = config.manifestApi + '/load/list';
        apiService.getData(url, params, true)
            .then(function (data) {
                $scope.loads = data.DataList;
            });
    };

    $scope.getSlotsLeft = function (seats, idLoad) {
        try {
            if ($scope.loads != undefined) {
                var array = $filter('filter')($scope.loads, function (item) {
                    return item.Id == idLoad;
                });
                angular.forEach(array, function (value, key) {
                    angular.forEach(value.GroupList, function (value, key) {
                        if (value) { //undefined values ignore - cause drag and drop when moving
                            seats = seats - value.LoadList.length;
                        }
                    });
                });
            }
            return seats;

        } catch (error) {
            return seats;
        }
    };

    $scope.getLoadProfit = function (idLoad) {

        try {
            var profit = 0;

            if ($scope.loads != undefined) {
                var array = $filter('filter')($scope.loads, function (item) {
                    return item.Id == idLoad;
                });
                angular.forEach(array, function (value, key) {
                    angular.forEach(value.GroupList, function (value, key) {
                        if (value) { //undefined values ignore - cause drag and drop when moving
                            angular.forEach(value.LoadList, function (value, key) {
                                profit = profit + value.Profit;
                            });
                        }
                    });
                });
            }

            return profit;

        } catch (error) {}
    };

    //init
    $scope.init = function () {
        $scope.getLoadList();
    };

    //add people to load
    $scope.addPeople = function ($event, dto) {
        //slots left to handle add people to load
        dto.SlotsLeft = $scope.getSlotsLeft(dto.MaxSlots, dto.Id);
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
        }).catch(function () {});
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
            $scope.getLoads();
        }).catch(function () {});
    };

    //add/edit Load
    $scope.editLoad = function ($event, dto) {
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
        }).catch(function () {});;
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
        } catch {}
    };

    //before drop item we show confirmation dialog
    $scope.beforeDrop = function (event, ui, item) {
        var deferred = $q.defer();
        //we show confirm dialog only load number is changed
        if ($scope.LoadMove != item.Number) {

            //object to be saved after confirmation
            $scope.moved.IdLoadFrom = $scope.LoadMoveId;
            $scope.moved.IdLoadTo = item.Id;

            if (!isInLoad(item)) {
                var confirm = $mdDialog.confirm()
                    .title('Would you like to move from Load ' + $scope.LoadMove + ' to ' + item.Number + ' ?')
                    .textContent('You will move ' + $scope.PassengerMove)
                    .ok('ok')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(function () {
                    deferred.resolve();
                }, function () {
                    $mdDialog.hide();
                });
            } else {
                var confirm = $mdDialog.alert()
                    .title('Already in load ' + item.Number + ' !')
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
            $scope.LoadMove = value.Number;
            $scope.LoadMoveId = value.Id;
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
        });
    };

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
        }
    };
});