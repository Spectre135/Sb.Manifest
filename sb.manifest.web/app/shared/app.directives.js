'use strict';

var app = angular.module('SbManifest');

app.directive('myPassword', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, mCtrl) {
            mCtrl.$parsers.push(function (value) {
                var aryValue = value.split("");
                var isChar = false,
                    isDigit = false,
                    isUpper = false;

                aryValue.forEach(function (element, index, array) {
                    if (Number.isInteger(parseInt(element))) {
                        isDigit = true;
                    } else if (element == element.toUpperCase()) {
                        isUpper = true;
                    } else {
                        isChar = true;
                    }
                })

                mCtrl.$setValidity('pass', isChar&&isDigit&&isUpper);

                return value;
            });
        }
    };
});

app.directive('compareTo', function () {
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: '=compareTo'
        },
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch('otherModelValue', function () {
                ngModel.$validate();
            });
        }
    };
});

app.directive('equalTo', function () {
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: '=equalTo'
        },
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.equalTo = function (modelValue) {
                return modelValue != scope.otherModelValue;
            };

            scope.$watch('otherModelValue', function () {
                ngModel.$validate();
            });
        }
    };
});

app.directive('date', function (dateFilter) {
    return {
        require: 'ngModel',
        link: function (scope,
            elm, attrs, ctrl) {

            var dateFormat =
                attrs['date'] || 'dd.MM.yyyy';

            ctrl.$formatters.unshift(
                function (modelValue) {
                    return dateFilter(
                        modelValue, dateFormat);
                });
        }
    };
});
