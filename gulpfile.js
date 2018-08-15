"use strict";
const gulp = require("gulp"),
  babel = require("gulp-babel"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  maps = require("gulp-sourcemaps"),
  del = require("del"),
  cleanCSS = require("gulp-clean-css");

gulp.task("concatScripts", () => {
  return gulp
    .src("js/circle/*.js")
    .pipe(maps.init())
    .pipe(concat("app.js"))
    .pipe(maps.write())
    .pipe(gulp.dest("js"));
});

gulp.task(
  "scripts",
  gulp.series("concatScripts", () => {
    return gulp
      .src("js/app.js")
      .pipe(uglify())
      .pipe(rename("app.min.js"))
      .pipe(gulp.dest("dist/scripts"));
  })
);

gulp.task("compileSass", () => {
  return gulp
    .src(["./sass/**/**/*.scss", "./sass/*.scss"])
    .pipe(maps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(maps.write())
    .pipe(gulp.dest("./css"));
});

gulp.task(
  "styles",
  gulp.series("compileSass", () => {
    return gulp
      .src("css/global.css")
      .pipe(cleanCSS())
      .pipe(rename("all.min.css"))
      .pipe(gulp.dest("dist/styles"));
  })
);

gulp.task("clean", () => {
  del(["dist", "css", "js/app*.js*"]);
});
