const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postscc = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

function html() {
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

function css() {
  const plugins = [
    autoprefixer()
  ]
  return gulp.src(['src/blocks/**/*.css', 'src/vendor/*.css'])
    .pipe(plumber())
    .pipe(concat('bundle.css'))
    .pipe(postscc(plugins))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true }));
}

function images() {
  return gulp.src('src/images/*.{jpg,png,svg,gif,ico,webp,avif}', { encoding: false })
    .pipe(gulp.dest('dist/images/'))
    .pipe(browserSync.reload({ stream: true }));
}

function scripts() {
  return gulp.src('src/scripts/*.js')
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({ stream: true }));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/scripts/*.js'], scripts);
}

const build = gulp.series(clean, gulp.parallel(html, css, images, scripts));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.css = css;
exports.images = images;
exports.scripts = scripts;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;