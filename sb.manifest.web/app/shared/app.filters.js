'use strict';

var app = angular.module('SbManifest');

app.filter('multiline', function () {
    return function (text) {
        if (text != null) {
            return text.replace(/\n/g, '\n\r');
        } else {
            return '';
        }

    }
});

app.filter('capitalize', function () {
    return function (input) {
        return (angular.isString(input) && input.length > 0) ? input.charAt(0).toUpperCase() : input;
    }
});

app.filter('unique', function () {
    // we will return a function which will take in a collection
    // and a keyname
    return function (collection, keyname) {
        // we define our output and keys array;
        var output = [],
            keys = [];
        // we utilize angular's foreach function
        // this takes in our original collection and an iterator function
        angular.forEach(collection, function (item) {
            // we check to see whether our object exists
            var key = item[keyname];
            // if it's not already part of our keys array
            if (keys.indexOf(key) === -1) {
                // add it to our keys array
                keys.push(key);
                // push this item to our final output array
                output.push(item);
            }
        });
        // return our array which should be devoid of
        // any duplicates
        return output;
    };
});

app.filter('filterData', function ($filter) {
    return function (collection, keyname, calendar) {

        var array = $filter('filter')(collection, {
            ValueItemName: keyname
        });

        angular.forEach(calendar, function (c, key) {
            
            var a = array.map(function(x){return x.Day});
            //var index = array.findIndex(x => x.Day==c.Day)
            var index = a.indexOf(c.Day);
            if (index === -1){
                array.push(c);
            }           
        });

        return $filter('orderBy')(array, 'Day', false);
    };
});

app.filter('hours',function(){
    return function (value) {
        try {
            
            var num = Math.abs(value);
            var hours = Math.floor(num / 60);
            var minutes = num % 60;

            if (value<0){
                return '-' + pad(hours,2) + ":" + pad(minutes, 2);
            }
            return pad(hours,2) + ":" + pad(minutes, 2);

        } catch (error) {
            return '';
        }
    }
});

app.filter('formatHours',function(){
    return function (value) {
        try {           
            return pad(value,2) + ":" + pad('', 2);   
        } catch (error) {
            return '';
        }
    }
});
