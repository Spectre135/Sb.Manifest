"use strict";var app=angular.module("SbManifest");app.controller("displayCtrl",(function($scope,$interval,config,apiService){$scope.loads,$scope.connected=!1,$scope.showLoadList=!0,$scope.showPic=!1,$scope.pic="pictures/1.jpg";const displayTime=6e4,picTime=5e3;let refresh=6e4;function swap(){$scope.$apply((function(){$scope.showPic=!$scope.showPic,$scope.showLoadList=!$scope.showLoadList})),$scope.showPic?(refresh=5e3,setTimeout(swap,refresh)):(refresh=6e4,setTimeout(swap,refresh))}function getLoadList(){var params={},url=config.manifestApi+"/load/list",promise;return apiService.getData(url,params,!0).then((function(data){$scope.loads=data.DataList}))}setTimeout(swap,refresh);var connection=(new signalR.HubConnectionBuilder).configureLogging(signalR.LogLevel.Debug).withUrl(config.displayHub,{skipNegotiation:!0,transport:signalR.HttpTransportType.WebSockets,accessTokenFactory:()=>sessionStorage.getItem("Authorization")}).build();function BodyOnKeyDown(e){if([68,70,52,100,53,101,54,102,107,109,187,189].includes(e.which)){const html=angular.element("html")[0];let fontSize=new Number(html.style.fontSize.replace("%",""));70==e.which?document.fullscreenElement?document.exitFullscreen&&document.exitFullscreen():document.documentElement.requestFullscreen():68==e.which?fontSize=6.25:[107,187].includes(e.which)?fontSize+=.1:[109,189].includes(e.which)?fontSize-=.1:[52,100].includes(e.which)?fontSize=10.65:[53,101].includes(e.which)?fontSize=8.55:[54,102].includes(e.which)&&(fontSize=7.15),html.style.fontSize=fontSize+"%"}}connection.start().then((function(){$scope.connected=!0})).catch((function(err){console.log(err)})),connection.on("messageReceived",(function(data){$scope.$apply((function(){$scope.loads=data.DataList}))})),$scope.getGroupClass=function(group){return"group g"+(group||0)},$scope.init=function(){getLoadList(),document.body.onkeydown=function(e){BodyOnKeyDown(e)}}}));