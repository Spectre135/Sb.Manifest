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

app.directive('greaterTo', function () {
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: '=greaterTo'
        },
        link: function (scope, element, attributes, ngModel) {
            try {
                ngModel.$validators.greaterTo = function (modelValue) {
                    var val1 = modelValue.replace(':', '');
                    var val2 = scope.otherModelValue.replace(':', '');
                    //return modelValue >= scope.otherModelValue;
                    return val1 >= val2;
                };

                scope.$watch('otherModelValue', function () {
                    ngModel.$validate();
                });
            } catch (err) {console.log(err);}
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
                    formattedValue = $filter('currency', null, 2)(modelValue); // use $filter to do some formatting
                } else {
                    formattedValue = '';
                }
                return formattedValue;
            });

            // $parsers is used to process value from view to code
            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber;
                var formattedValue;

                var decimalSeparatorIndex = viewValue.lastIndexOf($locale.NUMBER_FORMATS.DECIMAL_SEP); // $locale.NUMBER_FORMATS.DECIMAL_SEP variable is the decimal separator for the current culture
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
                    formattedValue = $filter('currency', null, 0)(plainNumber); // the 0 argument for no decimal does not work (issue with Angular)

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

//Directive for custom validation of Time(hh:mm:ss)
app.directive('timeOnly', function() {
  return {
    require: 'ngModel',
    link: function(scope, ele, attr, ctrl) {
      ctrl.$parsers.push(function(inputValue) {
        var pattern = new RegExp(/(^[0-9]{2})(:{1})([0-9]{2})$/, 'g');
        var newInput;

        //Default condition
        if (inputValue == '') {
          return '';
        }

        //Should not start with ":"
        if (/^[:]/g.test(inputValue)) {
          ctrl.$setViewValue('');
          ctrl.$render();
        }

        //Should only contain Digits or ":" 
        newInput = inputValue.replace(/[^0-9:]/g, '');
        if (inputValue != newInput) {
          ctrl.$setViewValue(newInput);
          ctrl.$render();
        }

        //******************************************
        //***************Note***********************
        /*** If a same function call made twice,****
         *** erroneous result is to be expected ****/
        //****example: pattern.test(inputValue)*****
        //******************************************
        var inputLength = inputValue.length;
        var patternResult = pattern.test(inputValue);
        var colonCount;

        colonCount = newInput.split(".").length - 1; // count of colon present
        if (patternResult == false) { //if Pattern False
          if (inputLength > 5) {
            newInput = newInput.slice(0, 5);
            ctrl.$setViewValue(newInput);
            ctrl.$render();
          } else {
            //Restrict "hh" to 2 digit with auto ":" sufixed; 
            if (inputLength == 2) {
              colonCount = newInput.split('.').length - 1; // count of colon present
              if (inputValue >= 24) { /*Automatic  TypeCasting from String to Integer*/
                /* "hh" value if >=24, should be replaced with 23*/
                newInput = 23 + ':';
              } else {
                newInput = (newInput.slice(0, inputLength)) + ':';
              }
              ctrl.$setViewValue(newInput);
              ctrl.$render();
            }
            //Restrict "mm" to 2 digit with auto ":" sufixed;
            if (inputLength == 5) {
              colonCount = newInput.split(".").length - 1; // count of colon present
              console.log('mm');
              if (inputValue.substr(3, 2) >= 60) { /* "mm" value if >=60, should be replaced with 59*/
                newInput = newInput.substr(0, 3) + 59 + ':'
              } else {
                newInput = (newInput.slice(0, inputLength)) + ':';
              }
              ctrl.$setViewValue(newInput);
              ctrl.$render();
            }
          }
        }

        return newInput;
      });
    }
  }
});
