﻿'use strict';

var app = angular.module('SbManifest');

app.constant('config', {
    appName: 'Skydive Bovec Manifest Display',
    appVersion: '1.00',
    manifestApi:'http://localhost:5000',
    displayHub: 'http://localhost:5000/display'
});
