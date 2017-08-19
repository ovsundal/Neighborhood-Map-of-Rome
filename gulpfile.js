/**
 * Created by ove on 19/08/2017.
 */
let gulp = require('gulp');
let htmlmin = require('gulp-htmlmin');
let cleanCSS = require('gulp-clean-css');
let concat = require('gulp-concat');
let minifyjs = require('gulp-js-minify');

gulp.task('default', ['html-minify', 'watch:html', 'css-minify', 'watch:css', 'js-minify', 'watch:js']);

//HTML minify
gulp.task('html-minify', () => {
    return gulp.src('src/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch:html', () => {
    gulp.watch('src/*.html', ['html-minify']);
});

//CSS minify
gulp.task('css-minify', () => {
    return gulp.src(['src/css/simple-sidebar.css', 'src/css/style.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('src/css/'))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('watch:css', () => {
    gulp.watch('src/css/*.css', ['css-minify']);
});

//JS minify
gulp.task('js-minify', () => {
    gulp.src(['src/js/script.js'])
        .pipe(minifyjs())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('watch:js', () => {
    gulp.watch('src/js/*.js', ['js-minify']);
});