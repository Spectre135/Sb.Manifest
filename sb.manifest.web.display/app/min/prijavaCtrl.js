"use strict";var app=angular.module("SbManifest");app.controller("prijavaCtrl",(function($scope,$state,config,apiService){$scope.user={},$scope.data=[],$scope.prijava="login",$scope.working=!1,$scope.response=$state.params.response,$scope.success=$state.params.success,$scope.Login=function(){$scope.prijava="login...",$scope.working=!0,$scope.success="",$scope.response="";var url=config.manifestApi+"/token/";apiService.postData(url,$scope.user,!0).then((function(data){data?(sessionStorage.setItem("Authorization",data),$scope.working=!1,$scope.Prijavljen()):($scope.prijava="login",$scope.working=!1,$scope.response="Your login attempt was not successful.")}),(function(response){$scope.prijava="login",$scope.working=!1,$scope.response=response.data,306==response.status&&$state.go("changepass",{response:$scope.response,user:$scope.user}),403==response.status&&($scope.response="Nimate dovoljenja za dostop do aplikacije.")}))},$scope.Prijavljen=function(){$state.go("main")},$("#prijava").keyup((function(event){13===event.keyCode&&$scope.Login()}))}));