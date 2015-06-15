// Main Gulp
"use strict";

var gulp = require("gulp");
// Custom Gulp tasks
var clean = require("gulp-clean");
var watch = require("gulp-watch");
var jade = require("gulp-jade");
var scss = require("gulp-sass");
var concat = require("gulp-concat");
var plumber = require("gulp-plumber");
var gulpif = require("gulp-if");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
// Paths
var paths = {};
paths.app = "app/";
paths.dist = "dist/";

paths.scss = paths.app + "styles/**/*.scss";
paths.fonts = paths.app + "fonts/**/*.*";
paths.images = paths.app + "images/**/*.*";
paths.scripts = paths.app + "scripts/**/*.js";
paths.templates = paths.app + "templates/**/*.*";
paths.vendor = paths.app + "vendor/**/*.*";

// Delete the dist directory
gulp.task("clean", function () {
    return gulp.src(paths.dist).pipe(clean());
});

gulp.task("jade", function () {
    return gulp.src(paths.templates).pipe(plumber()).pipe(jade({ pretty: true })).pipe(gulp.dest(paths.dist + "templates/")).pipe(gulpif(paths.dist, reload({ stream: true })));
});

gulp.task("scss", function () {
    return gulp.src(paths.app + "styles/main.scss").pipe(plumber()).pipe(scss({ style: "expanded" })).pipe(gulp.dest(paths.dist + "styles/")).pipe(gulpif(paths.dist, reload({ stream: true })));
});

// Copy scripts
gulp.task("copyScripts", function () {
    gulp.src(paths.scripts).pipe(concat("application.js")).pipe(gulp.dest(paths.dist + "scripts/"));
});
// Copy vendor
gulp.task("copyVendor", function () {
    gulp.src(paths.vendor).pipe(gulp.dest(paths.dist + "vendor/"));
});
// Copy fonts
gulp.task("copyFonts", function () {
    gulp.src(paths.fonts).pipe(gulp.dest(paths.dist + "fonts/"));
});
// Copy images
gulp.task("copyImages", function () {
    gulp.src(paths.images).pipe(gulp.dest(paths.dist + "images/"));
});

// Server
gulp.task("browser-sync", function () {
    browserSync({
        server: {
            baseDir: paths.dist
        },
        notify: false
    });
});

// Copy all assets
gulp.task("copy", ["copyVendor", "copyFonts", "copyImages", "copyScripts"]);

// Default
gulp.task("dist", ["jade", "scss", "copy"]);

// Watch
gulp.task("default", ["dist", "browser-sync"], function () {
    gulp.watch(paths.templates, ["jade", browserSync.reload]);
    gulp.watch(paths.scss, ["scss", browserSync.reload]);
    gulp.watch(paths.images, ["copyImages", browserSync.reload]);
    gulp.watch(paths.scripts, ["copyScripts", browserSync.reload]);
    gulp.watch(paths.fonts, ["copyFonts", browserSync.reload]);
});

