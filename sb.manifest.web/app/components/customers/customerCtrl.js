'use strict';

var app = angular.module('SbManifest');

app.controller('customerCtrl', function ($scope, $state, $window, apiService, config) {

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

    //get Customers list
    $scope.getCustomerList = function () {
        $scope.myPage = 1;
        var url = config.manifestApi + '/customer/list';        
        var params = {    };

        apiService.getData(url, params, true)
            .then(function (data) {
                $scope.list = data.DataList;
                $scope.rows = data.RowsCount;
            });
    };

    //init
    $scope.init = function () {
        ///če še nimamo liste potem je to verjetno prvi obisk strani
        if (!$state.params.list) {
            $scope.getCustomerList();
        }
    };

});