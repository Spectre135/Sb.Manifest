"use strict";var app=angular.module("SbManifest");app.controller("addSlotCtrl",(function($rootScope,$scope,$mdDialog,$filter,dataToPass,apiService,config){var self=this;function checkFunds(p,d){try{var person=$filter("filter")($scope.customers,(function(item){return item.Id==p}))[0];return!!person.IsStaff||(person.AvaibleTickets>0&&person.IdProductSlot==d.Id||person.AvaibleFunds-d.Income>0)}catch(err){}}function getCustomerList(){self.working=!0;var url=config.manifestApi+"/load/active/",params={search:self.searchText,size:20,idLoad:$scope.dto.Id},promise;return apiService.getData(url,params,!1).then((function(data){$scope.customers=noDuplicates($scope.customers.concat(data.DataList))})).finally((function(){self.working=!1}))}function getActiveToday(){self.working=!0;var url=config.manifestApi+"/load/active/today",params={idLoad:$scope.dto.Id},promise;return apiService.getData(url,params,!1).then((function(data){$scope.customers=noDuplicates($scope.customers.concat(data.DataList))})).finally((function(){self.working=!1}))}self.selectedItem=null,self.searchText=null,$scope.dto=dataToPass,$scope.addPassengerList=[],$scope.productList=[],$scope.productSelected=1,$scope.productSlotList=[],$scope.customers=[],self.working=!1,self.cancel=function($event){$mdDialog.cancel()},self.add=function($event){var url=config.manifestApi+"/load/slot/add";apiService.postData(url,$scope.addPassengerList,!0).then((function(){$mdDialog.hide()}))},$scope.productChange=function(id){self.warning=null,$scope.productSlot=$filter("filter")($scope.productSlotList,(function(item){return item.IdProduct==id})),$scope.dto.SlotsLeft<$scope.productSlot.length&&(self.warning=$rootScope.messages.nomoreslots)},$scope.isValid=function(){try{return null!=$scope.productSlot&&!self.warning&&$scope.productSlot.length<=$scope.addPassengerList.length}catch(error){return!1}},$scope.addPassenger=function(p,d){if(!checkFunds(p,d)){var name=$filter("filter")($scope.customers,(function(item){return item.Id==p}))[0].Name;self.warning=$rootScope.messages.notfunds+" "+name}var o={};o.IdLoad=$scope.dto.Id,o.IdCustomer=p,o.IdProductSlot=d.Id,$filter("filter")($scope.addPassengerList,(function(item){return item.IdCustomer==p})).length>0&&(self.warning=$rootScope.messages.duplicatePassengerInLoad),$scope.addPassengerList.push(o),self.searchText=null},$scope.onKeySearch=function($event){$event.stopPropagation();var array={};self.searchText&&0==(array=$filter("filter")($scope.customers,{Name:self.searchText})).length&&getCustomerList()},$scope.init=function(){var url=config.manifestApi+"/settings/sales/product",params={};apiService.getData(url,params,!0).then((function(data){$scope.productList=data.DataList;var url=config.manifestApi+"/settings/sales/product/slot",params={};apiService.getData(url,params,!0).then((function(data){$scope.productSlotList=data.DataList,$scope.productChange($scope.productSelected),getActiveToday()}))}))}}));