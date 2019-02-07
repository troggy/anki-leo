var gulp = require('gulp');
var zip = require('gulp-zip');
var watch = require('gulp-watch');

const sources = ['src/**/*', '!src/**/*.test.js'];

gulp.task('build', function () {
    return gulp.src(sources)
        .pipe(gulp.dest('build'))
        .pipe(watch('src/*'))
        .pipe(gulp.dest('build'))
});

gulp.task('default', function () {
    return gulp.src(sources)
        .pipe(zip('anki-leo.zip'))
        .pipe(gulp.dest('dist'));
});
