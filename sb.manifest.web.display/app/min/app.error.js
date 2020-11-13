var HEADER_NAME="SbManifest-Handle-Errors-Generically",specificallyHandleInProgress=!1,app=angular.module("SbManifest");app.factory("RequestsErrorHandler",(function($q,$rootScope){return{specificallyHandled:function(specificallyHandledBlock){specificallyHandleInProgress=!0;try{return specificallyHandledBlock()}finally{specificallyHandleInProgress=!1}},responseError:function(rejection){var shouldHandle;if(rejection&&rejection.config&&rejection.config.headers&&rejection.config.headers[HEADER_NAME])if(306!=rejection.status&&400!=rejection.status&&429!=rejection.status&&403!=rejection.status&&404!=rejection.status&&406!=rejection.status&&401!=rejection.status)$rootScope.showDialog("ERROR","Prišlo je do napake. Poizkusite kasneje.\n\nZa napako se opravičujemo !");else if(403==rejection.status)null===sessionStorage.getItem("Authorization")?$rootScope.logout(rejection.statusText):$rootScope.showDialog("ERROR","Za izbrano akcijo nimate dovoljenja.\n\nProsim obrnite se na oddelek informatike.");else if(404==rejection.status&&null!=sessionStorage.getItem("Authorization"))$rootScope.showDialog("ERROR",rejection.statusText);else{if(406==rejection.status&&null!=sessionStorage.getItem("Authorization"))return $rootScope.showDialog("ERROR",rejection.data.Message),$q.reject(rejection.data.Message);if(400!=rejection.status&&306!=rejection.status)try{$rootScope.logout(rejection.statusText)}catch(error){}}return $q.reject(rejection)}}})),app.config((function($provide,$httpProvider){function addHeaderToConfig(config){return(config=config||{}).headers=config.headers||{},specificallyHandleInProgress||(config.headers[HEADER_NAME]=!0),config}$httpProvider.interceptors.push("RequestsErrorHandler"),$provide.decorator("$http",["$delegate",function($delegate){function decorateRegularCall(method){return function(url,config){return $delegate[method](url,addHeaderToConfig(config))}}function decorateDataCall(method){return function(url,data,config){return $delegate[method](url,data,addHeaderToConfig(config))}}function copyNotOverriddenAttributes(newHttp){for(var attr in $delegate)newHttp.hasOwnProperty(attr)||("function"==typeof $delegate[attr]?newHttp[attr]=function(){return $delegate[attr].apply($delegate,arguments)}:newHttp[attr]=$delegate[attr])}var newHttp=function(config){return $delegate(addHeaderToConfig(config))};return newHttp.get=decorateRegularCall("get"),newHttp.delete=decorateRegularCall("delete"),newHttp.head=decorateRegularCall("head"),newHttp.jsonp=decorateRegularCall("jsonp"),newHttp.post=decorateDataCall("post"),newHttp.put=decorateDataCall("put"),copyNotOverriddenAttributes(newHttp),newHttp}])}));