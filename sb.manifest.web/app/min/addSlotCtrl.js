"use strict";var app=angular.module("SbManifest");app.controller("addSlotCtrl",(function($rootScope,$scope,$mdDialog,$filter,dataToPass,apiService,config){var self=this;function getData(){var params={},url=config.manifestApi+"/customer/list";apiService.getData(url,params,!0).then((function(data){self.data=data.DataList}))}$scope.warning=null,self.data=getData(),self.selectedItem=null,self.searchText=null,$scope.dto=dataToPass,$scope.addPassengerList=[],$scope.productList=[],$scope.productSelected=1,$scope.productSlotList=[],self.cancel=function($event){$mdDialog.cancel()},self.add=function($event){var url=config.manifestApi+"/load/slot/add";apiService.postData(url,$scope.addPassengerList,!0).then((function(){$mdDialog.hide()}))},$scope.productChange=function(id){$scope.warning=null,$scope.productSlot=$filter("filter")($scope.productSlotList,(function(item){return item.IdProduct==id})),$scope.dto.SlotsLeft<$scope.productSlot.length&&($scope.warning=$rootScope.messages.nomoreslots)},$scope.isValid=function(){try{return null!=$scope.passengers&&$scope.passengers.length<=$scope.addPassengerList.length}catch(error){return!1}},$scope.addPassenger=function(p,d){var o={};o.IdLoad=$scope.dto.Number,o.IdPeople=p,o.IdProductSlot=d,$scope.addPassengerList.push(o)},$scope.init=function(){var url=config.manifestApi+"/settings/sales/product",params={};apiService.getData(url,params,!0).then((function(data){$scope.productList=data.DataList;var url=config.manifestApi+"/settings/sales/product/slot",params={};apiService.getData(url,params,!0).then((function(data){$scope.productSlotList=data.DataList,$scope.productChange($scope.productSelected)}))}))}}));