'use strict';

var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    notify       = require('gulp-notify'),
    cleanCSS     = require('gulp-clean-css'),
    runSequence  = require('run-sequence'),
    csscomb      = require('gulp-csscomb'),
    sourcemaps   = require('gulp-sourcemaps'),
    gcmq         = require('gulp-group-css-media-queries');

gulp.task('comb', function () {
  return gulp.src('app/scss/**/*.scss')
  .pipe(csscomb('.csscomb.json').on('error', notify.onError(function (error) {
    return 'File: ' + error.message;
  })))
  .pipe(gulp.dest('app/scss'));
});

gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'expanded'}).on('error', notify.onError(function (error) {
    return 'File: ' + error.message;
  })))
  .pipe(gcmq())
  .pipe(autoprefixer(['last 5 versions', '> 1%'], { cascade: false }))
  .pipe(notify({
    message: 'Compiled!',
    sound: true
  }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts-libs', function() {
  return gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
    'app/libs/bootstrap/dist/js/bootstrap.bundle.min.js',
    'app/libs/bootstrap/dist/js/bootstrap.min.js',
    'app/libs/Flot/jquery.flot.js',
    'app/libs/Flot/jquery.flot.pie.js',
    'app/libs/moment/min/moment.min.js'
  ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'))
});

gulp.task('scripts-min-form', function() {
  return gulp.src('app/js/form.js')
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/js'))
});

gulp.task('scripts-min-companies', function() {
  return gulp.src('app/js/companies.js')
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/js'))
});

gulp.task('css-libs', ['sass'], function() {
  return gulp.src('app/css/libs.css')
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'))
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app',
      // index: "companies.html"
    },
    notify: false
  });
});

gulp.task('minify', function () {
  return gulp.src([
    'app/css/form.css',
    'app/css/companies.css'])
    .pipe(cleanCSS({ specialComments: 'false' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/css'))
      .on('end', ()=> {
        if( true )
          console.log('---   completed successfully   ---   MINIFY');
      });
});

gulp.task('compile', function (callback) {
  runSequence('comb', 'sass', 'minify', callback);
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('clear', function (callback) {
  return cache.clearAll();
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
  .pipe(gulp.dest('dist/img'));
});


gulp.task('watch', ['browser-sync', 'sass', 'compile', 'css-libs', 'scripts-libs', 'scripts-min-companies', 'scripts-min-form'], function() {
  gulp.watch('app/scss/**/*.scss', ['compile']).on('change', browserSync.reload);
  gulp.watch('app/**/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass', 'minify'], function() {

  var buildCss = gulp.src([
                            'app/css/companies.min.css',
                            'app/css/form.min.css',
                            'app/css/libs.min.css'
                          ])
  .pipe(gulp.dest('dist/css'))

  var buildFontAwesome = gulp.src('app/libs/components-font-awesome/webfonts/*')
  .pipe(gulp.dest('dist/webfonts'))

  var buildJs = gulp.src([
                          'app/js/companies.min.js',
                          'app/js/form.min.js',
                          'app/js/libs.min.js'])
  .pipe(gulp.dest('dist/js'))

  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));

});

gulp.task('default', ['watch']);