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

    function BodyOnKeyDown(e) {

        // D, F, plus, minus, 4, 5, 6
        if ([68, 70, 52, 100, 53, 101, 54, 102, 107, 109, 187, 189].includes(e.which)) {

            const html = angular.element('html')[0];
            let fontSize = new Number(html.style.fontSize.replace('%', ''));
            // F = toggle fullscreen  
            if (e.which == 70) {
                if (!document.fullscreenElement)
                    document.documentElement.requestFullscreen();
                else if (document.exitFullscreen)
                    document.exitFullscreen();
            }
            // D = default
            else if (e.which == 68)
                fontSize = 6.25;
            // plus, numpad plus
            else if ([107, 187].includes(e.which))
                fontSize += .1;
            // minus, numpad minus
            else if ([109, 189].includes(e.which))
                fontSize -= .1;

            else if ([52, 100, 53, 101, 54, 102].includes(e.which)) {
                let cols = 0;
                // 4, numpad 4 (4 columns)
                if ([52, 100].includes(e.which))
                    cols = 4;
                // 5, numpad 5 (5 columns)
                else if ([53, 101].includes(e.which))
                    cols = 5;
                // 6, numpad 6 (6 columns)
                else if ([54, 102].includes(e.which))
                    cols = 6;

                fontSize = 6.25 * document.body.clientWidth / ((cols * 280) + 8);

                // // 4, numpad 4 (4 columns on 1920px wide screen)
                // if ([52, 100].includes(e.which))
                //     fontSize = 10.65;
                // // 5, numpad 5 (5 columns on 1920px wide screen)
                // else if ([53, 101].includes(e.which))
                //     fontSize = 8.55;
                // // 6, numpad 6 (6 columns on 1920px wide screen)
                // else if ([54, 102].includes(e.which))
                //     fontSize = 7.15;
            }

            html.style.fontSize = fontSize + '%';

            //TODO fontSize bi se lahko pisal v bazo
        }
    };

    $scope.init = function () {
        getLoadList();

        document.body.onkeydown = function (e) { BodyOnKeyDown(e); };
    };
});
