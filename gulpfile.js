'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var bourbon = require('node-bourbon');
var connect = require('gulp-connect');

var sassOptions = {
    includePaths: bourbon.includePaths,
    outputStyle: 'compressed'
};

var paths = {
    sass: './sass/**/*.sass'
};

gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('serve', function () {
    connect.server();
});

gulp.task('default', ['sass', 'watch', 'serve']);
