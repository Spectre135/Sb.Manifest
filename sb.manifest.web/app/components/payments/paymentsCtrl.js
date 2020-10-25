'use strict';

var app = angular.module('SbManifest');

app.controller('paymentsCtrl', function ($scope, $state, apiService, config) {

    $scope.list;
    $scope.query = {
        order: '',
        limit: 5,
        page: 1,
        filter: ''
    };
    $scope.rows;

    //get Post list
    $scope.getPaymentsList = function () {
        var url = config.manifestApi + '/post/list';
        $scope.query.asc = !$scope.query.asc;
        var params = {
            search: $scope.search,
            pageIndex: $scope.query.page,
            pageSizeSelected: $scope.query.limit,
            sortKey: $scope.query.order,
            asc: $scope.query.asc
        };

        $scope.promise = apiService.getData(url, params, true)
            .then(function (data) {
                $scope.list = data.DataList;
                $scope.rows = data.RowsCount;
            });
    };

    //submit search button on Enter key
    $scope.onKeyPressSearch = function ($event) {
        if ($event.charCode === 13) { //if enter then hit the search button
            $scope.getPaymentsList();
        }
    }

    //init
    $scope.init = function () {
        $scope.getPaymentsList();
    };

});