// load all the separate gulp files
require('require-dir')('./gulp');
var gulp = require('gulp');

gulp.task('dev:server', ['lint:server', 'test:server']);
