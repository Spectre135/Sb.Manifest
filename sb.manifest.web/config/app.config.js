﻿'use strict';

var app = angular.module('SbManifest');

app.constant('config', {
    appName: 'Skydive Bovec Manifest',
    appVersion: '1.00',
    manifestApi:'http://localhost:5000',
    alertHub: 'http://localhost:5000/alert'
});
