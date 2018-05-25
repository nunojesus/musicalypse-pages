var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', gulp.series(function(done) {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./vendor/bootstrap'))

  // Font Awesome
  gulp.src([
      './node_modules/font-awesome/**/*',
      '!./node_modules/font-awesome/{less,less/*}',
      '!./node_modules/font-awesome/{scss,scss/*}',
      '!./node_modules/font-awesome/.*',
      '!./node_modules/font-awesome/*.{txt,json,md}'
    ])
    .pipe(gulp.dest('./vendor/font-awesome'))

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'))

  // jQuery Easing
  gulp.src([
      './node_modules/jquery.easing/*.js'
    ])
    .pipe(gulp.dest('./vendor/jquery-easing'))

  // Simple Line Icons
  gulp.src([
      './node_modules/simple-line-icons/fonts/**',
    ])
    .pipe(gulp.dest('./vendor/simple-line-icons/fonts'))

  gulp.src([
      './node_modules/simple-line-icons/css/**',
    ])
    .pipe(gulp.dest('./vendor/simple-line-icons/css'))

  gulp.src([
      './node_modules/html5-device-mockups/dist/**',
    ])
    .pipe(gulp.dest('./vendor/html5-device-mockups/css'))

  gulp.src([
      './node_modules/html5-device-mockups/device-mockups/**',
    ])
    .pipe(gulp.dest('./vendor/html5-device-mockups/device-mockups'))

  done();

}));

// Compile SCSS
gulp.task('css:compile', gulp.series(function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css'))
}));

// Minify CSS
gulp.task('css:minify', gulp.series(['css:compile'], function() {
  return gulp.src([
      './css/*.css',
      '!./css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
}));

// CSS
gulp.task('css', gulp.series(['css:compile', 'css:minify']));

// Minify JavaScript
gulp.task('js:minify', gulp.series(function() {
  return gulp.src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
}));

// JS
gulp.task('js', gulp.series(['js:minify']));

// Default task
gulp.task('default', gulp.parallel(['css', 'js', 'vendor']));

// Configure the browserSync task
gulp.task('browserSync', gulp.series(function() {
  return browserSync.init({
    server: {
      baseDir: "./"
    }
  });
}));

// Dev task
gulp.task('dev', gulp.parallel(['css', 'js', 'browserSync'], function() {
  gulp.watch('./scss/*.scss', gulp.series('css'));
  gulp.watch('./js/*.js', gulp.series('js'));
  gulp.watch('./*.html', browserSync.reload);
}));

// Build
gulp.task('build', gulp.series(['default'], function(done) {
  gulp.src(['./vendor/**/*']).pipe(gulp.dest('./dist/vendor'))
  gulp.src(['./img/*']).pipe(gulp.dest('./dist/img'))
  gulp.src(['./js/*']).pipe(gulp.dest('./dist/js'))
  gulp.src(['./css/*']).pipe(gulp.dest('./dist/css'))
  gulp.src(['./index.html']).pipe(gulp.dest('./dist'))
  done()
}))
