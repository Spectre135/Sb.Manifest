'use strict';

var app = angular.module('SbManifest');

app.controller('displayCtrl', function ($scope, $interval, config, apiService) {
    $scope.loads;
    $scope.connected = false;
    $scope.showLoadList = true;
    $scope.showPic = false;
    $scope.pic = 'pictures/1.jpg';
    const displayTime = 60 * 1000; //60 sec za load listo
    const picTime = 5 * 1000; //5 sec za reklame 
    let refresh = displayTime;

    //call swap after 10sec 
    setTimeout(swap, refresh);

    //Interval to call function to display loadlist  or pictures
    function swap() {
        $scope.$apply(function () {
            $scope.showPic = !$scope.showPic;
            $scope.showLoadList = !$scope.showLoadList;
        });
        if ($scope.showPic) {
            refresh = picTime;
            setTimeout(swap, refresh);
        } else {
            refresh = displayTime;
            setTimeout(swap, refresh);
        }
    };

    //getLoadList after init
    function getLoadList() {
        var params = {};
        var url = config.manifestApi + '/load/list';
        var promise = apiService.getData(url, params, true)
            .then(function (data) {
                $scope.loads = data.DataList;
            });
        return promise;
    };

    //init SignalR Connection for display load list
    var connection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Debug)
        .withUrl(config.displayHub, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
            accessTokenFactory: () => {
                return sessionStorage.getItem('Authorization') //Auth token we need fo success connect to signalr hub
            }
        }).build();

    //Start connection
    connection.start().then(function () {
        $scope.connected = true;
    }).catch(function (err) {
        console.log(err);
    });

    //Listen for incoming  messages and refresh load data
    connection.on('messageReceived', function (data) {
        $scope.$apply(function () {
            $scope.loads = data.DataList;
        });
    });

    $scope.getGroupClass = function (group) {
        return 'group g' + (group || 0);
    };

    $scope.init = function () {
        getLoadList();
    };
});
