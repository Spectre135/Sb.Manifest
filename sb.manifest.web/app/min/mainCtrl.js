"use strict";var app=angular.module("SbManifest");app.controller("mainCtrl",(function($rootScope,$scope,$state,config){$scope.appName=config.appName,$rootScope.user=GetUser(),$rootScope.alertLoads,$rootScope.connected=!1,$rootScope.logout=function(response){sessionStorage.removeItem("Authorization"),$state.go("prijava",{response:response})};var connection=(new signalR.HubConnectionBuilder).configureLogging(signalR.LogLevel.Debug).withAutomaticReconnect().withUrl(config.alertHub,{skipNegotiation:!0,transport:signalR.HttpTransportType.WebSockets,accessTokenFactory:()=>sessionStorage.getItem("Authorization")}).build();connection.start().then((function(){$scope.$apply((function(){$rootScope.connected=!0}))})).catch((function(err){$scope.$apply((function(){$rootScope.connected=!1})),console.log(err)})),connection.onreconnecting(error=>{connection.state===signalR.HubConnectionState.Reconnecting&&$scope.$apply((function(){$rootScope.connected=!1}))}),connection.onreconnected(connectionId=>{connection.state===signalR.HubConnectionState.Connected&&$scope.$apply((function(){$rootScope.connected=!0}))}),connection.on("messageReceived",(function(data){$scope.$apply((function(){$rootScope.alertLoads=data.DataList}))})),jQuery((function($){$(".sidebar-dropdown > a").click((function(){$(".sidebar-submenu").slideUp(200),$(this).parent().hasClass("active")?($(".sidebar-dropdown").removeClass("active"),$(this).parent().removeClass("active")):($(".sidebar-dropdown").removeClass("active"),$(this).next(".sidebar-submenu").slideDown(200),$(this).parent().addClass("active"))})),$(window).on("resize",(function(){$(window).width()>=768?$(".page-wrapper").addClass("toggled"):$(".page-wrapper").removeClass("toggled")})),$("#toggle-sidebar").click((function(){$(".page-wrapper").toggleClass("toggled")})),$("#pin-sidebar").click((function(){$(".page-wrapper").hasClass("pinned")?(window.localStorage.setItem("hop.hit.si.pinned",!1),$("#pin-icon").addClass("fa-angle-double-left"),$("#pin-icon").removeClass("fa-thumbtack"),$(".page-wrapper").removeClass("pinned"),$(".page-wrapper").removeClass("sidebar-hovered"),$("#sidebar").unbind("mouseenter mouseleave")):(window.localStorage.setItem("hop.hit.si.pinned",!0),$(".page-wrapper").addClass("pinned"),$("#pin-icon").removeClass("fa-angle-double-left"),$("#pin-icon").addClass("fa-thumbtack"),$("#sidebar").hover((function(){$(".page-wrapper").addClass("sidebar-hovered")}),(function(){$(".page-wrapper").removeClass("sidebar-hovered")})))})),$("#overlay").click((function(){$(".page-wrapper").toggleClass("toggled")})),$("#toggle-bg").change((function(e){e.preventDefault(),$(".page-wrapper").toggleClass("sidebar-bg")})),$("#toggle-border-radius").change((function(e){e.preventDefault(),$(".page-wrapper").toggleClass("boder-radius-on")})),/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||($(".sidebar-content").mCustomScrollbar({axis:"y",autoHideScrollbar:!0,scrollInertia:300}),$(".sidebar-content").addClass("desktop"));try{var pinned=!1;"true"==(pinned=window.localStorage.getItem("hop.hit.si.pinned"))&&$("#pin-sidebar").click()}catch(error){}$("#toggle-sidebar").is(":visible")&&$(".page-wrapper").toggleClass("toggled"),$(".menu-link").click((function(){$(".page-wrapper").removeClass("sidebar-hovered"),$("#toggle-sidebar").is(":visible")&&$(".page-wrapper").toggleClass("toggled")}))}))}));