var gulp = require('gulp');
var zip = require('gulp-zip');
var watch = require('gulp-watch');

gulp.task('build', function () {
    return gulp.src('src/**/*')
        .pipe(gulp.dest('build'))
        .pipe(watch('src/*'))
        .pipe(gulp.dest('build'))
});

gulp.task('default', function () {
    return gulp.src('src/**/*')
        .pipe(zip('anki-leo.zip'))
        .pipe(gulp.dest('dist'));
});
