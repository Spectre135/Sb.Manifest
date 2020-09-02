'use strict';

var app = angular.module('SbManifest');

//config Header we add AuthToken read from sessionStorage
app.factory('httpRequestInterceptor', [function () {
    return {
        request: function (config) {
            config.headers['Authorization'] = 'HitAuthToken ' + sessionStorage.getItem('Authorization');
            return config;
        }
    };
}]);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
}]);

//Services
app.factory('apiService', function ($q, $http) {

    var service = {};
    //GET Data 
    service.getData = function (apiUrl, params, posivim) {
        var deferred = $q.defer();
        //posivim ekran
        if (posivim) {
            window.onload = grayOut(true);
        };
        $http({
            method: 'GET',
            url: apiUrl,
            params

        }).then(function onSuccess(response) {
            deferred.resolve(response.data);

        }).catch(function onError(response) {
            writeError(response.data);
            deferred.reject(response);

        }).finally(function () {
            //posivim ekran
            if (posivim) {
                window.onload = grayOut(false);
            };
        });
        return deferred.promise;
    };

    //POST data
    service.postData = function (apiUrl, dto, posivim) {
        var deferred = $q.defer();

        //posivim ekran
        if (posivim) {
            window.onload = grayOut(true);
        };

        $http({
            method: 'POST',
            url: apiUrl,
            data: dto
        }).then(function onSuccess(response) {
            deferred.resolve(response.data);
        }).catch(function onError(response) {
            writeError(response.data);
            deferred.reject(response);
        }).finally(function () {
            //posivim ekran
            if (posivim) {
                window.onload = grayOut(false);
            };
        });

        return deferred.promise;
    };

    //DELETE Data 
    service.deleteData = function (apiUrl, params) {
        var deferred = $q.defer();
        //posivim ekran
        window.onload = grayOut(true);

        $http({
            method: 'DELETE',
            url: apiUrl,
            params

        }).then(function onSuccess(response) {
            deferred.resolve(response.data);

        }).catch(function onError(response) {
            writeError(response.data);
            deferred.reject(response);

        }).finally(function () {
            //posivim ekran
            if (posivim) {
                window.onload = grayOut(false);
            };
        });

        return deferred.promise;
    };

    //error message handling
    function writeError(response) {
        //Remove errors
        window.localStorage.removeItem('error');
        window.localStorage.removeItem('status');

        if (response !== null) {
            try {
                window.localStorage.setItem('error', response.Message + ' ' + response.ExceptionMessage);
                window.localStorage.setItem('status', response.status);
            } catch (err) {
                //nothing
            }

        } else {
            window.localStorage.setItem('error', 'Failed to load resource: the server responded with a status of 404 (Not Found)');
        }
    };

    return service;
});

