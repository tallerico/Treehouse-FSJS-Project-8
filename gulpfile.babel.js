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
import connect from "gulp-connect";
import opn from "opn";
import del from "del";

export const clean = () => del(["css", "dist"]);

// function compileSass() {
//   return gulp
//     .src("sass/global.scss")
//     .pipe(maps.init())
//     .pipe(sass().on("error", sass.logError))
//     .pipe(maps.write())
//     .pipe(rename("global.css"))
//     .pipe(gulp.dest("css"));
// }

export function styles() {
  return gulp
    .src("./sass/global.scss")
    .pipe(rename("all.min.css"))
    .pipe(maps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(maps.write())
    .pipe(gulp.dest("dist/styles"));
}

// export const styles = gulp.series(compileSass, minifyStyles);

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

  return target
    .pipe(
      inject(
        gulp.src(["**/scripts/*.min.js", "**/styles/*.min.css"], {
          read: false
        }),
        { relative: true }
      )
    )
    .pipe(gulp.dest("dist"));
}

function server() {
  connect.server({
    root: "dist",
    livereload: true
  });
  opn(`http://localhost:8080/`);
}

const liveReload = () => gulp.src("./").pipe(connect.reload());

function watch() {
  gulp.watch(["sass/circle/**/*", "sass/*"], gulp.series(styles, liveReload));
}

export const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts, html, images),
  index,
  gulp.parallel(server, watch)
);

export default build;
