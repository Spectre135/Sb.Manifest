"use strict";var app=angular.module("SbManifest");app.controller("settingsCtrl",(function($scope,$state,$mdDialog,apiService,config){function getData(url,params){$scope.myPage=1,apiService.getData(url,params,!0).then((function(data){$scope.list=data.DataList,$scope.rows=data.RowsCount}))}$scope.list=$state.params.list,$scope.myPage=$state.params.page,$scope.myLimit=$state.params.limit,$scope.myOrder=$state.params.order,$scope.query={order:"name",limit:5,page:1},$scope.rows=$state.params.rows,$scope.getProducts=function(){var url,params;getData(config.manifestApi+"/settings/sales/product",{})},$scope.editProduct=function($event,dto){$mdDialog.show({locals:{dataToPass:dto},controller:"editProductCtrl",controllerAs:"ctrl",bindToController:!0,templateUrl:"app/components/settings/editProduct.html",parent:angular.element(document.body),targetEvent:$event,clickOutsideToClose:!1,onRemoving:function(event,removePromise){$scope.getProducts()}})},$scope.editProductSlot=function($event,dto){$mdDialog.show({locals:{dataToPass:dto},controller:"editProductSlotCtrl",controllerAs:"ctrl",templateUrl:"app/components/settings/editProductSlot.html",parent:angular.element(document.body),targetEvent:$event,clickOutsideToClose:!1,onRemoving:function(event,removePromise){$scope.getProductSlot()}})},$scope.getProductSlot=function(){var url,params;getData(config.manifestApi+"/settings/sales/product/slot",{})},$scope.getAircrafts=function(){var url,params;getData(config.manifestApi+"/settings/aircraft",{})},$scope.editAircraft=function($event,dto){$mdDialog.show({locals:{dataToPass:dto},controller:"editAircraftCtrl",controllerAs:"ctrl",templateUrl:"app/components/settings/editAircraft.html",parent:angular.element(document.body),targetEvent:$event,clickOutsideToClose:!1,onRemoving:function(event,removePromise){$scope.getAircrafts()}})},$scope.init=function(){$scope.list||$scope.getProducts()}})),app.controller("editProductCtrl",(function($scope,$mdDialog,dataToPass,apiService,config){var self=this;$scope.warning=null,$scope.dto=dataToPass,$scope.label=null==$scope.dto?"Add new ":$scope.dto.Name,this.cancel=function($event){$mdDialog.cancel()},this.save=function($event){var url=config.manifestApi+"/settings/sales/product/save";apiService.postData(url,$scope.dto,!0).then((function(){$mdDialog.hide()}))}})),app.controller("editProductSlotCtrl",(function($scope,$mdDialog,dataToPass,apiService,config){var self=this;function getProducts(){var url=config.manifestApi+"/settings/sales/product";apiService.getData(url,null,!0).then((function(data){$scope.productList=data.DataList,getAccounts()}))}function getAccounts(){var url=config.manifestApi+"/settings/account";apiService.getData(url,null,!0).then((function(data){$scope.accountList=data.DataList}))}$scope.warning=null,$scope.dto=dataToPass,$scope.label=null==$scope.dto?"Add new ":$scope.dto.Name,this.cancel=function($event){$mdDialog.cancel()},this.save=function($event){var url=config.manifestApi+"/settings/sales/product/slot/save";apiService.postData(url,$scope.dto,!0).then((function(){$mdDialog.hide()}))},$scope.init=function(){getProducts()}})),app.controller("editAircraftCtrl",(function($scope,$mdDialog,dataToPass,apiService,config){var self=this;$scope.warning=null,$scope.dto=dataToPass,$scope.label=null==$scope.dto?"Add new ":$scope.dto.Registration,this.cancel=function($event){$mdDialog.cancel()},this.save=function($event){var url=config.manifestApi+"/settings/aircraft/save";apiService.postData(url,$scope.dto,!0).then((function(){$mdDialog.hide()}))}}));