"use strict";var app=angular.module("SbManifest");app.controller("loadCtrl",(function($rootScope,$scope,$q,$filter,$mdDialog,$mdSidenav,apiService,config){function isInLoad(item){try{var response=!1;return angular.forEach(item.GroupList,(function(value,key){angular.forEach(value.LoadList,(function(value,key){$.inArray(value.IdCustomer,$scope.moved.IdCustomer)>-1&&(response=!0)}))})),response}catch(err){}}function getActiveToday(){self.working=!0;var url=config.manifestApi+"/load/active/today",promise;return apiService.getData(url,null,!1).then((function(data){$scope.customers=noDuplicates($scope.customers.concat(data.DataList))})).finally((function(){self.working=!1}))}function getCustomerList(){$scope.working=!0;var url=config.manifestApi+"/load/active/",params={search:$scope.searchText,size:20},promise;return apiService.getData(url,params,!1).then((function(data){$scope.customers=noDuplicates($scope.customers.concat(data.DataList))})).finally((function(){$scope.working=!1}))}$scope.loads,$scope.query={order:"",limit:5,page:1},$scope.rows,$scope.moved={},$scope.moved.IdCustomer=[],$scope.customers=[],$scope.dragToAdd=!1,$scope.getLoadList=function(){var params={},url=config.manifestApi+"/load/list",promise;return apiService.getData(url,params,!0).then((function(data){$scope.loads=data.DataList}))},$scope.init=function(){$scope.getLoadList()},$scope.addPeople=function($event,dto){$mdDialog.show({locals:{dataToPass:dto},controller:"addSlotCtrl",controllerAs:"ctrl",templateUrl:"app/components/load/addSlot.html",parent:angular.element(document.body),targetEvent:$event,clickOutsideToClose:!1}).then((function(){$scope.getLoadList()})).catch((function(){}))},$scope.showConfirm=function(passenger,productSlot,LoadNo){var confirm=$mdDialog.confirm().title("Would you like to delete "+passenger+"?").textContent("You will delete "+passenger+"-"+productSlot+"\n\rfrom Load "+LoadNo).ok("Delete").cancel("Cancel");$mdDialog.show(confirm).then((function(){$scope.status="Deleted"}),(function(){$mdDialog.hide()}))},$scope.confirmLoad=function($event,dto){var now=new Date;dto.scheduled=new Date(now.getTime()+12e5),$mdDialog.show({locals:{dataToPass:dto},controller:"confirmLoadCtrl",controllerAs:"ctrl",templateUrl:"app/components/load/confirmLoad.html",parent:angular.element(document.body),targetEvent:$event,clickOutsideToClose:!1}).then((function(){$scope.getLoadList()})).catch((function(){}))},$scope.editLoad=function($event,dto){dto||(dto={}),dto.Loads=$scope.loads,$mdDialog.show({locals:{dataToPass:dto},controller:"editLoadCtrl",controllerAs:"ctrl",templateUrl:"app/components/load/editLoad.html",parent:angular.element(document.body),targetEvent:$event,clickOutsideToClose:!1}).then((function(){$scope.getLoadList()})).catch((function(){}))},$scope.beforeDrop=function(event,ui,item){var deferred=$q.defer();if($scope.loadMoveId!=item.Id)if($scope.moved.IdLoadFrom=$scope.loadMoveId,$scope.moved.IdLoadTo=item.Id,isInLoad(item)){var confirm=$mdDialog.alert().title($rootScope.messages.warning).textContent($scope.PassengerMove+" already In").ok("ok");$mdDialog.show(confirm).then((function(){$mdDialog.hide()}),(function(){$mdDialog.hide()}))}else deferred.resolve();return deferred.promise},$scope.startCallback=function(event,ui,item){$scope.PassengerMove=[],$scope.moved.IdCustomer=[],angular.forEach(item.LoadList,(function(value,key){$scope.loadMove=value.Number,$scope.loadMoveId=value.Id,$scope.moved.IdCustomer.push(value.IdCustomer),$scope.PassengerMove.push(value.Passenger)}))},$scope.startCallbackAdd=function(event,ui,item){$scope.addPassengerList=[],$scope.passenger={},$scope.dragToAdd=!0,$scope.passenger.IdCustomer=item.Id,$scope.passenger.IdProductSlot=1,$scope.moved.IdCustomer.push(item.Id),$scope.PassengerMove=item.Name},$scope.dropCallback=function(event,ui){if($scope.dragToAdd){$scope.passenger.IdLoad=$scope.moved.IdLoadTo,$scope.addPassengerList.push($scope.passenger);var url=config.manifestApi+"/load/slot/add";apiService.postData(url,$scope.addPassengerList,!0).then((function(){$scope.moved={},$scope.moved.IdCustomer=[],$scope.getLoadList()}))}else{var url=config.manifestApi+"/load/slot/move";apiService.postData(url,$scope.moved,!0).then((function(){$scope.moved={},$scope.moved.IdCustomer=[],$scope.getLoadList()}))}},$scope.openSideMenu=function(){getActiveToday(),$mdSidenav("right").toggle()},$scope.closeSideMenu=function(){$mdSidenav("right").close()},$scope.onKeySearch=function($event){$event.stopPropagation();var array={};$scope.searchText&&0==(array=$filter("filter")($scope.customers,{Name:$scope.searchText})).length&&getCustomerList()}})),app.controller("confirmLoadCtrl",(function($scope,$state,$filter,$mdDialog,$window,dataToPass,apiService,config){var self=this;$scope.dto=dataToPass,this.cancel=function($event){$mdDialog.cancel()},this.save=function($event){var url=config.manifestApi+"/load/confirm";apiService.postData(url,$scope.dto,!0).then((function(){$mdDialog.hide()}))}})),app.controller("editLoadCtrl",(function($scope,$state,$filter,$mdDialog,$window,dataToPass,apiService,config){var self=this;$scope.warning=null,$scope.load=dataToPass,$scope.label=null==$scope.load?"Add new load":"Edit "+$scope.load.Name,this.cancel=function($event){$mdDialog.cancel()},this.save=function($event){$scope.load.Loads=null;var url=config.manifestApi+"/load/save";apiService.postData(url,$scope.load,!0).then((function(){$mdDialog.hide()}))},$scope.getAircrafts=function(){var url=config.manifestApi+"/settings/aircraft",promise;return apiService.getData(url,null,!1).then((function(data){$scope.aircraftList=data.DataList}))},$scope.setAircraft=function(dto){dto&&($scope.aircraftList=[{Id:dto.IdAircraft,Registration:dto.AircraftRegistration,Type:dto.AircraftType}],$scope.getLoadNumber(dto.IdAircraft))},$scope.getLoadNumber=function(idAircraft){var array=$scope.load.Loads;if(idAircraft)var array=$filter("filter")(array,(function(item){return item.IdAircraft==idAircraft}));var max=Math.max.apply(Math,array.map((function(o){return o.Number})));$scope.load.Number=max>0?max+1:1}}));