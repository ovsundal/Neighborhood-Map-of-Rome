/**
 * Created by ove on 19/08/2017.
 */
let gulp = require('gulp');
let htmlmin = require('gulp-htmlmin');
let cleanCSS = require('gulp-clean-css');
let concat = require('gulp-concat');
let jsmin = require('gulp-jsmin');
let rename = require('gulp-rename');

gulp.task('default', ['html-minify', 'watch:html', 'css-minify', 'watch:css', 'js-min', 'watch:js']);

//HTML minify
gulp.task('html-minify', () => {
    return gulp.src('src/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('docs/'))
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
        .pipe(gulp.dest('docs/css'))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('watch:css', () => {
    gulp.watch('src/css/*.css', ['css-minify']);
});

gulp.task('js-min', () => {
    gulp.src('./src/js/script.js')
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('src/js/'))
        .pipe(gulp.dest('docs/js/'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('watch:js', () => {
    gulp.watch('src/js/*.js', ['js-min']);
});
