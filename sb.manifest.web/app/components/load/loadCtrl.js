'use strict';

var app = angular.module('SbManifest');

app.controller('loadCtrl', function ($rootScope, $scope, $q, $filter, $mdUtil, $mdDialog, $mdSidenav, apiService, config) {

    $scope.loads;
    $scope.query = {
        order: '',
        limit: 5,
        page: 1
    };
    $scope.rows;
    $scope.moved = {}; //array when we move passengers between loads
    $scope.moved.IdPerson = []; //array when we move passengers between loads
    $scope.persons = [];
    $scope.dragToAdd = false; //to know if we must add person to load from side menu
    $scope.productList = [];
    $scope.selectedIdPerson;
    $scope.selectedGroup;

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
        $scope.getLoadList().then(function () {
            getProducts();
        });
    };

    function getProducts() {
        //we only read once
        if ($scope.productList.length == 0) {
            var url = config.manifestApi + '/settings/sales/product';
            apiService.getData(url, null, true)
                .then(function (data) {
                    $scope.productList = $filter('filter')(data.DataList, function (item) {
                        return item.IsFavorite == true;
                    });
                });
        }
    };

    //add people to load
    $scope.addPeople = function ($event, dto, idProduct) {
        dto.IdProductSelected = idProduct;
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
        }).catch(function () {});
    };

    //add/edit Load
    $scope.editLoad = function ($event, dto) {
        console.log($event);
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
        }).catch(function () {});;
    };

    //check if passenger is already in load  
    function isInLoad(item) {
        try {
            var response = false;
            angular.forEach(item.GroupList, function (value, key) {
                angular.forEach(value.LoadList, function (value, key) {
                    if ($.inArray(value.IdPerson, $scope.moved.IdPerson) > -1) {
                        response = true;
                    }
                });
            });
            return response;
        } catch (err) {}
    };

    //before drop item we show confirmation dialog
    $scope.beforeDrop = function (event, ui, item) {
        if ($scope.selectedIdPerson > -1) {
            var slots = angular.element('.load .slot.selected');
            slots.removeClass('selected');
            // $scope.selectedIdPerson = -1;
        }

        var deferred = $q.defer();

        // remove
        if (item == -1) {
            $scope.moved.IdLoadFrom = $scope.loadMoveId;
            $rootScope.confirmDialog('Confirm remove',
            'You will remove ' + $scope.PassengerMove + '\n\rfrom Load ' + $scope.loadMoveId,'Remove','Cancel')
            .then( function onSuccess(result) {
                return deferred.resolve();
            });
        }
        // move to
        else if ($scope.loadMoveId != item.Id) {
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
                    $scope.moved = {};
                    $scope.moved.IdPerson = [];
                    $mdDialog.hide();
                }, function () {
                    $mdDialog.hide();
                });
            }
        }

        var loadBin = angular.element('.load-bin.visible');
        loadBin.removeClass('visible');

        return deferred.promise;
    };

    //when we start drag item to know what item
    $scope.startCallback = function (event, ui, item) {
        if ($scope.selectedGroup >= 0) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        $scope.PassengerMove = [];
        $scope.moved.IdPerson = [];
        angular.forEach(item.LoadList, function (value, key) {
            $scope.loadMove = value.Number;
            $scope.loadMoveId = value.Id;
            $scope.moved.IdPerson.push(value.IdPerson);
            $scope.PassengerMove.push(value.Passenger);
        });

        var loadBin = angular.element('.load-bin[data-idload="' + $scope.loadMoveId + '"]');
        loadBin.addClass('visible');
    };

    //when we start drag item to Add into load
    $scope.startCallbackAdd = function (event, ui, item) {
        $scope.addPassengerList = [];
        $scope.passenger = {};
        $scope.dragToAdd = true;
        $scope.passenger.IdPerson = item.Id;
        $scope.passenger.IdProductSlot = 1; //TODO read from list 1-solo 4 for test
        $scope.moved.IdPerson.push(item.Id); //for check if person already in load
        $scope.PassengerMove = item.Name; //form warning modal
    };

    //on drop item we must save in db
    $scope.dropCallback = function (event, ui) {
        //check if we must add or move person
        if ($scope.dragToAdd) {
            $scope.passenger.IdLoad = $scope.moved.IdLoadTo;
            $scope.addPassengerList.push($scope.passenger);
            var url = config.manifestApi + '/load/slot/add';
            apiService.postData(url, $scope.addPassengerList, true)
                .then(function () {
                    $scope.moved = {};
                    $scope.moved.IdPerson = [];
                    $scope.dragToAdd=false;
                    $scope.getLoadList().then(reselectPerson);
                });
        } else {
            var url = config.manifestApi + '/load/slot/move';
            apiService.postData(url, $scope.moved, true)
                .then(function () {
                    //init
                    $scope.moved = {};
                    $scope.moved.IdPerson = [];
                    $scope.loadMoveId=0;
                    //we must refresh load list
                    $scope.getLoadList().then(reselectPerson);
                });
        }
    };

    function reselectPerson() {
        if ($scope.selectedIdPerson > -1) {
            setTimeout(function () {
                var slots = angular.element('.load .slot[data-idperson="' + $scope.selectedIdPerson + '"]');
                slots.addClass('selected');
            }, 500);
        }
    };

    $scope.openSideMenu = function () {
        var a = angular.element('#loads-main .loads');
        var clientWidth = a[0].clientWidth;

        getActiveToday();
        angular.element('#loads-main').addClass('open-helper');

        var newClientWidth = a[0].clientWidth;
        var delta = clientWidth - newClientWidth;
        a[0].scrollLeft += delta;
    };

    $scope.closeSideMenu = function () {
        angular.element('#loads-main').removeClass('open-helper');
    };

    function getActiveToday() {
        self.working = true;
        var url = config.manifestApi + '/load/active/today';
        var promise = apiService.getData(url, null, false)
            .then(function (data) {
                $scope.persons = noDuplicatesId($scope.persons.concat(data.DataList));
            }).finally(function () {
                self.working = false;
            });
        return promise;
    };

    function getPersonsList() {
        $scope.working = true;
        var url = config.manifestApi + '/load/active/';
        var params = {
            search: $scope.searchText,
            size: 20 //optional default 20
        };
        var promise = apiService.getData(url, params, false)
            .then(function (data) {
                $scope.persons = noDuplicates($scope.persons.concat(data.DataList));
            }).finally(function () {
                $scope.working = false;
            });
        return promise;
    };

    $scope.onKeySearch = function ($event) {
        $event.stopPropagation();
        var array = {};
        if ($scope.searchText) {
            array = $filter('filter')($scope.persons, {
                Name: $scope.searchText
            });
            if (array.length == 0) {
                getPersonsList();
            }
        }
    };

    $scope.selectPerson = function (IdPerson, scope, elem, attrs) {
        if ($scope.selectedIdPerson == IdPerson) {
            var slots = angular.element('.load .slot[data-idperson="' + IdPerson + '"], #loads-helper-slots .slot[data-idperson="' + IdPerson + '"]');
            slots.removeClass('selected');
            $scope.selectedIdPerson = -1;
        } else {
            var slots = angular.element('.load .slot.selected, #loads-helper-slots .slot.selected');
            slots.removeClass('selected');
            slots = angular.element('.load .slot[data-idperson="' + IdPerson + '"], #loads-helper-slots .slot[data-idperson="' + IdPerson + '"]');
            slots.addClass('selected');
            $scope.selectedIdPerson = IdPerson;
        }
    };

    $scope.selectGroup = function (group) {
        if ($scope.selectedGroup >= 0) {
            var g = angular.element('#loads-helper-groups .group.g' + $scope.selectedGroup);
            g.removeClass('selected');
        }
        if ($scope.selectedGroup == group) {
            $scope.selectedGroup = -1;

            angular.element('body').removeClass('select-group');
        }
        else {
            var g = angular.element('#loads-helper-groups .group.g' + group);
            g.addClass('selected');
            $scope.selectedGroup = group;

            angular.element('body').addClass('select-group');
        }
    }

    $scope.addGroup = function ($event) {
        if ($scope.selectedGroup >= 0) {
            var g = angular.element($event.currentTarget).find('.passenger .group-placeholder');
            var html = '<span class="group g' + $scope.selectedGroup + '">' + $scope.selectedGroup + '</span>';
            if ($scope.selectedGroup > 0 && g.html() != html) {
                g.html(html);
            }
            else {
                g.html('');
            }
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