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

//compiles and minifies sass files
export function styles() {
  return gulp
    .src("./sass/global.scss")
    .pipe(rename("all.min.css"))
    .pipe(maps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(maps.write())
    .pipe(gulp.dest("dist/styles"));
}

//compiles and minifies js files
export function scripts() {
  return gulp
    .src(["js/*.js", "js/circle/*.js"])
    .pipe(maps.init())
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(maps.write())
    .pipe(gulp.dest("dist/scripts"));
}

//compresses images
function images() {
  return gulp
    .src("images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/content"));
}

//copies HTML to dist folder
function html() {
  return gulp.src("index.html").pipe(gulp.dest("dist"));
}

//injects paths to scripts and stylsheets to HTML head
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

//launches a live server on port 3000
function server() {
  connect.server({
    root: "dist",
    livereload: true,
    port: 3000
  });
  opn(`http://localhost:3000/`);
}

//allows for live reload on any changes
const liveReload = () => gulp.src("./").pipe(connect.reload());

//watches for changes to sass files
function watch() {
  gulp.watch(["sass/circle/**/*", "sass/*"], gulp.series(styles, liveReload));
}

//allows for gulp build to run all task
export const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts, html, images),
  index,
  gulp.parallel(server, watch)
);

//sets gulp to default build command
export default build;
