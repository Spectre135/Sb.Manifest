"use strict";var gulp=require("gulp"),gutil=require("gulp-util"),concat=require("gulp-concat"),htmlreplace=require("gulp-html-replace"),replace=require("gulp-replace"),uglify=require("gulp-uglify-es").default,ngAnnotate=require("gulp-ng-annotate"),clean=require("gulp-rimraf"),timeStamp=(new Date).getTime(),prodmin="app."+timeStamp,prodJSMin=prodmin+"-min.js",prodCssMin="bundle."+timeStamp+"-min.css",del=require("del"),strip=require("gulp-strip-comments"),jsAssets=["app/min/app.module.js","app/min/app.routes.js","app/min/app.service.js","app/min/app.directives.js","app/min/app.filters.js","app/min/app.error.js","app/min/app.utils.js","app/min/prijavaCtrl.js","app/min/mainCtrl.js","app/min/displayCtrl.js"],cssAssets=["assets/css/min/bootstrap.min.css","assets/css/min/all.min.css","assets/css/min/normalize.css","assets/css/min/template.css","assets/css/min/angular-material.min.css","assets/css/min/md-data-table.min.css","assets/css/min/sidebar-themes.css","assets/css/min/main.css","assets/css/min/prijava.css"],fajli=["favicon.png","manifest.json"];gulp.task("pocisti",(function(){return gulp.src("dist/**",{read:!1}).pipe(clean())})),gulp.task("pocisti-vse",(function(){return del(["dist/**","!dist"],{force:!0})})),gulp.task("kopiraj-assets",(function(){return gulp.src("assets/**/*").pipe(gulp.dest("dist/assets"))})),gulp.task("pocisti-css",(function(){return del(["dist/assets/css/**"],{force:!0})})),gulp.task("min-css",(function(){return gulp.src(cssAssets).pipe(concat(prodCssMin)).on("error",(function(err){gutil.log(gutil.colors.red("[Error]"),err.toString())})).pipe(gulp.dest("dist/assets/css/"))})),gulp.task("min-js",(function(){return gulp.src(jsAssets).pipe(concat(prodJSMin)).on("error",(function(err){gutil.log(gutil.colors.red("[Error]"),err.toString())})).pipe(ngAnnotate({add:!0})).pipe(uglify()).pipe(gulp.dest("dist/"))})),gulp.task("preimenuj",(function(){return gulp.src("index.html").pipe(htmlreplace({css:"assets/css/"+prodCssMin,app:prodJSMin})).pipe(replace("Refresh(1234567899)","Refresh("+timeStamp+")")).pipe(strip()).pipe(gulp.dest("dist/"))})),gulp.task("kopiraj-app",(function(){return gulp.src("app/**/*.html").pipe(gulp.dest("dist/app"))})),gulp.task("kopiraj-config",(function(){return gulp.src("config/**/*").pipe(gulp.dest("dist/config"))})),gulp.task("kopiraj-base",(function(){return gulp.src(fajli).pipe(gulp.dest("dist/"))})),gulp.task("kopiraj-messages",(function(){return gulp.src("messages/*.json").pipe(gulp.dest("dist/messages/"))})),gulp.task("test",done=>{console.log("Test!"),done()}),gulp.task("prod",gulp.series(["pocisti-vse","min-js","preimenuj","kopiraj-assets","pocisti-css","min-css","kopiraj-app","kopiraj-base","kopiraj-messages"]),(function(){}));