'use strict';

var app = angular.module('SbManifest');

app.controller('mainCtrl', function ($rootScope, $scope, $state, config) {
    $scope.appName = config.appName;
    $rootScope.user = GetUser();

    //Logout/Login
    $rootScope.logout = function (response) {
        //pobrišemo sejo
        sessionStorage.removeItem('Authorization');
        //ponovno login 
        $state.go('prijava',{response: response});

    };
    
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
                window.localStorage.setItem('hop.hit.si.pinned',false);
                $('#pin-icon').addClass('fa-angle-double-left');
                $('#pin-icon').removeClass('fa-thumbtack');
                // unpin sidebar when hovered
                $('.page-wrapper').removeClass('pinned');
                $('.page-wrapper').removeClass('sidebar-hovered');
                $('#sidebar').unbind('mouseenter mouseleave');
            } else {
                window.localStorage.setItem('hop.hit.si.pinned',true);
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
            if (pinned=='true'){
                $('#pin-sidebar').click(); 
            }
        } catch (error) { }  

        //set side bar toggled if we have small display
        if($('#toggle-sidebar').is(":visible")){
            $('.page-wrapper').toggleClass('toggled');
        } 
        
        //hide menu bar when user click on link
        $('.menu-link').click(function () {
            $('.page-wrapper').removeClass('sidebar-hovered');
            //if we have sidebar for small display
            if($('#toggle-sidebar').is(":visible")){
                $('.page-wrapper').toggleClass('toggled');
            }           
        }); 

    });
});
