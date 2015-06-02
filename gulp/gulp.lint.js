var gulp = require('gulp');
var $ = plugins = require('gulp-load-plugins')();
var config = require('./gulp.config').config;

gulp.task('lint:server', function() {
  gulp.watch(config.js.server, ['lint:server:task']);
});

gulp.task('lint:server:task', function() {
  return lint(config.js.server);
});

function lint(src) {
  return gulp.src(src)
    .pipe($.jshint('./.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.notify({
      onLast: false,
      message: function(file) {
        if (file.jshint.success) {
          // Don't show something if success
          return false;
        }

        return file.relative + ' (' + file.jshint.results.length + ' errors)\n';
      },

      sound: 'Submarine'
    }));
}
