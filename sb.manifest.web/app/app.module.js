/* Main Module */
'use strict';

var app = angular.module('SbManifest', [
    'ui.router',
    'ngMaterial',
    'md.data.table',
    'md.time.picker',
    'ngMessages',
    'ui.bootstrap',
    'ngSanitize',
    'ngIntlTelInput',
    'ngCapsLock',
    'ngDragDrop',
    'mdColorPicker'
]);

app.run(function ($state, $rootScope, $mdDialog, apiService) {

    window.myAppErrorLog = [];

    //load messages for app
    apiService.getData('./messages/messages.json', null, false)
        .then(function (data) {
            $rootScope.messages = data;
        });

    $state.defaultErrorHandler(function (error) {
        // This is a naive example of how to silence the default error handler.
        window.myAppErrorLog.push(error);
    });

    //we check if user is authenticated
    if (sessionStorage.getItem('Authorization') === null) {
        $state.go('prijava'); // go to login
    }

    //alert dialog
    $rootScope.showDialog = function (title, message) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#main')))
            .clickOutsideToClose(true)
            .title(title)
            .textContent(message)
            .ariaLabel('Alert Dialog')
            .ok('Zapri!')
        );
    };

    //selected row for highlight on md-table click row
    $rootScope.setSelected = function (id) {
        $rootScope.IdSelected = id;
    };

    //Country flag src
    $rootScope.getFlagSrc = function(iso){
        if (iso){
           return 'assets/img/flags/' + iso + '.png'; 
        }
        return null;      
    };

    $rootScope.dragOptions = {
        opacity: 0.50,
        revert: function () {
            $(this).css({
                'top': '0px',
                'left': '0px'
            });
            return false;
        },
        revertDuration: 2500
    };

    $rootScope.dropOptions = {
        hoverClass: 'drop-hover'
    };

});

app.config(function ($mdDateLocaleProvider, $mdThemingProvider) {
    //themes
    //$mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();

    // Example of a French localization.
    var myShortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];
    $mdDateLocaleProvider.months = ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December'];
    $mdDateLocaleProvider.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];
    $mdDateLocaleProvider.days = ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', '\u010detrtek', 'Petek', 'Sobota'];
    $mdDateLocaleProvider.shortDays = ['Ned.', 'Pon.', 'Tor.', 'Sre.', '\u010Cet.', 'Pet.', 'Sob.'];

    // Can change week display to start on Monday.
    $mdDateLocaleProvider.firstDayOfWeek = 1;

    $mdDateLocaleProvider.formatDate = function (date) {
        return moment(date).format('DD.MM.YYYY');
    };

    // Allow only a day and month to be specified.
    // This is required if using the 'M/D' format with moment.js.
    $mdDateLocaleProvider.isDateComplete = function (dateString) {
        dateString = dateString.trim();

        // Look for two chunks of content (either numbers or text) separated by delimiters.
        var re = /^(([a-zA-Z]{3,}|[0-9]{1,4})([ .,]+|[/-]))([a-zA-Z]{3,}|[0-9]{1,4})/;
        return re.test(dateString);
    };

    $mdDateLocaleProvider.monthHeaderFormatter = function (date) {
        return myShortMonths[date.getMonth()] + ' ' + date.getFullYear();
    };

    // In addition to date display, date components also need localized messages
    // for aria-labels for screen-reader users.

    $mdDateLocaleProvider.weekNumberFormatter = function (weekNumber) {
        return 'Teden ' + weekNumber;
    };

    $mdDateLocaleProvider.msgCalendar = 'Kolendar';
    $mdDateLocaleProvider.msgOpenCalendar = 'Odpri kolendar';

});

app.config(function (ngIntlTelInputProvider) {
    ngIntlTelInputProvider.set({
        initialCountry: 'si',
        onlyCountries: ["si", "it", "at", "by", "be", "ba", "bg", "hr", "cz", "dk",
            "ee", "fo", "fi", "fr", "de", "gi", "gr", "va", "hu", "is", "ie", "it", "lv",
            "li", "lt", "lu", "mk", "mt", "md", "mc", "me", "nl", "no", "pl", "pt", "ro",
            "ru", "sm", "rs", "sk", "si", "es", "se", "ch", "ua", "gb"
        ]
    });
});

app.config(function ($mdProgressCircularProvider) {
    $mdProgressCircularProvider.configure({
        strokeWidth: 5
    });
});
