var gulp=require('gulp'),
    gulputil=require('gulp-util'),
    path=require('path'),
    fs = require('fs-extra'),
    concat=require('gulp-concat'),
    uglify = require('gulp-uglify'),
    merge = require('merge-stream'),
    build=require('./build.json'),
    buildCore=require('./build-core.json'),
    release=require('./build/dist.json'),
    releaseCore=require('./build/dist-core.json'),
    src='./src',
    dist='./dist';




gulp.task('default',function(){
    console.log('elliptical-platform build..."tasks: gulp build|build-core|minify|minify-core"');
});

gulp.task('build',function(){

    var build_=srcStream(build)
        .pipe(concat('elliptical-platform.js'))
        .pipe(gulp.dest(src));

    var release_=srcStream(release)
        .pipe(concat('elliptical-platform.js'))
        .pipe(gulp.dest(dist));

    return merge(build_, release_);

});

gulp.task('build-core',function(){

    var build_=srcStream(buildCore)
        .pipe(concat('elliptical-platform-core.js'))
        .pipe(gulp.dest(src));

    var release_=srcStream(releaseCore)
        .pipe(concat('elliptical-platform-core.js'))
        .pipe(gulp.dest(dist));

    return merge(build_, release_);

});


gulp.task('minify',function(){

    var build_=srcStream(build)
        .pipe(concat('elliptical-platform.js'))
        .pipe(gulp.dest(src));

    var minify_=srcStream(release)
        .pipe(concat('elliptical-platform.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist));

    return merge(build_, minify_);
});

gulp.task('minify-core',function(){

    var build_=srcStream(buildCore)
        .pipe(concat('elliptical-platform-core.js'))
        .pipe(gulp.dest(src));

    var minify_=srcStream(releaseCore)
        .pipe(concat('elliptical-platform-core.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist));

    return merge(build_, minify_);
});


function srcStream(src){
    return gulp.src(src);
}

