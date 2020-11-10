"use strict";var app=angular.module("SbManifest");app.controller("loadCtrl",(function($rootScope,$scope,$q,$filter,$mdDialog,$interval,apiService,config){$scope.loads,$scope.rows,$scope.moved={},$scope.moved.IdPerson=[],$scope.persons=[],$scope.personsInGroup=[],$scope.dragToAdd=!1,$scope.productList=[],$scope.selectedIdPerson,$scope.selectedGroup,$scope.dataDrag=!0,$scope.groups=[];var visibleItems=[];function getProducts(){if(0==$scope.productList.length){var url=config.manifestApi+"/settings/sales/product";apiService.getData(url,null,!0).then((function(data){$scope.productList=$filter("filter")(data.DataList,(function(item){return 1==item.IsFavorite}))}))}}function isInLoad(load,idPerson){try{var response=!1;return angular.forEach(load.GroupList,(function(value,key){angular.forEach(value.LoadList,(function(value,key){$.inArray(value.IdPerson,idPerson)>-1&&(response=!0)}))})),response}catch(err){}}function reselectPerson(){$scope.selectedIdPerson>-1&&setTimeout((function(){var slots;angular.element('.load .slot[data-idperson="'+$scope.selectedIdPerson+'"]').addClass("selected")}),500)}function getActiveToday(){self.working=!0;var url=config.manifestApi+"/load/active/today",promise;return apiService.getData(url,null,!1).then((function(data){$scope.persons=data.DataList})).finally((function(){self.working=!1}))}function getPersonsList(){$scope.working=!0;var url=config.manifestApi+"/load/active/",params={search:$scope.searchText,size:20},promise;return apiService.getData(url,params,!1).then((function(data){$scope.persons=noDuplicates($scope.persons.concat(data.DataList))})).finally((function(){$scope.working=!1}))}function SaveSkydiversGroup(dto){var url=config.manifestApi+"/skydivers/group/save";apiService.postData(url,dto,!1).then((function(data){$scope.groups=[],$scope.getLoadList()}))}function checkForOthersInGroup(idLoad){$scope.personsInGroup=[];var response=!1;if(!$scope.dragToAdd){var loads=$filter("filter")($scope.loads,(function(l){return l.Id==idLoad}))[0].GroupList;if($scope.IdPersonalGroup)var groups=$filter("filter")(loads,(function(g){return g.IdPersonalGroup==$scope.IdPersonalGroup}));angular.forEach(groups,(function(value,key){angular.forEach(value.LoadList,(function(value,key){$scope.personsInGroup.push(value.IdPerson),response=!0}))})),response&&1==$scope.personsInGroup.length&&(response=!1)}return response}function updateMinutesLeft(){try{angular.forEach($scope.loads,(function(value,key){value.DateDeparted&&(value.MinutesLeft=getTimeDiffInMInutes(value.DateDeparted))}))}catch(err){}}$scope.getLoadList=function(){var params={},url=config.manifestApi+"/load/list",promise;return apiService.getData(url,params,!0).then((function(data){$scope.loads=data.DataList,updateMinutesLeft()}))},$scope.init=function(){$scope.getLoadList().then((function(){getProducts()}))},$scope.addPeople=function($event,dto,idProduct){dto.IdProductSelected=idProduct,$mdDialog.show({locals:{dataToPass:dto},controller:"addSlotCtrl",controllerAs:"ctrl",templateUrl:"app/components/load/addSlot.html",parent:angular.element(document.body),targetEvent:$event,clickOutsideToClose:!1}).then((function(){$scope.getLoadList()})).catch((function(){}))},$scope.departureLoad=function($event,dto){var prevLoad=$filter("filter")($scope.loads,(function(item){return item.IdAircraft==dto.IdAircraft&&item.Number==dto.Number-1}))[0];$mdDialog.show({locals:{dataToPass:dto,prevLoad:prevLoad},controller:"departureLoadCtrl",controllerAs:"ctrl",templateUrl:"app/components/load/departureLoad.html",parent:angular.element(document.body),targetEvent:$event,clickOutsideToClose:!1}).then((function(){$scope.getLoadList()})).catch((function(){}))},$scope.editLoad=function($event,dto){dto||(dto={}),dto.Loads=$scope.loads,$mdDialog.show({locals:{dataToPass:dto},controller:"editLoadCtrl",controllerAs:"ctrl",templateUrl:"app/components/load/editLoad.html",parent:angular.element(document.body),targetEvent:$event,clickOutsideToClose:!1}).then((function(){$scope.getLoadList()})).catch((function(){}))},$scope.beforeDrop=function(event,ui,item){var slots;$scope.selectedIdPerson>-1&&angular.element(".load .slot.selected").removeClass("selected");var deferred=$q.defer();return-1==item?($scope.moved.IdLoadFrom=$scope.loadMoveId,$rootScope.confirmDialog("Confirm remove","You will remove "+$scope.PassengerMove+"\n\rfrom Load "+$scope.loadMove,"Remove","Cancel").then((function onSuccess(result){return deferred.resolve()}))):$scope.loadMoveId!=item.Id&&($scope.moved.IdLoadFrom=$scope.loadMoveId,$scope.moved.IdLoadTo=item.Id,isInLoad(item,$scope.moved.IdPerson)?$rootScope.confirmDialog($rootScope.messages.warning,$scope.PassengerMove+" already In","ok").then((function(){$scope.moved={},$scope.moved.IdPerson=[],$mdDialog.hide()}),(function(){$mdDialog.hide()})):checkForOthersInGroup($scope.loadMoveId)?isInLoad(item,$scope.personsInGroup)?$rootScope.confirmDialog("Move","Whole group can not be moved, people already in load "+item.Number+" !\nMove only "+$scope.PassengerMove+" ?","yes","no").then((function(result){return deferred.resolve()})).finally((function(){return deferred.reject()})):$rootScope.confirmDialog("Move","What would you like to move ?","group","person").then((function(result){$scope.moved.IdPerson=$scope.personsInGroup})).finally((function(){return deferred.resolve()})):deferred.resolve()),deferred.promise},$scope.startCallback=function(event,ui,item,idLoad){var loadBin;$scope.PassengerMove=[],$scope.moved.IdPerson=[],angular.forEach(item.LoadList,(function(value,key){$scope.loadMove=idLoad,$scope.loadMoveId=value.Id,$scope.IdPersonalGroup=item.IdPersonalGroup,$scope.moved.IdPerson.push(value.IdPerson),$scope.PassengerMove.push(value.Passenger)})),angular.element('.load-bin[data-idload="'+$scope.loadMoveId+'"]').addClass("visible")},$scope.stopCallback=function(event,ui){var loadBin;angular.element(".load-bin.visible").removeClass("visible")},$scope.startCallbackAdd=function(event,ui,item){$scope.addPassengerList=[],$scope.passenger={},$scope.dragToAdd=!0,$scope.passenger.IdPerson=item.Id,$scope.passenger.IdProductSlot=1,$scope.moved.IdPerson.push(item.Id),$scope.PassengerMove=item.Name},$scope.dropCallback=function(event,ui){if($scope.dragToAdd){$scope.passenger.IdLoad=$scope.moved.IdLoadTo,$scope.addPassengerList.push($scope.passenger);var url=config.manifestApi+"/load/slot/add";apiService.postData(url,$scope.addPassengerList,!0).then((function(){$scope.moved={},$scope.moved.IdPerson=[],$scope.dragToAdd=!1,$scope.getLoadList().then(reselectPerson)}))}else{var url=config.manifestApi+"/load/slot/move";apiService.postData(url,$scope.moved,!0).then((function(){$scope.moved={},$scope.moved.IdPerson=[],$scope.loadMoveId=0,$scope.getLoadList().then(reselectPerson)}))}},$scope.openSideMenu=function(){var a=angular.element("#loads-main .loads"),clientWidth=a[0].clientWidth;getActiveToday(),angular.element("#loads-main").addClass("open-helper");var newClientWidth,delta=clientWidth-a[0].clientWidth-46;a[0].scrollLeft+=delta},$scope.closeSideMenu=function(){angular.element("#loads-main").removeClass("open-helper")},$scope.onKeySearch=function($event){$event.stopPropagation();var array={};$scope.searchText&&0==(array=$filter("filter")($scope.persons,{Name:$scope.searchText})).length&&getPersonsList()},$scope.selectPerson=function(IdPerson,scope,elem,attrs){var slots,slots;$scope.selectedIdPerson==IdPerson?((slots=angular.element('.load .slot[data-idperson="'+IdPerson+'"], #loads-helper-slots .slot[data-idperson="'+IdPerson+'"]')).removeClass("selected"),$scope.selectedIdPerson=-1):((slots=angular.element(".load .slot.selected, #loads-helper-slots .slot.selected")).removeClass("selected"),(slots=angular.element('.load .slot[data-idperson="'+IdPerson+'"], #loads-helper-slots .slot[data-idperson="'+IdPerson+'"]')).addClass("selected"),$scope.selectedIdPerson=IdPerson)},$scope.selectGroup=function(group){var g,g;$scope.selectedGroup>=0&&(g=angular.element("#loads-helper-groups .group.g"+$scope.selectedGroup)).removeClass("selected");$scope.selectedGroup==group?($scope.selectedGroup=-1,$scope.dataDrag=!0,angular.element("body").removeClass("group-mode-on"),SaveSkydiversGroup($scope.groups)):((g=angular.element("#loads-helper-groups .group.g"+group)).addClass("selected"),$scope.selectedGroup=group,$scope.dataDrag=!1,angular.element("body").addClass("group-mode-on"))},$scope.addGroup=function($event,personModel,idLoad){if($scope.selectedGroup>=0){const idGroup=personModel.IdPersonalGroup==$scope.selectedGroup?0:$scope.selectedGroup;let index=$scope.groups.findIndex(g=>g.IdPerson==personModel.IdPerson&&g.IdLoad==idLoad);-1==index&&($scope.groups.push({IdPerson:personModel.IdPerson,IdLoad:idLoad}),index=$scope.groups.length-1);const g=angular.element($event.currentTarget).find(".passenger .group-placeholder");$scope.selectedGroup>0&&personModel.IdPersonalGroup!=$scope.selectedGroup?($scope.groups[index].IdGroup=idGroup,g.html('<span class="group g'+$scope.selectedGroup+'">'+$scope.selectedGroup+"</span>")):($scope.groups[index].IdGroup=0,g.html("")),personModel.IdPersonalGroup=idGroup}},$scope.getGroupClass=function(group){return"group g"+group},$scope.refuel=function($event,dto,refuel){var el,parent;angular.element($event.currentTarget).parent().parent().toggleClass("refuel"),dto.Refuel=refuel,apiService.postData(config.manifestApi+"/load/save",dto,!1)},$scope.setInview=function(index,inview){var item={};item.Index=index,item.Visible=inview;var i=visibleItems.findIndex((function(items){return items.Index===index}));i>=0&&visibleItems.splice(i,1),visibleItems.push(item)},$scope.canDrop=function(index){try{return $filter("filter")(visibleItems,(function(item){return item.Index==index}))[0].Visible}catch(err){return!1}},$scope.hasFundsOrTickets=function(p){try{return p.AvailableFunds>0||p.AvailableTickets>0}catch(err){}},$interval(updateMinutesLeft,15e3)})),app.controller("departureLoadCtrl",(function($scope,$mdDialog,dataToPass,prevLoad,apiService,config){var self=this;function getMinTime(){if($scope.prevLoad&&$scope.prevLoad.DateDeparted){var d=new Date($scope.prevLoad.DateDeparted);return d.setMinutes(d.getMinutes()+$scope.prevLoad.RotationTime),$scope.minTime=getDateHHss(d),$scope.minTime}return $scope.minTime=getDateHHss(new Date),$scope.minTime}$scope.dto=angular.copy(dataToPass),$scope.prevLoad=prevLoad,$scope.minTime=getDateHHss(new Date),$scope.dto.DateDeparted=null==$scope.dto.DateDeparted?getMinTime():getDateHHss(new Date($scope.dto.DateDeparted)),this.cancel=function($event){$mdDialog.cancel()},this.save=function($event){var dto=angular.copy($scope.dto);dto.DateDeparted=convertLocalDate($scope.dto.DateDeparted);var url=config.manifestApi+"/load/depart/save";apiService.postData(url,dto,!0).then((function(){$mdDialog.hide()}))}})),app.controller("editLoadCtrl",(function($scope,$state,$filter,$mdDialog,$window,dataToPass,apiService,config){var self=this;$scope.warning=null,$scope.load=dataToPass,$scope.label=null==$scope.load?"Add new load":$scope.load.AircraftName+" "+$scope.load.Number,this.cancel=function($event){$mdDialog.cancel()},this.save=function($event){$scope.load.Loads=null;var url=config.manifestApi+"/load/save";apiService.postData(url,$scope.load,!0).then((function(){$mdDialog.hide()}))},$scope.getAircrafts=function(){var url=config.manifestApi+"/settings/aircraft",promise;return apiService.getData(url,null,!1).then((function(data){$scope.aircraftList=data.DataList}))},$scope.setAircraft=function(dto){dto&&($scope.aircraftList=[{Id:dto.IdAircraft,Registration:dto.AircraftRegistration,Type:dto.AircraftType}],$scope.getLoadNumber(dto.IdAircraft))},$scope.getLoadNumber=function(idAircraft){var array=$scope.load.Loads;if(idAircraft)var array=$filter("filter")(array,(function(item){return item.IdAircraft==idAircraft}));var max=Math.max.apply(Math,array.map((function(o){return o.Number})));$scope.load.Number=max>0?max+1:1}}));