"use strict";
const gulp = require("gulp"),
  babel = require("gulp-babel"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  maps = require("gulp-sourcemaps"),
  del = require("del");

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
  gulp.series("concatScripts", function() {
    return gulp
      .src("js/app.js")
      .pipe(uglify())
      .pipe(rename("app.min.js"))
      .pipe(gulp.dest("dist/scripts"));
  })
);

gulp.task("clean", () => {
  del(["dist", "css/application.css*", "js/app*.js*"]);
});
