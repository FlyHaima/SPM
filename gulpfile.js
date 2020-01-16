var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var cleanCSS = require('gulp-clean-css')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var browserSync = require('browser-sync').create()
var plumber = require('gulp-plumber')
var notify = require('gulp-notify')
var plumberOptions = {
  errorHandler: notify.onError('Error:<%= error.message %>')
}

// 样式编译
gulp.task('sass', function () {
  var array = [
    `./src/utils/css/style.scss`
  ]
  gulp.src(array)
    .pipe(plumber(plumberOptions))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 20 versions', 'ie > 8']
    }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./static/css'))
    .pipe(browserSync.stream())
})


// 开发用
gulp.task('server', ['sass'], function () {
  browserSync.init({
    server: './',
    // proxy: '127.0.0.1:8080'
  })
  gulp.watch('./src/utils/css/**/*.scss', ['sass'])
})


// 默认任务即为发布
gulp.task('default', ['server'])
