const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const nodemon = require('gulp-nodemon');

gulp.task('run-tests', () => {
  gulp.src('tests/inverted-index-test.js')
  .pipe(jasmine());
});

gulp.task('serve', () => {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  });
});


/*   gulp.task('jasmine', function () {
        return gulp.src('tests/inverted-index-test.js')
                .pipe(cover.instrument({
                    pattern: ['server.js'],
                    debugDirectory: 'debug'
                }))
                .pipe(jasmine())
                .pipe(cover.gather())
                .pipe(cover.format())
                .pipe(gulp.dest('reports'));
    });*/
