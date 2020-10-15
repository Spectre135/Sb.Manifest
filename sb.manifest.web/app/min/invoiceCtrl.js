"use strict";var app=angular.module("SbManifest");app.controller("invoiceCtrl",(function($scope,$state,$window,$mdDialog,dataToPass,apiService,config){var self=this;$scope.working=!1,$scope.dto=dataToPass,$scope.getInvoiceData=function(){$scope.working=!0;var url=config.manifestApi+"/post/invoice",params={idCustomer:$scope.dto.Id};apiService.getData(url,params,!1).then((function(data){$scope.list=data.DataList,$scope.rows=data.RowsCount})).finally((function(){$scope.working=!1}))},$scope.sum=function(){var sum=0;return angular.forEach($scope.list,(function(value,key){sum+=value.Amount})),sum},this.save=function($event){var url=config.manifestApi+"/post/invoice/pay";apiService.postData(url,$scope.list,!0).then((function(){$mdDialog.hide()}))},this.cancel=function($event){$mdDialog.cancel()}}));