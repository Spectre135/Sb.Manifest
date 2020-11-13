"use strict";var app=angular.module("SbManifest");app.directive("myPassword",(function(){return{require:"ngModel",link:function(scope,element,attr,mCtrl){mCtrl.$parsers.push((function(value){var aryValue=value.split(""),isChar=!1,isDigit=!1,isUpper=!1;return aryValue.forEach((function(element,index,array){Number.isInteger(parseInt(element))?isDigit=!0:element==element.toUpperCase()?isUpper=!0:isChar=!0})),mCtrl.$setValidity("pass",isChar&&isDigit&&isUpper),value}))}}})),app.directive("compareTo",(function(){return{require:"ngModel",scope:{otherModelValue:"=compareTo"},link:function(scope,element,attributes,ngModel){ngModel.$validators.compareTo=function(modelValue){return modelValue==scope.otherModelValue},scope.$watch("otherModelValue",(function(){ngModel.$validate()}))}}})),app.directive("equalTo",(function(){return{require:"ngModel",scope:{otherModelValue:"=equalTo"},link:function(scope,element,attributes,ngModel){ngModel.$validators.equalTo=function(modelValue){return modelValue!=scope.otherModelValue},scope.$watch("otherModelValue",(function(){ngModel.$validate()}))}}})),app.directive("greaterTo",(function(){return{require:"ngModel",scope:{otherModelValue:"=greaterTo"},link:function(scope,element,attributes,ngModel){try{ngModel.$validators.greaterTo=function(modelValue){var val1,val2;return modelValue.replace(":","")>=scope.otherModelValue.replace(":","")},scope.$watch("otherModelValue",(function(){ngModel.$validate()}))}catch(err){console.log(err)}}}})),app.directive("date",(function(dateFilter){return{require:"ngModel",link:function(scope,elm,attrs,ctrl){var dateFormat=attrs.date||"dd.MM.yyyy";ctrl.$formatters.unshift((function(modelValue){return dateFilter(modelValue,dateFormat)}))}}})),app.directive("forceSelectFocus",(function(){return{restrict:"A",require:["^^mdSelect","^ngModel"],link:function(scope,element,controller){scope.$watch((function(){let foundElement=element;for(;!foundElement.hasClass("md-select-menu-container");)foundElement=foundElement.parent();return foundElement.hasClass("md-active")}),(function(newVal){newVal&&element.focus()}))}}})),app.directive("capitalizeFirst",(function($parse){return{require:"ngModel",link:function(scope,element,attrs,modelCtrl){var capitalize=function(inputValue){void 0===inputValue&&(inputValue="");try{var capitalized=inputValue.charAt(0).toUpperCase()+inputValue.substring(1);return capitalized!==inputValue&&(modelCtrl.$setViewValue(capitalized),modelCtrl.$render()),capitalized}catch(error){return inputValue}};modelCtrl.$parsers.push(capitalize),capitalize($parse(attrs.ngModel)(scope))}}})),app.directive("formatCurrency",["$filter","$locale",function($filter,$locale){return{require:"?ngModel",link:function(scope,elem,attrs,ctrl){ctrl&&(ctrl.$formatters.unshift((function(modelValue){var formattedValue;return formattedValue=modelValue?$filter("currency",null,2)(modelValue):""})),ctrl.$parsers.unshift((function(viewValue){var plainNumber,formattedValue,decimalSeparatorIndex=viewValue.lastIndexOf($locale.NUMBER_FORMATS.DECIMAL_SEP);if(decimalSeparatorIndex>0){var wholeNumberPart=viewValue.substring(0,decimalSeparatorIndex),decimalPart=viewValue.substr(decimalSeparatorIndex+1,2);plainNumber=parseFloat(wholeNumberPart.replace(/[^\d]/g,"")+"."+decimalPart).toFixed(2),formattedValue=(formattedValue=$filter("currency",null,2)(plainNumber)).substring(0,formattedValue.lastIndexOf($locale.NUMBER_FORMATS.DECIMAL_SEP)+1),formattedValue+=decimalPart}else plainNumber=parseFloat(viewValue.replace(/[^\d]/g,"")),formattedValue=(formattedValue=$filter("currency",null,0)(plainNumber))?formattedValue.substring(0,formattedValue.lastIndexOf($locale.NUMBER_FORMATS.DECIMAL_SEP)):viewValue;return elem.val(formattedValue),plainNumber})))}}}]),app.directive("timeOnly",(function(){return{require:"ngModel",link:function(scope,ele,attr,ctrl){ctrl.$parsers.push((function(inputValue){var pattern=new RegExp(/(^[0-9]{2})(:{1})([0-9]{2})$/,"g"),newInput;if(""==inputValue)return"";/^[:]/g.test(inputValue)&&(ctrl.$setViewValue(""),ctrl.$render()),newInput=inputValue.replace(/[^0-9:]/g,""),inputValue!=newInput&&(ctrl.$setViewValue(newInput),ctrl.$render());var inputLength=inputValue.length,patternResult=pattern.test(inputValue),colonCount;return colonCount=newInput.split(".").length-1,0==patternResult&&(inputLength>5?(newInput=newInput.slice(0,5),ctrl.$setViewValue(newInput),ctrl.$render()):(2==inputLength&&(colonCount=newInput.split(".").length-1,newInput=inputValue>=24?"23:":newInput.slice(0,inputLength)+":",ctrl.$setViewValue(newInput),ctrl.$render()),5==inputLength&&(colonCount=newInput.split(".").length-1,console.log("mm"),newInput=inputValue.substr(3,2)>=60?newInput.substr(0,3)+59+":":newInput.slice(0,inputLength)+":",ctrl.$setViewValue(newInput),ctrl.$render()))),newInput}))}}}));