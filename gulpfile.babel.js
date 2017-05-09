
import gulp from 'gulp';
import babel from 'gulp-babel';
import jasmine from 'gulp-jasmine';
import path from 'path';
import nodemon from 'gulp-nodemon';
import istanbul from 'gulp-istanbul';
import coveralls from 'gulp-coveralls';
import exit from 'gulp-exit';



// this transpiles all .js files except those in dist and node_modules folders
gulp.task('babel', () => {
  return gulp.src(['./**/*.js', '!dist/**', '!node_modules/**', '!gulpfile.babel.js', '!coverage/**'])
  .pipe(babel())
  .pipe(gulp.dest('dist'));
});

// this runs the jasmine tests through an already transpiled file
gulp.task('run-tests', ['babel'], () => {
  gulp.src(path.join('dist', 'tests', 'inverted-index-test.js'))
  .pipe(jasmine())
  .pipe(exit());
});

// this starts the server at the specified port in .env file
gulp.task('serve', ['babel'], () => {
  nodemon({
    script: path.join('dist', 'server.js'),
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  });
});

// the coverage task depends on 'pre-test' and 'test' to give coverage report
gulp.task('pre-test', () => {
  return gulp.src([path.join('dist', 'src', 'inverted-index.js')])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], () => {
  return gulp.src([path.join('dist', 'tests', 'inverted-index-test.js')])
    .pipe(jasmine())
    .pipe(istanbul.writeReports());
});

gulp.task('coverage', ['test'], () => {
  gulp.src('coverage/**/lcov.info')
    .pipe(coveralls());
});

