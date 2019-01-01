var gulp = require("gulp");
var sass = require("gulp-sass");
var webserver = require("gulp-webserver");
var uglify = require("gulp-uglify")
var fs = require("fs");
var path = require("path");
var url = require("url");
var babel = require("gulp-babel")
var clean = require("gulp-clean-css");
var htmlmin = require("gulp-htmlmin")

//编译
gulp.task("sass", function() {
    return gulp.src("./src/scss/style.scss")
        .pipe(sass())
        .pipe(gulp.dest("./src/css"))
});

//监听
gulp.task("watchs", function() {
    return gulp.watch("./src/scss/style.scss", gulp.series("sass"))
})

//压缩
gulp.task("uglify", function() {
    return gulp.src("./src/js/*.js")
        .pipe(babel({
            presets: "es2015"
        }))
        .pipe(uglify())
        .pipe(gulp.dest("./build/js"))
})
gulp.task("uglifys", function() {
    return gulp.src("./src/libs/*.js")
        .pipe(babel({
            presets: "es2015"
        }))
        .pipe(uglify())
        .pipe(gulp.dest("./build/libs"))
})
gulp.task("clean", function() {
    return gulp.src("./src/css/*.css")
        .pipe(clean())
        .pipe(gulp.dest("./build/css"))
})
gulp.task("htmlmin", function() {
    return gulp.src("./src/*.html")
        .pipe(gulp.dest("./build"))
})

//线上
gulp.task("all", gulp.series("uglify", "uglifys", "clean", "htmlmin"))

//起服务
gulp.task("web", function() {
    return gulp.src("./src")
        .pipe(webserver({
            port: 8989,
            middleware: function(req, res) {
                var pathname = url.parse(req.url).pathname;
                if (pathname == "/favicon.ico") {
                    res.end("");
                    return;
                }
                pathname = pathname == "/" ? "index.html" : pathname;
                res.end(fs.readFileSync(path.join(__dirname, "src", pathname)))
            }
        }))
})