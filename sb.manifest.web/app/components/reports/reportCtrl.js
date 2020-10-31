'use strict';

var app = angular.module('SbManifest');

app.controller('reportCtrl', function ($scope, $state, $window, apiService, config) {
    $scope.loads = 0;
    $scope.profit = 0;

    //get dashboard product list data
    function getProductList() {
        var params = {};
        var url = config.manifestApi + '/dashboard/product';
        apiService.getData(url, params, true)
            .then(function (data) {
                $scope.productList = data.DataList;
                //Loads
                var chart1 = getDoughnutChart($scope.productList, 'Product', 'BackgroundColor', 'Number', 'Jumps');
                var ctx1 = document.getElementById('loadsChart').getContext('2d');
                var chart1 = new Chart(ctx1, chart1);
                //Profit load
                var chart2 = getDoughnutChart($scope.productList, 'Product', 'BackgroundColor', 'Profit', 'Income');
                var ctx2 = document.getElementById('profitChart').getContext('2d');
                var chart2 = new Chart(ctx2, chart2);
                sum();
            });
    };

    function sum() {
        angular.forEach($scope.productList, function (value, key) {
            $scope.loads = $scope.loads + value.Number;
            $scope.profit = $scope.profit + value.Profit;
        });
    };

    // line chart

    var meseci = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var labels1 = [0, 10, 30, 130, 1300, 2345, 1800, 1950, 1500, 855, 0, 0];
    var labels2 = [0, 910, 930, 4130, 4300, 8345, 7800, 6950, 4500, 3955, 0, 0];
    //graf
    var obiskiLData = getLineChart(meseci, 'Jumps', labels1, 'Profit', labels2, 'Income/Jumps/Month');
    var ctxLObiski = document.getElementById('lineChart').getContext('2d');
    var chartL = new Chart(ctxLObiski, obiskiLData);

    $scope.init = function () {
        getProductList();
    };
});