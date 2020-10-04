'use strict';

var app = angular.module('SbManifest');

app.controller('paymentsCtrl', function ($scope, $state, apiService, config) {

    $scope.data;
    $scope.list;
    $scope.query = {
        order: '',
        limit: 5,
        page: 1,
        filter:''
    };
    $scope.rows = $state.params.rows;

    //get Post list
    $scope.getPaymentsList = function () {
        var url = config.manifestApi + '/post/list';
        var params = {
            search: '',
            pageIndex: $scope.query.page,
            pageSizeSelected: $scope.query.limit,
            sortKey:$scope.query.order
        };

        $scope.promise = apiService.getData(url, params, true)
            .then(function (data) {
                $scope.list = data.DataList;
                $scope.rows = data.RowsCount;
            });

    };

    //init
    $scope.init = function () {
        ///če še nimamo liste potem je to verjetno prvi obisk strani
        if (!$state.params.list) {
            $scope.getPaymentsList();
        }
    };

});