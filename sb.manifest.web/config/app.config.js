'use strict';

var app = angular.module('SbManifest');

app.constant('config', {
    appName: 'Skydive Bovec Manifest',
    appVersion: '0.01',
    //authApi: 'https://admiral.hit.si/Hit.AuthApi',
    //hrDocApi: 'https://localhost:44320'
    manifestApi: 'https://localhost:44327'
});
