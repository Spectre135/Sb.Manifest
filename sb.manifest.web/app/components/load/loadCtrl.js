'use strict';

var app = angular.module('SbManifest');

app.controller('loadCtrl', function ($scope, $state, $filter, $mdDialog, $window, apiService, config) {

    $scope.data = $state.params.data;
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
    $scope.loads = [{
            'Number': 1,
            'Id': 1,
            'Name': '',
            'Altitude': '4000m',
            'Aircraft': 'PC6',
            'Registration': 'S5-CMD',
            'Seats': 10,
            'Confirmed': true
        },
        {
            'Number': 3,
            'Id': 3,
            'Name': '',
            'Altitude': '4000m',
            'Aircraft': 'PC6',
            'Registration': 'F-HSBF',
            'Seats': 10,
            'Confirmed': false
        },
        {
            'Number': 2,
            'Id': 2,
            'Name': 'Lalala',
            'Altitude': '6000m',
            'Aircraft': 'Cessna Caravan',
            'Registration': 'D-ECFD',
            'Seats': 15,
            'Confirmed': true
        },
        {
            'Number': 4,
            'Id': 4,
            'Aircraft': 'PC6',
            'Registration': 'F-HSBF',
            'Seats': 10,
            'Confirmed': false
        },
        {
            'Number': 5,
            'Id': 5,
            'Aircraft': 'PC6',
            'Registration': 'F-HSBF',
            'Seats': 10,
            'Confirmed': false
        },
        {
            'Number': 6,
            'Id': 6,
            'Aircraft': 'PC6',
            'Registration': 'F-HSBF',
            'Seats': 10,
            'Confirmed': false
        }
    ]

    //getLoadList
    $scope.getLoadList = function () {
        $scope.myPage = 1;

        var params = {};
        var url = config.manifestApi + '/load/list';
        apiService.getData(url, params, true)
            .then(function (data) {
                $scope.list = data.DataList;
                $scope.rows = data.RowsCount;
            });

    };

    $scope.getSlotsLeft = function (seats, idLoad) {

        try {
            if ($scope.list != undefined) {
                var array = $filter('filter')($scope.list, function(item){return item.Id==idLoad;});
                return seats - array.length;
            }

            return seats;
        } catch (error) {
            return seats;
        }
    };

    $scope.getLoadProfit = function (idLoad) {

        try {
            var profit = 0;

            if ($scope.list != undefined) {
                var array = $filter('filter')($scope.list, function(item){return item.Id==idLoad;});
                angular.forEach(array, function (value, key) {
                    profit = profit + value.Profit;
                });
            }

            return profit;

        } catch (error) {}
    };

    //init
    $scope.init = function () {
        ///če še nimamo liste potem je to verjetno prvi obisk strani
        if (!$state.params.list) {
            $scope.getLoadList();
        }
    };

    //add people to load
    $scope.addPeople = function ($event, dto) {
        //slots left to handle add people to load
        dto.SlotsLeft = $scope.getSlotsLeft(dto.Seats, dto.Number);
        $mdDialog.show({
            locals: {
                dataToPass: dto
            },
            controller: 'addSlotCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'app/components/load/addSlot.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            onRemoving: function (event, removePromise) {
                $scope.getLoadList();
            }
        });
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
            clickOutsideToClose: false,
            onRemoving: function (event, removePromise) {
                $scope.getLoadList();
            }
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