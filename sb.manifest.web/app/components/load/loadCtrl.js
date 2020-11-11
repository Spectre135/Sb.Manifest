'use strict';

var app = angular.module('SbManifest');

app.controller('loadCtrl', function ($rootScope, $scope, $q, $filter, $mdDialog, $interval, apiService, config) {

    $scope.loads;
    $scope.rows;
    $scope.moved = {}; //array when we move passengers between loads
    $scope.moved.IdPerson = []; //array when we move passengers between loads
    $scope.persons = [];
    $scope.personsInGroup = [];
    $scope.dragToAdd = false; //to know if we must add person to load from side menu
    $scope.productList = [];
    $scope.selectedIdPerson;
    $scope.selectedGroup;
    $scope.dataDrag = true; //data drag flag 
    $scope.groups = [];
    var visibleItems = []; //array of objects who are inview for drop disable 

    //getLoadList
    $scope.getLoadList = function () {
        var params = {};
        var url = config.manifestApi + '/load/list';
        var promise = apiService.getData(url, params, true)
            .then(function (data) {
                $scope.loads = data.DataList;
                //update minutes left for load depart
                updateMinutesLeft();
            });
        return promise;
    };

    //delete Load
    $scope.deleteLoad = function ($event, dto) {
        $rootScope.confirmDialog('Confirm delete', 'Would you like to delete load No. ' + dto.Number + ' ' + dto.AircraftName + ' ?', 'Delete', 'Cancel')
            .then(function onSuccess(result) {
                var url = config.manifestApi + '/load/delete';
                apiService.postData(url, dto, true).then(function () {
                    $scope.getLoadList();
                });
            });
    };
    //confirm Load
    $scope.confirmLoad = function ($event, dto) {
        $rootScope.confirmDialog('Confirm load', 'Would you like to confirm load No. ' + dto.Number + ' ' + dto.AircraftName + ' ?', 'Confirm', 'Cancel')
            .then(function onSuccess(result) {
                var url = config.manifestApi + '/load/confirm';
                apiService.postData(url, dto, true).then(function () {
                    $scope.getLoadList();
                });
            });
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

    //departure load
    $scope.departureLoad = function ($event, dto) {
        var prevLoad = $filter('filter')($scope.loads, function (item) {
            return item.IdAircraft == dto.IdAircraft && item.Number == (dto.Number - 1);
        })[0];
        $mdDialog.show({
            locals: {
                dataToPass: dto,
                prevLoad: prevLoad
            },
            controller: 'departureLoadCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'app/components/load/departureLoad.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false
        }).then(function () {
            $scope.getLoadList();
        }).catch(function () {});
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
        }).catch(function () {});;
    };

    //check if passenger is already in load  
    function isInLoad(load, idPerson) {
        try {
            var response = false;
            angular.forEach(load.GroupList, function (value, key) {
                angular.forEach(value.LoadList, function (value, key) {
                    if ($.inArray(value.IdPerson, idPerson) > -1) {
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
                    'You will remove ' + $scope.PassengerMove + '\n\rfrom Load ' + $scope.loadMove, 'Remove', 'Cancel')
                .then(function onSuccess(result) {
                    return deferred.resolve();
                });
        }
        // move to
        else if ($scope.loadMoveId != item.Id) {
            //object to be saved after confirmation
            $scope.moved.IdLoadFrom = $scope.loadMoveId;
            $scope.moved.IdLoadTo = item.Id;

            //check if person exist in load
            if (isInLoad(item, $scope.moved.IdPerson)) {
                $rootScope.confirmDialog($rootScope.messages.warning, $scope.PassengerMove + ' already In', 'ok')
                    .then(function () {
                        $scope.moved = {};
                        $scope.moved.IdPerson = [];
                        $mdDialog.hide();
                    }, function () {
                        $mdDialog.hide();
                    });
                //check if person in group        
            } else if (checkForOthersInGroup($scope.loadMoveId)) {
                //check if persons exists in load
                if (isInLoad(item, $scope.personsInGroup)) {
                    $rootScope.confirmDialog('Move',
                            'Whole group can not be moved, people already in load ' + item.Number + ' !\nMove only ' + $scope.PassengerMove + ' ?', 'yes', 'no')
                        .then(function (result) {
                            return deferred.resolve();
                        }).finally(function () {
                            return deferred.reject();
                        });
                } else {
                    $rootScope.confirmDialog('Move',
                            'What would you like to move ?', 'group', 'person')
                        .then(function (result) {
                            $scope.moved.IdPerson = $scope.personsInGroup;
                        }).finally(function () {
                            return deferred.resolve();
                        });
                }

            } else {
                deferred.resolve();
            }
        }
        return deferred.promise;
    };

    //when we start drag item to know what item
    $scope.startCallback = function (event, ui, item, idLoad) {
        $scope.PassengerMove = [];
        $scope.moved.IdPerson = [];
        angular.forEach(item.LoadList, function (value, key) {
            $scope.loadMove = idLoad;
            $scope.loadMoveId = value.Id;
            $scope.IdPersonalGroup = item.IdPersonalGroup;
            $scope.moved.IdPerson.push(value.IdPerson);
            $scope.PassengerMove.push(value.Passenger);
        });

        var loadBin = angular.element('.load-bin[data-idload="' + $scope.loadMoveId + '"]');
        loadBin.addClass('visible');
    };

    $scope.stopCallback = function (event, ui, ) {
        var loadBin = angular.element('.load-bin.visible');
        loadBin.removeClass('visible');
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
                    $scope.dragToAdd = false;
                    $scope.getLoadList().then(reselectPerson);
                });
        } else {
            var url = config.manifestApi + '/load/slot/move';
            apiService.postData(url, $scope.moved, true)
                .then(function () {
                    //init
                    $scope.moved = {};
                    $scope.moved.IdPerson = [];
                    $scope.loadMoveId = 0;
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
        var delta = clientWidth - newClientWidth - 46; // 46 je širina zaprtega panela
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
                $scope.persons = data.DataList;
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
            $scope.dataDrag = true;
            angular.element('body').removeClass('group-mode-on');
            //Save selected group to database
            SaveSkydiversGroup($scope.groups);
        } else {
            var g = angular.element('#loads-helper-groups .group.g' + group);
            g.addClass('selected');
            $scope.selectedGroup = group;
            $scope.dataDrag = false;
            angular.element('body').addClass('group-mode-on');
        }
    };

    $scope.addGroup = function ($event, personModel, idLoad) {
        //groups are saved to database after unselect group

        if ($scope.selectedGroup >= 0) {
            const idGroup = (personModel.IdPersonalGroup == $scope.selectedGroup) ? 0 : $scope.selectedGroup //če je že izbran damo 0 

            // poiščemo zapis v groups
            let index = $scope.groups.findIndex(g =>
                g.IdPerson == personModel.IdPerson &&
                g.IdLoad == idLoad);

            // če zapisa še ni, ga ustvarimo
            if (index == -1) {
                $scope.groups.push({
                    IdPerson: personModel.IdPerson,
                    IdLoad: idLoad
                });
                index = $scope.groups.length - 1;
            }

            const g = angular.element($event.currentTarget).find('.passenger .group-placeholder');
            //če je idGroup drugačen, označimo, sicer odznačimo
            if ($scope.selectedGroup > 0 && personModel.IdPersonalGroup != $scope.selectedGroup) {
                $scope.groups[index].IdGroup = idGroup;
                g.html('<span class="group g' + $scope.selectedGroup + '">' + $scope.selectedGroup + '</span>');
            } else {
                $scope.groups[index].IdGroup = 0;
                g.html('');
            }

            // nastavimo grupo v person modelu
            personModel.IdPersonalGroup = idGroup;
        }
    };

    $scope.getGroupClass = function (group) {
        return 'group g' + group;
    };

    //api to save selected group to database
    function SaveSkydiversGroup(dto) {
        var url = config.manifestApi + '/skydivers/group/save';
        apiService.postData(url, dto, false).then(function (data) {
            $scope.groups = [];
            $scope.getLoadList();
        });
    };

    $scope.refuel = function ($event, dto, refuel) {
        var el = angular.element($event.currentTarget);
        var parent = el.parent().parent();
        parent.toggleClass('refuel');
        //save refuel to database
        dto.Refuel = refuel;
        apiService.postData(config.manifestApi + '/load/save', dto, false);
    };

    $scope.setInview = function (index, inview) {
        var item = {};
        item.Index = index;
        item.Visible = inview;
        var i = visibleItems.findIndex(function (items) {
            return items.Index === index;
        });
        if (i >= 0) {
            visibleItems.splice(i, 1);
        }
        visibleItems.push(item);
    };

    $scope.canDrop = function (index) {
        try {
            return $filter('filter')(visibleItems, function (item) {
                return item.Index == index;
            })[0].Visible;
        } catch (err) {
            return false;
        }
    };

    $scope.hasFundsOrTickets = function (p) {
        try {
            return (p.AvailableFunds > 0 || p.AvailableTickets > 0)
        } catch (err) {}
    };

    function checkForOthersInGroup(idLoad) {
        $scope.personsInGroup = [];
        var response = false;

        if (!$scope.dragToAdd) {
            //find groups of load from
            var loads = $filter('filter')($scope.loads, function (l) {
                return l.Id == idLoad;
            })[0].GroupList;

            //return all persons with same IdPersonalGroup
            if ($scope.IdPersonalGroup) {
                var groups = $filter('filter')(loads, function (g) {
                    return g.IdPersonalGroup == $scope.IdPersonalGroup;
                });
            }

            //add to array all persons id for later save to DB
            angular.forEach(groups, function (value, key) {
                angular.forEach(value.LoadList, function (value, key) {
                    $scope.personsInGroup.push(value.IdPerson);
                    response = true;
                });
            });

            //if only selected person then we don't need to move group
            if (response && $scope.personsInGroup.length == 1) {
                response = false;
            }

        }

        return response;
    };

    function updateMinutesLeft() {
        try {
            angular.forEach($scope.loads, function (value, key) {
                if (value.DateDeparted) {
                    //if we have value from alertLoads read from this
                    // to have minutes left equals
                    try{
                        var _DepartureMinutesLeft = $filter('filter')($rootScope.alertLoads, function (item) {
                        return item.Id == value.Id;
                        })[0].DepartureMinutesLeft;
                    }catch(err){}
                    
                    if (_DepartureMinutesLeft) {
                        value.DepartureMinutesLeft = _DepartureMinutesLeft
                    } else {
                        value.DepartureMinutesLeft = $rootScope.getTimeDiffInMInutes(value.DateDeparted);
                    }
                }
            });
        } catch (err) {}
    };

    //update minutes left for depart load every 15 sec
    $interval(updateMinutesLeft, 15 * 1000);

});

app.controller('departureLoadCtrl', function ($rootScope, $scope, $mdDialog, dataToPass, prevLoad, apiService, config) {
    var self = this;
    $scope.dto = angular.copy(dataToPass); //data from parent ctrl
    $scope.prevLoad = prevLoad;
    $scope.minTime = getDateStrHHmm($rootScope.getDate());

    function getMinTime() {
        if ($scope.prevLoad) {
            if ($scope.prevLoad.DateDeparted) {
                var d = new Date($scope.prevLoad.DateDeparted);
                //add rotation time
                d.setMinutes(d.getMinutes() + $scope.prevLoad.RotationTime);
                $scope.minTime = getDateStrHHmm(d);
                return $scope.minTime;
            } else {
                $scope.minTime = getDateStrHHmm($rootScope.getDate());
                return $scope.minTime;
            }
        } else {
            return getDateStrHHmm(new Date($scope.dto.DateDeparted));
        }
    };

    $scope.dto.DateDeparted = getMinTime();

    self.cancel = function ($event) {
        $mdDialog.cancel();
    };

    self.save = function ($event) {
        var dto = angular.copy($scope.dto);
        dto.DateDeparted = addHHmmToDate($rootScope.getDate(),$scope.dto.DateDeparted);
        var url = config.manifestApi + '/load/depart/save';
        apiService.postData(url, dto, true)
            .then(function () {
                $mdDialog.hide();
            });
    };
});

app.controller('editLoadCtrl', function ($scope, $filter, $mdDialog, dataToPass, apiService, config) {

    var self = this;
    $scope.warning = null;
    $scope.load = dataToPass;
    $scope.label = $scope.load == null ? 'Add new load' : $scope.load.AircraftName + ' ' + $scope.load.Number;

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