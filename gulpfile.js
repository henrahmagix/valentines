'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var bourbon = require('node-bourbon');
var connect = require('gulp-connect');
var ghPages = require('gulp-gh-pages');

var paths = {
    src: './src',
    lib: './src/lib',
    css: './src/css',
    scripts: './src/scripts',
    sass: './sass',
    dist: './dist'
};
var files = {
    src: paths.src + '/**/*',
    sass: paths.sass + '/**/*.sass',
    css: paths.css + '/**/*.css',
    html: paths.src + '/**/*.html',
    scripts: paths.scripts + '/**/*.js'
};

var watchFiles = [files.css, files.html, files.scripts];

gulp.task('sass', function () {
    return gulp.src(files.sass)
        .pipe(
            sass({
                includePaths: bourbon.includePaths,
                outputStyle: 'compressed'
            })
            .on('error', sass.logError))
        .pipe(gulp.dest(paths.css));
});

gulp.task('watch', function () {
    gulp.watch(files.sass, ['sass']);
    gulp.watch(watchFiles, ['livereload']);
});

gulp.task('livereload', function () {
    return gulp.src(watchFiles)
        .pipe(connect.reload());
});

gulp.task('serve', function () {
    return connect.server({
        root: paths.src,
        livereload: true
    });
});

// Make sure the CSS is compiled.
gulp.task('dist', ['sass']);

gulp.task('deploy', function () {
    return gulp.src(files.src)
        .pipe(ghPages({
            force: true
        }));
});

gulp.task('default', ['sass', 'watch', 'serve']);
