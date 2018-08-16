import gulp from "gulp";
import babel from "gulp-babel";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import sass from "gulp-sass";
import maps from "gulp-sourcemaps";
import rename from "gulp-rename";
import cleanCSS from "gulp-clean-css";
import imagemin from "gulp-imagemin";
import inject from "gulp-inject";
import del from "del";

export const clean = () => del(["css", "dist"]);

function compileSass() {
  return gulp
    .src(["./sass/**/**/*.scss", "./sass/*.scss"])
    .pipe(maps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(maps.write())
    .pipe(rename("global.css"))
    .pipe(gulp.dest("css"));
}

function minifyStyles() {
  return gulp
    .src(["css/global.css"])
    .pipe(cleanCSS())
    .pipe(rename("all.min.css"))
    .pipe(gulp.dest("dist/styles"));
}

export const styles = gulp.series(compileSass, minifyStyles);

function concatScripts() {
  return gulp
    .src("js/circle/*.js")
    .pipe(maps.init())
    .pipe(concat("global.js"))
    .pipe(maps.write())
    .pipe(gulp.dest("js"));
}

function minifyScripts() {
  return gulp
    .src("js/global.js")
    .pipe(uglify())
    .pipe(rename("app.min.js"))
    .pipe(gulp.dest("dist/scripts"));
}

export const scripts = gulp.series(concatScripts, minifyScripts);

function images() {
  return gulp
    .src("images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/content"));
}

function html() {
  return gulp.src("index.html").pipe(gulp.dest("dist"));
}

function index() {
  const target = gulp.src("dist/index.html");
  const sources = gulp.src(["**/scripts/*.min.js", "**/styles/*.min.css"], {
    read: false
  });

  return target.pipe(inject(sources)).pipe(gulp.dest("dist"));
}

function watch() {
  gulp.watch("sass/circle/**/*.scss", styles);
}

export const build = gulp.series(
  clean,
  html,
  gulp.parallel(styles, scripts),
  images,
  index,
  watch
);

export default build;
