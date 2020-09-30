'use strict';

var gulp = require("gulp");
var gutil = require("gulp-util");
var concat = require("gulp-concat");
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var ngAnnotate =  require('gulp-ng-annotate');
//var pipeline = require('readable-stream').pipeline;
var clean = require('gulp-rimraf');
var timeStamp = ((new Date()).getTime());
var prodmin = 'app.' + timeStamp;
var prodJSMin = prodmin + '-min.js';
var prodCssMin = 'bundle.' + timeStamp + '-min.css'; //damo v assets če ne so fonti narobe
var del = require('del');
var strip = require('gulp-strip-comments'); //odstrani komentarje

// seznam js datotek po pravilnem vrstnem redu
var jsAssets = [
    'app/min/app.module.js',
    'app/min/app.routes.js',
    'app/min/app.service.js',
    'app/min/app.directives.js',
    'app/min/app.filters.js',
    'app/min/app.error.js', 
    'app/min/app.utils.js',
    'app/min/mainCtrl.js',
    'app/min/homeCtrl.js',
    'app/min/payrollCtrl.js',
    'app/min/dduCtrl.js',
    'app/min/malicaCtrl.js',
    'app/min/settingsCtrl.js',
    'app/min/prijavaCtrl.js',
    'app/min/tokenCtrl.js',
    'app/min/userCtrl.js'
];

// seznam css datotek po pravilnem vrstnem redu
var cssAssets = [
    'assets/css/min/bootstrap.min.css',
    'assets/css/min/all.min.css',
    'assets/css/min/normalize.css',
    'assets/css/min/template.css',
    'assets/css/min/angular-material.min.css',
    'assets/css/min/md-data-table.min.css',
    'assets/css/intlTelInput.min.css',
    'assets/css/min/sidebar-themes.css',
    'assets/css/min/main.css',
    'assets/css/min/prijava.css',
    'assets/css/min/ddu.css',
];

// Ostali fajli
var fajli = [
    'favicon.png',
    'manifest.json'
];

gulp.task('pocisti', function () {
    return gulp.src('dist/**', {
        read: false
    }).pipe(clean());
});

gulp.task('pocisti-vse', function () {
    return del(['dist/**', '!dist'], {
        force: true
    });
});


gulp.task('min-css', function () {
        return gulp.src(cssAssets)
        .pipe(concat(prodCssMin)).on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist/assets/css/'));    
});

gulp.task('min-js', function () {
    return gulp.src(jsAssets)
        .pipe(concat(prodJSMin)).on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(ngAnnotate({
            // true helps add where @ngInject is not used. It infers.
            // Doesn't work with resolve, so we must be explicit there
            add: true
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('preimenuj', function () {
    return gulp.src('index.html')
        .pipe(htmlreplace({
            'css': 'assets/css/' + prodCssMin,
            'app': prodJSMin
        }))
        .pipe(strip())
        .pipe(gulp.dest('dist/'));
});

gulp.task('kopiraj-assets', function () {
    return gulp.src('assets/**/*')
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('kopiraj-app', function () {
    return gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist/app'));
});

gulp.task('kopiraj-config', function () {
    return gulp.src('config/**/*')
        .pipe(gulp.dest('dist/config'));

});

gulp.task('kopiraj-base', function () {
    return gulp.src(fajli)
        .pipe(gulp.dest('dist/'));
});

gulp.task('pocisti-min', function () {
    return del(['dist/assets/css/min/'], {
        force: true
    });
});


gulp.task('test', done => {
    console.log("Test!");
    done();
});

gulp.task('prod', gulp.series(['pocisti-vse', 'min-css', 'min-js', 'preimenuj', 'kopiraj-assets', 'kopiraj-app', 'kopiraj-base', 'pocisti-min']), function () {
    // do something
});