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
    .src(["./js/circle/*.js"])
    .pipe(maps.init())
    .pipe(concat("global.js"))
    .pipe(maps.write())
    .pipe(gulp.dest("dist"));
});

gulp.task("minify", () => {});

gulp.task("clean", function() {
  del(["dist", "css/application.css*", "js/app*.js*"]);
});
