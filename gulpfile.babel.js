// const gulp = require('gulp');

import gulp from 'gulp';
import babel from 'gulp-babel';
import jasmine from 'gulp-jasmine';

// const jasmine = require('gulp-jasmine');
const nodemon = require('gulp-nodemon');
const istanbul = require('gulp-istanbul');
const coveralls = require('gulp-coveralls');
// const babel = require('gulp-babel');


gulp.task('run-tests', () => {
  gulp.src('tests/inverted-index-test.js')
  .pipe(babel())
  .pipe(jasmine());
});

gulp.task('serve', () => {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  });
});

/*gulp.task('coverage', () => {
    return gulp.src('src/inverted-index.js')
      .pipe(istanbul({includeUntested: true}))
      .on('finish', () => {
        gulp.src('tests/inverted-index-test.js')
          .pipe(jasmine())
          .pipe(istanbul.writeReports({
            dir: 'coverage-report',
            reporters: ['lcov'],
            reportOpts: { dir: 'coverage-report'}
          }));
      });
});*/


// for coverage task
gulp.task('pre-test', () => {
  return gulp.src(['src/inverted-index.js'])
    .pipe(babel())
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], () => {
  return gulp.src(['tests/inverted-index-test.js'])
    .pipe(babel())
    .pipe(jasmine())
    .pipe(istanbul.writeReports());
});

gulp.task('coverage', ['test'], () => {
  gulp.src('test/coverage/**/lcov.info')
    .pipe(coveralls());
});


gulp.task('default', ['coverage'], () => {

});
