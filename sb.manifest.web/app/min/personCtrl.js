"use strict";var app=angular.module("SbManifest");app.controller("personCtrl",(function($scope,$state,$mdDialog,apiService,config){$scope.list=$state.params.list,$scope.query=$state.params.query,$scope.rows=$state.params.rows,$scope.getPersonList=function(){var url=config.manifestApi+"/person/list";$scope.query.asc=!$scope.query.asc;var params={search:$scope.search,pageIndex:$scope.query.page,pageSizeSelected:$scope.query.limit,sortKey:$scope.query.order,asc:$scope.query.asc};$scope.promise=apiService.getData(url,params,!0).then((function(data){$scope.list=data.DataList,$scope.rows=data.RowsCount}))},$scope.getInvoice=function($event,dto){$mdDialog.show({locals:{dataToPass:dto},controller:"invoiceCtrl",controllerAs:"ctrl",templateUrl:"app/components/shop/invoice.html",parent:angular.element(document.body),targetEvent:$event,clickOutsideToClose:!1}).then((function(){$scope.getPersonList()})).catch((function(){}))},$scope.purchase=function($event,dto){dto.Idperson=dto.Id,$mdDialog.show({locals:{dataToPass:dto},controller:"purchaseCtrl",controllerAs:"ctrl",templateUrl:"app/components/shop/purchase.html",parent:angular.element(document.body),targetEvent:$event,clickOutsideToClose:!1}).then((function(){})).catch((function(){}))},$scope.editPerson=function($event,dto){$mdDialog.show({locals:{dataToPass:dto},controller:"editPersonCtrl",controllerAs:"ctrl",templateUrl:"app/components/persons/editPerson.html",parent:angular.element(document.body),targetEvent:$event,clickOutsideToClose:!1}).then((function(){$scope.getPersonList()})).catch((function(){}))},$scope.onKeyPressSearch=function($event){13===$event.charCode&&$scope.getPersonList()},$scope.detailPerson=function(dto){$state.go("detailPerson",{dto:dto,list:$scope.list,query:$scope.query,rows:$scope.rows})},$scope.init=function(){$scope.getPersonList()}})),app.controller("editPersonCtrl",(function($scope,$mdDialog,dataToPass,apiService,config){var self=this;$scope.warning=null,$scope.person=dataToPass,$scope.label=null==$scope.person?"Add new person":$scope.person.Name,$scope.countries,$scope.person.BirthDate=null==$scope.person.BirthDate?new Date(1950,0,1):$scope.person.BirthDate,this.cancel=function($event){$mdDialog.cancel()},this.save=function($event){$scope.person.BirthDate=convertLocalDate($scope.person.BirthDate);var url=config.manifestApi+"/person/save";apiService.postData(url,$scope.person,!0).then((function(){$mdDialog.hide()}))},$scope.getCountries=function(){var url=config.manifestApi+"/settings/countries",promise;return apiService.getData(url,null,!1).then((function(data){$scope.countries=data.DataList}))},$scope.setCountry=function(dto){$scope.countries=[{Id:dto.IdCountry,Name:dto.Country}]},$scope.checkEmail=function(){var url=config.manifestApi+"/person/email/exist",params={email:$scope.person.Email},promise;return apiService.getData(url,params,!1).then((function(data){data.RowsCount>0&&$scope.form.email.$setValidity("emailexist",!1)}))}})),app.controller("detailPersonCtrl",(function($scope,$state,$mdDialog,apiService,config){$scope.pList=$state.params.list,$scope.pQuery=$state.params.query,$scope.pRows=$state.params.rows,$scope.dto=$state.params.dto,$scope.query={order:"",limit:5,page:1,filter:"",asc:!1},$scope.rows,$scope.getTicketPostList=function(){var url=config.manifestApi+"/person/ticketpost/list";$scope.query.asc=!$scope.query.asc;var params={search:$scope.search,idPerson:$scope.dto.Id,pageIndex:$scope.query.page,pageSizeSelected:$scope.query.limit,sortKey:$scope.query.order,asc:$scope.query.asc};$scope.promise=apiService.getData(url,params,!0).then((function(data){$scope.tickets=data.DataList,$scope.rows=data.RowsCount}))},$scope.getLoadList=function(){var url=config.manifestApi+"/person/load/list";$scope.query.asc=!$scope.query.asc;var params={search:$scope.search,idPerson:$scope.dto.Id,pageIndex:$scope.query.page,pageSizeSelected:$scope.query.limit,sortKey:$scope.query.order,asc:$scope.query.asc};$scope.promise=apiService.getData(url,params,!0).then((function(data){$scope.jumps=data.DataList,$scope.rows=data.RowsCount}))},$scope.onKeyPressSearch=function($event){13===$event.charCode&&$scope.getTicketPostList()},$scope.purchase=function($event){$scope.dto.IdPerson=$scope.dto.Id,$mdDialog.show({locals:{dataToPass:$scope.dto},controller:"purchaseCtrl",controllerAs:"ctrl",templateUrl:"app/components/shop/purchase.html",parent:angular.element(document.body),targetEvent:$event,clickOutsideToClose:!1}).then((function(){})).catch((function(){}))},$scope.init=function(){$scope.getLoadList()},$scope.back=function(){$state.go("persons",{list:$scope.pList,rows:$scope.pRows,query:$scope.pQuery})}}));