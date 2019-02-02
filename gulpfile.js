var gulp = require('gulp'),
	zip = require('gulp-zip'),
	es = require('event-stream'),
	watch = require('gulp-watch');

var srcWithDeps = function() {
	var src = gulp.src('src/*');
	var jquery = gulp.src('node_modules/jquery/dist/jquery.min.js');
	var i18next = gulp.src('node_modules/i18next/i18next.min.js');
	var icons = gulp.src('resources/icons/*');
  return es.merge(src, jquery, i18next, icons);
};

gulp.task('build', function () {
    return srcWithDeps()
        .pipe(gulp.dest('build'))
        .pipe(watch('src/*'))
        .pipe(gulp.dest('build'))
});

gulp.task('default', function () {
    return srcWithDeps()
        .pipe(zip('anki-leo.zip'))
        .pipe(gulp.dest('dist'));
});
