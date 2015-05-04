var gulp = require('gulp'),
	zip = require('gulp-zip'),
	es = require('event-stream'),
	watch = require('gulp-watch');

var srcWithDeps = function() {
	var src = gulp.src('src/*');
	var filesaver = gulp.src('bower_components/file-saver.js/FileSaver.js');
	var jquery = gulp.src('bower_components/jquery/dist/jquery.min.js');
    return es.merge(src, filesaver, jquery);
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