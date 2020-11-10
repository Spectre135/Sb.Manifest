'use strict';

var app = angular.module('SbManifest');

app.controller('mainCtrl', function ($rootScope, $scope, $state, config) {
    $scope.appName = config.appName;
    $rootScope.user = GetUser();
    $rootScope.alertLoads;
    $rootScope.connected = false;

    $rootScope.loadAlertsDismissed = [];

    //Logout/Login
    $rootScope.logout = function (response) {
        //pobrišemo sejo
        sessionStorage.removeItem('Authorization');
        //ponovno login 
        $state.go('prijava', {
            response: response
        });

    };

    //init SignalR Connection for alert loads
    var connection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Debug)
        .withAutomaticReconnect()
        .withUrl(config.alertHub, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
            accessTokenFactory: () => {
                return sessionStorage.getItem('Authorization') //Auth token we need for success connect to signalr hub
            }
        }).build();

    //Start connection
    connection.start().then(function () {
        $scope.$apply(function () {
            $rootScope.connected = true;
        });
    }).catch(function (err) {
        $scope.$apply(function () {
            $rootScope.connected = false;
        });
        console.log(err);
    });

    //check connection status
    connection.onreconnecting(error => {
        if (connection.state === signalR.HubConnectionState.Reconnecting) {
            $scope.$apply(function () {
                $rootScope.connected = false;
            });
        }
    });

    connection.onreconnected(connectionId => {
        if (connection.state === signalR.HubConnectionState.Connected) {
            $scope.$apply(function () {
                $rootScope.connected = true;
            });
        }
    });

    //Listen for incoming  messages and alert loads<=15min
    connection.on('messageReceived', function (data) {
        $scope.$apply(function () {
            $rootScope.alertLoads = data.DataList;
            try {
                angular.forEach($rootScope.alertLoads, function (value, key) {
                    if (value.DateDeparted) {
                        value.MinutesLeft = getTimeDiffInMInutes(value.DateDeparted);
                    }
                });
            } catch (err) { }
            filterAlertLoads();
        });
    });

    $rootScope.dismissAlert = function (load) {
        const index = $rootScope.loadAlertsDismissed.findIndex(l => l.Id == load.Id);
        // če ga še ni v listi ga vpišemo
        if (index == -1)
            $rootScope.loadAlertsDismissed.push({
                Id: load.Id,
                DismissedSecondAlarm: secondAlarm(load)
            });
        // če je že v listi nastavimo DismissedSecondAlarm
        else
            $rootScope.loadAlertsDismissed[index].DismissedSecondAlarm = secondAlarm(load);

        filterAlertLoads();
    };

    function filterAlertLoads() {
        // pogažemo samo tiste, ki še niso v listi loadAlertsDismissed z enakimi podatki (Id, DismissedSecondAlarm)
        $rootScope.alertLoads = $rootScope.alertLoads.filter(f =>
            $rootScope.loadAlertsDismissed.findIndex(l => l.Id == f.Id && l.DismissedSecondAlarm == secondAlarm(f)) == -1);
    }

    function secondAlarm(load) {
        return load.MinutesLeft <= 5;
    }

    //mora bit noter če en ne dela menu
    jQuery(function ($) {

        // Dropdown menu
        $('.sidebar-dropdown > a').click(function () {
            $('.sidebar-submenu').slideUp(200);
            if ($(this).parent().hasClass('active')) {
                $('.sidebar-dropdown').removeClass('active');
                $(this).parent().removeClass('active');
            } else {
                $('.sidebar-dropdown').removeClass('active');
                $(this).next('.sidebar-submenu').slideDown(200);
                $(this).parent().addClass('active');
            }

        });

        //toggle sidebar avtomatsko
        $(window).on('resize', function () {
            if ($(window).width() >= 768) {
                $('.page-wrapper').addClass('toggled');
            } else {
                $('.page-wrapper').removeClass('toggled');
            }
        })

        //toggle sidebar ročno
        $('#toggle-sidebar').click(function () {
            $('.page-wrapper').toggleClass('toggled');
        });

        //Pin sidebar
        $('#pin-sidebar').click(function () {
            if ($('.page-wrapper').hasClass('pinned')) {
                window.localStorage.setItem('hop.hit.si.pinned', false);
                $('#pin-icon').addClass('fa-angle-double-left');
                $('#pin-icon').removeClass('fa-thumbtack');
                // unpin sidebar when hovered
                $('.page-wrapper').removeClass('pinned');
                $('.page-wrapper').removeClass('sidebar-hovered');
                $('#sidebar').unbind('mouseenter mouseleave');
            } else {
                window.localStorage.setItem('hop.hit.si.pinned', true);
                $('.page-wrapper').addClass('pinned');

                $('#pin-icon').removeClass('fa-angle-double-left');
                $('#pin-icon').addClass('fa-thumbtack');

                $('#sidebar').hover(
                    function () {
                        $('.page-wrapper').addClass('sidebar-hovered');
                    },
                    function () {
                        $('.page-wrapper').removeClass('sidebar-hovered');
                    }
                )

            }
        });


        //toggle sidebar overlay
        $('#overlay').click(function () {
            $('.page-wrapper').toggleClass('toggled');
        });

        // toggle background image
        $('#toggle-bg').change(function (e) {
            e.preventDefault();
            $('.page-wrapper').toggleClass('sidebar-bg');
        });

        // toggle border radius
        $('#toggle-border-radius').change(function (e) {
            e.preventDefault();
            $('.page-wrapper').toggleClass('boder-radius-on');
        });

        //custom scroll bar is only used on desktop
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $('.sidebar-content').mCustomScrollbar({
                axis: 'y',
                autoHideScrollbar: true,
                scrollInertia: 300
            });
            $('.sidebar-content').addClass('desktop');
        }

        //set side bar pinned off  or what is saved in localstorage
        try {
            var pinned = false;
            pinned = window.localStorage.getItem('hop.hit.si.pinned');
            if (pinned == 'true') {
                $('#pin-sidebar').click();
            }
        } catch (error) { }

        //set side bar toggled if we have small display
        if ($('#toggle-sidebar').is(":visible")) {
            $('.page-wrapper').toggleClass('toggled');
        }

        //hide menu bar when user click on link
        $('.menu-link').click(function () {
            $('.page-wrapper').removeClass('sidebar-hovered');
            //if we have sidebar for small display
            if ($('#toggle-sidebar').is(":visible")) {
                $('.page-wrapper').toggleClass('toggled');
            }
        });

    });
});
