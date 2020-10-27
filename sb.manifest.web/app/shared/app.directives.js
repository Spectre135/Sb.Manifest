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

                mCtrl.$setValidity('pass', isChar && isDigit && isUpper);

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

app.directive('forceSelectFocus', function () {
    return {
        restrict: 'A',
        require: ['^^mdSelect', '^ngModel'],
        link: function (scope, element, controller) {
            scope.$watch(function () {
                let foundElement = element;
                while (!foundElement.hasClass('md-select-menu-container')) {
                    foundElement = foundElement.parent();
                }
                return foundElement.hasClass('md-active');
            }, function (newVal) {
                if (newVal) {
                    element.focus();
                }
            })
        }
    }
});

app.directive('capitalizeFirst', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var capitalize = function (inputValue) {
                if (inputValue === undefined) {
                    inputValue = '';
                }
                try {
                    var capitalized = inputValue.charAt(0).toUpperCase() +
                        inputValue.substring(1);
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                } catch (error) {
                    return inputValue;
                }

            }
            modelCtrl.$parsers.push(capitalize);
            capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
        }
    };
});

app.directive('formatCurrency', ['$filter', '$locale', function ($filter, $locale) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;
 
            // $formatters is used to process value from code to view
            ctrl.$formatters.unshift(function (modelValue) {
                var formattedValue;
                if (modelValue) {
                    formattedValue = $filter('currency', null, 2)(modelValue);  // use $filter to do some formatting
                } else {
                    formattedValue = '';
                }
                return formattedValue;
            });
 
            // $parsers is used to process value from view to code
            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber;
                var formattedValue;
                 
                var decimalSeparatorIndex = viewValue.lastIndexOf($locale.NUMBER_FORMATS.DECIMAL_SEP);  // $locale.NUMBER_FORMATS.DECIMAL_SEP variable is the decimal separator for the current culture
                if (decimalSeparatorIndex > 0) {
                    // if input has decimal part
                    var wholeNumberPart = viewValue.substring(0, decimalSeparatorIndex);
                    var decimalPart = viewValue.substr(decimalSeparatorIndex + 1, 2);
                    plainNumber = parseFloat(wholeNumberPart.replace(/[^\d]/g, '') + '.' + decimalPart).toFixed(2); // remove any non number characters and round to two decimal places
 
                    formattedValue = $filter('currency', null, 2)(plainNumber);
                    formattedValue = formattedValue.substring(0, formattedValue.lastIndexOf($locale.NUMBER_FORMATS.DECIMAL_SEP) + 1);
                    formattedValue = formattedValue + decimalPart;
                } else {
                    // input does not have decimal part
                    plainNumber = parseFloat(viewValue.replace(/[^\d]/g, ''));
                    formattedValue = $filter('currency', null, 0)(plainNumber);     // the 0 argument for no decimal does not work (issue with Angular)
 
                    if (formattedValue) {
                        // remove the decimal part
                        formattedValue = formattedValue.substring(0, formattedValue.lastIndexOf($locale.NUMBER_FORMATS.DECIMAL_SEP));
                    } else {
                        formattedValue = viewValue;
                    }
                }
 
                elem.val(formattedValue);
                return plainNumber;
            });
        }
    };
}]);