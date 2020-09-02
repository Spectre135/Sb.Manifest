var HEADER_NAME = 'SbManifest-Handle-Errors-Generically';
var specificallyHandleInProgress = false;
var app = angular.module('SbManifest');

app.factory('RequestsErrorHandler', function ($q, $rootScope) {
    return {
        // --- The user's API for claiming responsiblity for requests ---
        specificallyHandled: function (specificallyHandledBlock) {
            specificallyHandleInProgress = true;
            try {
                return specificallyHandledBlock();
            } finally {
                specificallyHandleInProgress = false;
            }
        },

        // --- Response interceptor for handling errors generically ---
        responseError: function (rejection) {
            var shouldHandle = (rejection && rejection.config && rejection.config.headers && rejection.config.headers[HEADER_NAME]);

            if (shouldHandle) {

                if (rejection.status != 306 &&
                    rejection.status != 400 &&
                    rejection.status != 429 &&
                    rejection.status != 403 &&
                    rejection.status != 404 &&
                    rejection.status != 401) {
                    $rootScope.showDialog('NAPAKA', 'Prišlo je do napake. Poizkusite kasneje.\n\nZa napako se opravičujemo !');

                } else if (rejection.status == 403) {
                    //we check if user is authenticated
                    if (sessionStorage.getItem('Authorization') === null) {
                        $rootScope.logout(rejection.statusText); // go to login
                    } else {
                        $rootScope.showDialog('NAPAKA', 'Za izbrano akcijo nimate dovoljenja.\n\nProsim obrnite se na oddelek informatike.');
                    }
                } else if (rejection.status == 404 && sessionStorage.getItem('Authorization') != null) {
                    $rootScope.showDialog('NAPAKA', rejection.statusText);
                } else if (rejection.status != 400 && rejection.status != 306) {
                    try {
                        $rootScope.logout(rejection.statusText); // go to login
                    } catch (error) {}
                }

            }
            return $q.reject(rejection);
        }
    };
});

app.config( function ($provide, $httpProvider) {
    $httpProvider.interceptors.push('RequestsErrorHandler');

    // --- Decorate $http to add a special header by default ---

    function addHeaderToConfig(config) {
        config = config || {};
        config.headers = config.headers || {};

        // Add the header unless user asked to handle errors himself
        if (!specificallyHandleInProgress) {
            config.headers[HEADER_NAME] = true;
        }

        return config;
    }

    // The rest here is mostly boilerplate needed to decorate $http safely
    $provide.decorator('$http', ['$delegate', function ($delegate) {
        function decorateRegularCall(method) {
            return function (url, config) {
                return $delegate[method](url, addHeaderToConfig(config));
            };
        }

        function decorateDataCall(method) {
            return function (url, data, config) {
                return $delegate[method](url, data, addHeaderToConfig(config));
            };
        }

        function copyNotOverriddenAttributes(newHttp) {
            for (var attr in $delegate) {
                if (!newHttp.hasOwnProperty(attr)) {
                    if (typeof ($delegate[attr]) === 'function') {
                        newHttp[attr] = function () {
                            return $delegate[attr].apply($delegate, arguments);
                        };
                    } else {
                        newHttp[attr] = $delegate[attr];
                    }
                }
            }
        }

        var newHttp = function (config) {
            return $delegate(addHeaderToConfig(config));
        };

        newHttp.get = decorateRegularCall('get');
        newHttp.delete = decorateRegularCall('delete');
        newHttp.head = decorateRegularCall('head');
        newHttp.jsonp = decorateRegularCall('jsonp');
        newHttp.post = decorateDataCall('post');
        newHttp.put = decorateDataCall('put');

        copyNotOverriddenAttributes(newHttp);

        return newHttp;
    }]);
});
