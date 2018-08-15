"use strict";
const gulp = require("gulp"),
  babel = require("gulp-babel"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  maps = require("gulp-sourcemaps"),
  del = require("del"),
  cleanCSS = require("gulp-clean-css"),
  imagemin = require("gulp-imagemin"),
  inject = require("gulp-inject");

gulp.task("concatScripts", () => {
  return gulp
    .src("js/circle/*.js")
    .pipe(maps.init())
    .pipe(concat("global.js"))
    .pipe(maps.write())
    .pipe(gulp.dest("js"));
});

gulp.task(
  "scripts",
  gulp.series("concatScripts", () => {
    return gulp
      .src("js/global.js")
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

gulp.task("images", () => {
  return gulp
    .src("images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/content"));
});

gulp.task("html", () => {
  return gulp.src("index.html").pipe(gulp.dest("dist"));
});

gulp.task("index", () => {
  const target = gulp.src("dist/index.html");
  const sources = gulp.src(["scripts/*.min.js", "styles/*.min.css"], {
    read: false
  });

  return target.pipe(inject(sources)).pipe(gulp.dest("./dist"));
});

gulp.task("clean", () => {
  return del(["dist", "css", "src"]);
});

gulp.task(
  "build",
  gulp.series("clean", "html", "scripts", "styles", "images", "index")
);
