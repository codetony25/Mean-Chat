/* jshint node: true */
'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({lazy: false});
var noop = plugins.util.noop;
var es = require('event-stream');
var bowerFiles = require('main-bower-files');
var rimraf = require('rimraf');
var queue = require('streamqueue');
var lazypipe = require('lazypipe');
var stylish = require('jshint-stylish');
var bower = require('./bower');
var isWatching = false;

var htmlminOpts = {
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttributes: false,
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true
};

/**
 * JS Hint
 */
gulp.task('jshint', function () {
  return gulp.src([
    './gulpfile.js',
    './public/app/**/*.js'
  ])
    .pipe(plugins.cached('jshint'))
    .pipe(jshint('./.jshintrc'))
    .pipe(livereload());
});

/**
 * CSS
 */
gulp.task('clean-css', function (done) {
  rimraf('./.tmp/css', done);
});

gulp.task('styles', ['clean-css'], function () {
  return gulp.src([
    './public/app/**/*.scss',
    '!./public/app/**/_*.scss'
  ])
    .pipe(plugins.sass())
    .pipe(gulp.dest('./.tmp/css/'))
    .pipe(plugins.cached('built-css'))
    .pipe(livereload());
});

gulp.task('styles-dist', ['styles'], function () {
  return cssFiles().pipe(dist('css', bower.name));
});

gulp.task('csslint', ['styles'], function () {
  return cssFiles()
    .pipe(plugins.cached('csslint'))
    .pipe(plugins.csslint('./.csslintrc'))
    .pipe(plugins.csslint.reporter());
});

/**
 * Scripts
 */
gulp.task('scripts-dist', ['templates-dist'], function () {
  return appFiles().pipe(dist('js', bower.name));
});

/**
 * Templates
 */
gulp.task('templates', function () {
  return templateFiles().pipe(buildTemplates());
});

gulp.task('templates-dist', function () {
  return templateFiles({min: true}).pipe(buildTemplates());
});

/**
 * Vendors
 */
gulp.task('vendors', function () {
  var files = bowerFiles();
  var vendorJs = fileTypeFilter(files, 'js');
  var vendorCss = fileTypeFilter(files, 'css');
  var q = new queue({objectMode: true});
  if (vendorJs.length) {
    q.queue(gulp.src(vendorJs).pipe(dist('js', 'vendors')));
  }
  if (vendorCss.length) {
    q.queue(gulp.src(vendorCss).pipe(dist('css', 'vendors')));
  }
  return q.done();
});

/**
 * Index
 */
gulp.task('index', index);
gulp.task('build-all', ['styles', 'templates'], index);

function index () {
  var opt = {read: false};
  return gulp.src('./public/app/index.html')
    .pipe(plugins.inject(gulp.src(bowerFiles(), opt), {ignorePath: 'bower_components', starttag: '<!-- inject:vendor:{{ext}} -->'}))
    .pipe(plugins.inject(es.merge(appFiles(), cssFiles(opt)), {ignorePath: ['.tmp', 'public/app']}))
    .pipe(gulp.dest('./public/app/'))
    .pipe(plugins.embedlr())
    .pipe(gulp.dest('./.tmp/'))
    .pipe(livereload());
}

/**
 * Assets
 */
gulp.task('assets', function () {
  return gulp.src('./public/app/assets/**')
    .pipe(gulp.dest('./dist/assets'));
});

/**
 * Dist
 */
gulp.task('dist', ['vendors', 'assets', 'styles-dist', 'scripts-dist'], function () {
  return gulp.src('./public/app/index.html')
    .pipe(plugins.inject(gulp.src('./dist/vendors.min.{js,css}'), {ignorePath: 'dist', starttag: '<!-- inject:vendor:{{ext}} -->'}))
    .pipe(plugins.inject(gulp.src('./dist/' + bower.name + '.min.{js,css}'), {ignorePath: 'dist'}))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Watch
 */
gulp.task('watch', ['default'], function() {
  isWatching = true;

  // Initiate livereload server:
  plugins.livereload.listen();
  gulp.watch('./public/app/**/*.js', ['jshint']).on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    } else {
      plugins.livereload.changed(evt);
    }
  });
  gulp.watch('./public/app/index.html', ['index']);
  gulp.watch(['./public/app/**/*.html', '!./public/app/index.html'], ['templates']);
  gulp.watch(['./public/app/**/*.scss'], ['csslint']).on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    } else {
      plugins.livereload.changed(evt);
    }
  });
});

/**
 * Default task
 */
gulp.task('default', ['lint', 'build-all']);

/**
 * Lint everything
 */
gulp.task('lint', ['jshint', 'csslint']);

/**
 * All CSS files as a stream
 */
function cssFiles (opt) {
  return gulp.src('./.tmp/css/**/*.css', opt);
}

/**
 * All AngularJS application files as a stream
 */
function appFiles () {
  var files = [
    './.tmp/' + bower.name + '-templates.js',
    './.tmp/public/app/**/*.js',
    '!./.tmp/public/app/**/*_test.js',
    './public/app/**/*.js',
    '!./public/app/**/*_test.js'
  ];
  return gulp.src(files)
    .pipe(plugins.angularFilesort());
}

/**
 * All AngularJS templates/partials as a stream
 */
function templateFiles (opt) {
  return gulp.src(['./src/app/**/*.html', '!./src/app/index.html'], opt)
    .pipe(opt && opt.min ? plugins.htmlmin(htmlminOpts) : noop());
}

/**
 * Build AngularJS templates/partials
 */
function buildTemplates () {
  return lazypipe()
    .pipe(plugins.ngHtml2js, {
      moduleName: bower.name,
      prefix: '/' + bower.name + '/',
      stripPrefix: '/src/app'
    })
    .pipe(plugins.concat, bower.name + '-templates.js')
    .pipe(gulp.dest, './.tmp')
    .pipe(livereload)();
}

/**
 * Filter an array of files according to file type
 *
 * @param {Array} files
 * @param {String} extension
 * @return {Array}
 */
function fileTypeFilter (files, extension) {
  var regExp = new RegExp('\\.' + extension + '$');
  return files.filter(regExp.test.bind(regExp));
}

/**
 * Concat, rename, minify
 *
 * @param {String} ext
 * @param {String} name
 * @param {Object} opt
 */
function dist (ext, name, opt) {
  opt = opt || {};
  return lazypipe()
    .pipe(plugins.concat, name + '.' + ext)
    .pipe(gulp.dest, './dist')
    .pipe(ext === 'js' ? plugins.uglify : plugins.minifyCss)
    .pipe(plugins.rename, name + '.min.' + ext)
    .pipe(gulp.dest, './dist')();
}

/**
 * Livereload (or noop if not run by watch)
 */
function livereload () {
  return lazypipe()
    .pipe(isWatching ? plugins.livereload : noop)();
}

/**
 * Jshint with stylish reporter
 */
function jshint (jshintfile) {
  return lazypipe()
    .pipe(plugins.jshint, jshintfile)
    .pipe(plugins.jshint.reporter, stylish)();
}
