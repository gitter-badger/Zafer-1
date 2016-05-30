var pathSeparator = "/";
var pathSource = "src" + pathSeparator;
var pathBuild = "build" + pathSeparator;

var dot = ".";
var pathUp = dot + dot + pathSeparator;
var pathRoot = pathUp + pathUp;
var constantClient = "client";
var constantServer = "server";

var pathSelf = dot + pathSeparator;
var projectInput = pathSelf + pathSource;
var projectOutput = pathSelf + pathBuild;

var gulp = require("gulp");
var gulpsync = require('gulp-sync')(gulp);

gulp.task('default', gulpsync.sync(["clean", "build:all"]), function () { });
gulp.task("clean:all", gulpsync.sync(["clean:libFolder", "clean:scriptsFolder", "clean:cssFolder", "clean:imagesFolder", "clean:documents", "clean:data"]), function () { });
gulp.task("build:all", gulpsync.sync(["build:libFolder", "build:scriptsFolder", "build:cssFolder", "build:imagesFolder", "build:documents", "build:data"]), function () { });

//#region Common
var rimraf = require("rimraf");

gulp.task("clean", function (input) {
    rimraf(projectOutput, input);
});
//#endregion

//#region LibFolder (Bower)
var bower = require("./bower.json");

var bowerPaths = {
    source: "./bower_components/",
    target: projectOutput + constantClient + "/lib/"
};

gulp.task("clean:libFolder", function (input) {
    rimraf(bowerPaths.target, input);
});

gulp.task("build:libFolder", function () {
    for (var bowerComponent in bower.exportsOverride) {
        for (var componentDirectories in bower.exportsOverride[bowerComponent]) {

            var destinationFolder = bowerPaths.target + bowerComponent + pathSeparator;
            if (componentDirectories !== "") destinationFolder += componentDirectories;

            var sourceFiles = bower.exportsOverride[bowerComponent][componentDirectories];
            var files = Array.isArray(sourceFiles) ? sourceFiles : [sourceFiles];
            var sourceFolderPrefix = bowerPaths.source + bowerComponent + pathSeparator;
            for (var file in files) {
                var sourceFolder = sourceFolderPrefix + files[file];

                gulp.src(sourceFolder).pipe(gulp.dest(destinationFolder));

            }
        }
    }
});
//#endregion

//#region ScriptsFolder (TypeScript)
var typescriptPaths = {
    serverConfig: projectInput + constantServer + "/scripts/tsconfig.json",
    serverSource: projectInput + constantServer + "/scripts/**/*.ts",
    serverTarget: projectOutput + constantServer + "/scripts/",
    serverSourceRoot: pathRoot + pathSource + constantServer + "/scripts/",

    clientConfig: projectInput + constantClient + "/scripts/standalone/tsconfig.json",
    clientSource: projectInput + constantClient + "/scripts/standalone/**/*.ts",
    clientTarget: projectOutput + constantClient + "/scripts/standalone",
    clientSourceRoot: pathRoot + pathSource + constantClient + "/scripts/standalone/",

    clientCommonConfig: projectInput + constantClient + "/scripts/tsconfig.json",
    clientCommonSource: [projectInput + constantClient + "/scripts/**/*.ts",
        "!" + projectInput + constantClient + "/standalone/**/*.ts"
    ],
    clientCommonTarget: projectOutput + constantClient + "/scripts/",
    clientCommonSourceRoot: pathRoot + pathSource + constantClient + "/scripts/",
};

var merge = require("merge2");
var gulpTypescript = require("gulp-typescript");
var gulpSourcemaps = require("gulp-sourcemaps");
var gulpConcat = require("gulp-concat");
var gulpUglify = require("gulp-uglify");
var gulpRename = require("gulp-rename");

gulp.task("clean:scriptsFolder", function (input) {
    rimraf(typescriptPaths.serverTarget, input);
    //x rimraf(typescriptPaths.clientTarget, input);
    rimraf(typescriptPaths.clientCommonTarget, input);
});

function scripts(config, source, sourceRoot, target, concatOutput) {
    var typescriptProject = gulpTypescript.createProject(config, { sortOutput: true });
    var typescriptResult = typescriptProject.src(source)
        .pipe(gulpSourcemaps.init({ loadMaps: true }))
        .pipe(gulpTypescript(typescriptProject));

    if (concatOutput === true) {
        return merge([
            typescriptResult.dts
                .pipe(gulpConcat("app.d.ts"))
                .pipe(gulp.dest(sourceRoot)),
            typescriptResult.js
                .pipe(gulpConcat("app.js"))
                //.pipe(gulpUglify({ outSourceMap: true, sourceRoot: sourceRoot }))
                //.pipe(gulpRename({extname: ".min.js"}))
                .pipe(gulpSourcemaps.write(dot, { includeContent: false, sourceRoot: sourceRoot }))
                .pipe(gulp.dest(target))
        ]);
    } else {
        return merge([
            typescriptResult.dts
                .pipe(gulp.dest(sourceRoot)),
            typescriptResult.js
                //.pipe(gulpUglify({ outSourceMap: true, sourceRoot: sourceRoot }))
                //.pipe(gulpRename({extname: ".min.js"}))
                .pipe(gulpSourcemaps.write(dot, { includeContent: false, sourceRoot: sourceRoot }))
                .pipe(gulp.dest(target))
        ]);
    }
}

gulp.task("build:scriptsFolder", function () {
    scripts(typescriptPaths.serverConfig, typescriptPaths.serverSource, typescriptPaths.serverSourceRoot, typescriptPaths.serverTarget, true)
    scripts(typescriptPaths.clientConfig, typescriptPaths.clientSource, typescriptPaths.clientSourceRoot, typescriptPaths.clientTarget, false)
    scripts(typescriptPaths.clientCommonConfig, typescriptPaths.clientCommonSource, typescriptPaths.clientCommonSourceRoot, typescriptPaths.clientCommonTarget, true)
});
//#endregion



//#region CssFolder (StyleSheets)
var gulpSass = require("gulp-sass");
var gulpMinifyCss = require("gulp-minify-css");

var sassPaths = {
    source: projectInput + constantClient + "/StyleSheets/**/*.scss",
    target: projectOutput + constantClient + "/css/",
    sourceRoot: pathRoot + pathSource + "stylesheets/"
};

gulp.task("clean:cssFolder", function (input) {
    rimraf(sassPaths.target, input);
});

gulp.task("build:cssFolder", function () {
    gulp.src(sassPaths.source)
        .pipe(gulpSourcemaps.init())
        .pipe(gulpSass())
        .pipe(gulpMinifyCss())
        .pipe(gulpSourcemaps.write(dot, { includeContent: false, sourceRoot: sassPaths.sourceRoot }))
        .pipe(gulp.dest(sassPaths.target));
});
//#endregion

//#region ImagesFolder
var imagesPaths = {
    source: projectInput + constantClient + "/images/**/*.*",
    target: projectOutput + constantClient + "/images/"
};

gulp.task("clean:imagesFolder", function (input) {
    rimraf(imagesPaths.target, input);
});

gulp.task("build:imagesFolder", function () {
    return gulp.src(imagesPaths.source)
        .pipe(gulp.dest(imagesPaths.target));
});

//#endregion

//#region Documents (html)
var documentPaths = {
    source: [
        projectInput + constantClient + "/**/*.{html,xml,xslt}",
        projectInput + constantClient + "/**/manifest.json"
    ],
    target: projectOutput + constantClient + pathSeparator
};

gulp.task("clean:documents", function (input) {
    rimraf(documentPaths.target, input);
});

gulp.task("build:documents", function () {
    return gulp.src(documentPaths.source)
        .pipe(gulp.dest(documentPaths.target));
});

//#endregion

//#region Data
var dataPaths = {
    source: projectInput + constantServer + "/data/**/*.{csv,json}",
    target: projectOutput + constantServer + "/data/"
};

gulp.task("clean:data", function (input) {
    rimraf(dataPaths.target, input);
});

gulp.task("build:data", function () {
    return gulp.src(dataPaths.source)
        .pipe(gulp.dest(dataPaths.target));
});

//#endregion

gulp.task("watch_Folders", function () {
    gulp.watch(dataPaths.source, ["build:data"]);
    gulp.watch(documentPaths.source, ["build:documents"]);
    gulp.watch(imagesPaths.source, ["build:imagesFolder"]);
    gulp.watch(sassPaths.source, ["build:cssFolder"]);
    gulp.watch(typescriptPaths.serverSource, ["build:scriptsFolder"]);
    gulp.watch(typescriptPaths.clientCommonSource, ["build:scriptsFolder"]);
    gulp.watch(typescriptPaths.clientSource, ["build:scriptsFolder"]);
});