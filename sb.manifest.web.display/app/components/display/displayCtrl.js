'use strict';

var app = angular.module('SbManifest');

app.controller('displayCtrl', function ($rootScope, $scope, $interval, config, apiService) {
    $scope.loads;
    $scope.connected = false;
    $scope.showLoadList = true;
    $scope.showPic = false;
    //$scope.pic = 'pictures/1.jpg';
    const displayTime = 60 * 1000; //60 sec za load listo
    //const picTime = 5 * 1000; //5 sec za reklame 
    var i = -1;

    //load advertising json daata
    function loadAdvertisingData() {
        apiService.getData('config/advertising.json', null, false)
            .then(function (data) {
                $scope.advertising = data;
            });
    };

    loadAdvertisingData();

    //call swap after displayTime 
    setTimeout(swap, displayTime);

    //Interval to call function to display loadlist  or pictures
    function swap() {
        $scope.$apply(function () {
            $scope.showPic = !$scope.showPic;
            $scope.showLoadList = !$scope.showLoadList;
            if ($scope.showPic) {
                if ($scope.advertising) {
                    i++;
                    if ($scope.advertising.length == i) {
                        i = 0;
                    }
                    $scope.pic = $scope.advertising[i].Src;
                    var time = $scope.advertising[i].Time;
                    setTimeout(swap, time);
                }
            } else {
                setTimeout(swap, displayTime);
            }
        });
    };

    //getLoadList after init
    function getLoadList() {
        var params = {};
        var url = config.manifestApi + '/load/list';
        var promise = apiService.getData(url, params, true)
            .then(function (data) {
                $scope.loads = data.DataList;
                updateTimeLeft();
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
            updateTimeLeft();
        });
    });

    $scope.getGroupClass = function (group) {
        return 'group g' + (group || 0);
    };

    $scope.toggleHelp = function () {
        const help = angular.element('#help');
        help.toggleClass('open');
    }

    function fadeHelp() {
        const helpBtn = angular.element('#help-btn')[0];
        let opacity = new Number(helpBtn.style.opacity);
        if (opacity > 0) {
            opacity = Math.max(opacity - .01, 0);
            helpBtn.style.opacity = opacity;

            if (opacity == 0)
                helpBtn.style.display = 'none';

            setTimeout(fadeHelp, 100);
        }
    }

    function BodyOnKeyDown(e) {

        // D, F, H, plus, minus, 4, 5, 6
        if ([68, 70, 72, 52, 100, 53, 101, 54, 102, 107, 109, 187, 189].includes(e.which)) {

            const html = angular.element('html')[0];
            let fontSize = new Number(html.style.fontSize.replace('%', ''));
            // D = default
            if (e.which == 68)
                fontSize = 6.25;
            // F = toggle fullscreen  
            else if (e.which == 70) {
                if (!document.fullscreenElement)
                    document.documentElement.requestFullscreen();
                else if (document.exitFullscreen)
                    document.exitFullscreen();
            }
            // H = toggle help  
            else if (e.which == 72) {
                const help = angular.element('#help');
                help.toggleClass('open');
            }
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
            }

            html.style.fontSize = fontSize + '%';
        }
    };

    $scope.init = function () {
        getLoadList();

        document.body.onkeydown = function (e) {
            BodyOnKeyDown(e);
        };
        // send D: default
        BodyOnKeyDown({
            which: 68
        });

        // po 10 sekundah se gumb help skrije
        setTimeout(fadeHelp, 10 * 1000);
    };

    function updateTimeLeft() {
        try {
            angular.forEach($scope.loads, function (value, key) {
                if (!isNaN(value.DepartureSecondsLeft))
                    value.DepartureMinutesLeft = Math.floor(--value.DepartureSecondsLeft / 60);
                else
                    value.DepartureMinutesLeft = '???';
            });
        } catch (err) { }
    };

    //update time left for load depart every second
    $interval(updateTimeLeft, 1000);
});
