'use strict';

var app = angular.module('SbManifest');

app.controller('skydiverCtrl', function ($scope, $state, $window, apiService, config) {

    $scope.fromDate = $state.params.from;
    $scope.toDate = $state.params.to;
    $scope.monthFormat = buildLocaleProvider("MMM YYYY");
    $scope.minDateTo = new Date(2019, 12, 31);
    $scope.minDateFrom = new Date(2019, 12, 31);
    $scope.alertFromDate = false;
    $scope.alertToDate = false;
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

    //get Payroll
    $scope.getPayroll = function (p) {
        var url = config.hrDocApi + '/api/payroll/';
        apiService.postData(url, p, true)
            .then(function (data) {
                $state.go('payroll', {
                    from: $scope.fromDate,
                    to: $scope.toDate,
                    data: data,
                    list: $scope.list,
                    rows: $scope.rows,
                    page: $scope.myPage,
                    limit: $scope.myLimit,
                    order: $scope.myOrder
                });
                $('html, body').animate({
                    scrollTop: 0
                }, 'fast');
            });
    };

    //getSkydiverList
    $scope.getSkydiverList = function () {
        $scope.myPage = 1;
        var fd = new Date($scope.fromDate);
        var td = new Date($scope.toDate);

        //if we have toDate < fromDate then swap
        if ($scope.fromDate > $scope.toDate) {
            var fd = new Date($scope.toDate);
            var td = new Date($scope.fromDate);
        }

        var url = config.manifestApi + '/skydiver/list';
        /*
        var params = {
            'aFromDate': fd.setMonth(fd.getMonth()), //only to init date if false then NaN
            'bToDate': td.setMonth(td.getMonth() + 1) //to use month selected too if false then NaN
        };
        */

        apiService.getData(url, null, true)
            .then(function (data) {
                $scope.list = data.DataList;
                $scope.rows = data.RowsCount;
            });

    };

    //show list
    $scope.showList = function () {
        $state.go('payrollist', {
            from: $scope.fromDate,
            to: $scope.toDate,
            list: $scope.list,
            rows: $scope.rows,
            page: $scope.myPage,
            limit: $scope.myLimit,
            order: $scope.myOrder
        });
    };

    $scope.dateChanged = function () {
        //check dates if are OK
        $scope.alertFromDate = false;
        $scope.alertToDate = false;

        if ($scope.fromDate == undefined) {
            $scope.alertFromDate = true;
        }
        if ($scope.toDate == undefined) {
            $scope.alertToDate = true;
        }

        if ($scope.fromDate && $scope.toDate) {
            $scope.getPayrollList();
        }
    };

    $scope.getPayrollCss = function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return 'payrollMobileCss';
        } else {
            return 'payroll';
        }
    };
    //init
    $scope.init = function () {
        ///če še nimamo liste potem je to verjetno prvi obisk strani
        if (!$state.params.list) {
            $scope.getSkydiverList();
        }
    };

    //back na browserju
    window.addEventListener('popstate', function (event) {
        if ($state.current.name == 'payrollist') {
            window.history.pushState(null, '', window.location.href);
            $scope.showList();
        }
    }, false);

});