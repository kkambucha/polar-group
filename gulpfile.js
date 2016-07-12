'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    gutil = require('gulp-util'),
    browserSync = require("browser-sync"),
    spritesmith = require('gulp.spritesmith'),
    plumber = require('gulp-plumber'),
    reload = browserSync.reload;



var path = {
    sprites : {
        images: 'src/sprite/*.*',
        buildPath: 'src/img/',
        cssPath: 'src/css/'
    },
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        pic: 'build/pic/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/css/main.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        pic: 'src/pic/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/**/*.scss',
        img: 'src/img/**/*.*',
        pic: 'src/pic/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

gulp.task('serve', function() {

  browserSync.init(['*.html'], {
    server: {
      baseDir: 'build',
      directory: true,
      routes: {
        "/node_modules": "node_modules",
      }
    },
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: false
    },
    host: process.env.HOST || "10.0.100.20",
    port: process.env.PORT || "8889",
    open: false
  });

});

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "http-server"
};

//   TASKS ------------------

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(plumber()) // Ловим ошибки
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(plumber()) // Ловим ошибки
        .pipe(rigger()) //Прогоним через rigger
        // .pipe(sourcemaps.init()) //Инициализируем sourcemap
        // .pipe(uglify()) //Сожмем наш js
        // .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(plumber()) // Ловим ошибки
        // .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        // .pipe(cssmin({
        //     //https://www.npmjs.com/package/clean-css#how-to-set-compatibility-mode
        //     compatibility: 'ie7,' +
        //     '-units.ch,' +
        //     '-units.in,' +
        //     '-units.pc,' +
        //     '-units.pt,' +
        //     '-units.rem,' +
        //     '-units.vh,' +
        //     '-units.vm,' +
        //     '-units.vmax,' +
        //     '-units.vmin'
        // })) //Сожмем
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        // .on('end', function(){ gutil.log('Done!'); }); //И в build
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(plumber()) // Ловим ошибки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('pictures:build', function () {
    gulp.src(path.src.pic) //Выберем наши картинки
        .pipe(plumber()) // Ловим ошибки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.pic)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(plumber()) // Ловим ошибки
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browserSync.stream());
});

gulp.task('sprite:build', function() {
    var spriteData =
        gulp.src(path.sprites.images) // путь, откуда берем картинки для спрайта
            .pipe(plumber()) // Ловим ошибки
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.css',
            }));

    spriteData.img.pipe(gulp.dest(path.sprites.buildPath)); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest(path.sprites.cssPath)); // путь, куда сохраняем стили
});

// WATCHER -----------------------

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.pic], function(event, cb) {
        gulp.start('pictures:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    'pictures:build'
]);

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'watch', 'serve']);
