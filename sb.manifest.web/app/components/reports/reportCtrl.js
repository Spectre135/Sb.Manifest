'use strict';

var app = angular.module('SbManifest');

app.controller('reportCtrl', function ($scope, $state, $window, apiService, config) {
    $scope.loads=9133;
    $scope.profit=48455;
    $scope.data1 = [{
        'Colors': '#FF6F61',
        'Category': 'Tandem',
        'Numbers': 17,
        'Profit': 1455,
    },
    {
        'Colors': '#F7CAC9',
        'Category': 'Tandem&Video',
        'Numbers': 6,
        'Profit': 2300
    },
    {
        'Colors': '#009B77',
        'Category': 'Solo 1500',
        'Numbers': 3,
        'Profit': 333
    },
    {
        'Colors': '#6B5B95',
        'Category': 'Solo 4000',
        'Numbers': 59,
        'Profit': 1844
    },
    {
        'Colors': '#88B04B',
        'Category': 'Aff',
        'Numbers': 14,
        'Profit': 1200
    }];
    var data2 = [{
        'Colors': '#FF6F61',
        'Category': 'Tandem',
        'Profit': 1455
    },
    {
        'Colors': '#F7CAC9',
        'Category': 'Tandem&Video',
        'Profit': 2300
    },
    {
        'Colors': '#009B77',
        'Category': 'Solo 1500',
        'Profit': 333
    },
    {
        'Colors': '#6B5B95',
        'Category': 'Solo 4004',
        'Profit': 1844
    },
    {
        'Colors': '#88B04B',
        'Category': 'Aff',
        'Profit': 1200
    }];
    //Loads
    var chart1 = getDoughnutChart($scope.data1, 'Category', 'Colors', 'Numbers', 'Jumps');
    var ctx1 = document.getElementById('loadsChart').getContext('2d');
    var chart1 = new Chart(ctx1, chart1);
    //Profit load
    var chart2 = getDoughnutChart(data2, 'Category', 'Colors', 'Profit', 'Income');
    var ctx2 = document.getElementById('profitChart').getContext('2d');
    var chart2 = new Chart(ctx2, chart2);

    //line chart

    var meseci  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var labels1 = [0,10,30,130,1300,2345,1800,1950,1500,855,0,0];
    var labels2 = [0,910,930,4130,4300,8345,7800,6950,4500,3955,0,0];
    //graf
    var obiskiLData = getLineChart(meseci, 'Jumps', labels1, 'Profit', labels2, 'Income/Jumps/Month');
    var ctxLObiski = document.getElementById('lineChart').getContext('2d');
    var chartL = new Chart(ctxLObiski, obiskiLData);
});