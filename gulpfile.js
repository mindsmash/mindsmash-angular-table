const
    gulp_rename = {
      'gulp-util': 'gutil',
      'gulp-angular-templatecache': 'template'
    },
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')({ rename: gulp_rename }),
    browserSync = require('browser-sync').create(),
    karma = require('karma').Server,
    pkg = require('./package.json'),
    del = require('del');

var banner = [
  '/**',
  ' * @name <%= pkg.name %>',
  ' * @version v<%= pkg.version %>',
  ' * @author <%= pkg.author %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''
].join('\n');


/**
 * Minify HTMLs in src directory and generate templates.js which contains the HTMLs.
 */
gulp.task('template:src', function() {
  return gulp.src('./src/!(example)/*.html')
      .pipe($.htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
      }))
      .pipe($.template('templates.js', {
        module: 'mindsmash-table'
      }))
      .pipe(gulp.dest('./.tmp'));
});


/**
 * Concat source files into one plugin file.
 */
gulp.task('concat:src', ['template:src'], function() {
  return gulp.src([
        './src/module.js',
        './.tmp/templates.js',
        './src/!(example)/*.js'
      ])
      .pipe($.insert.append('\n'))
      .pipe($.concat('mindsmash-table.js'))
      .pipe($.ngAnnotate({ add: true, remove: true }))
      .pipe($.wrap('(function(angular) {'
          + '\n\'use strict\';'
          + '\n<%=contents%>'
          + '\n})(angular);'))
      .pipe(gulp.dest('./.tmp'));
});


/**
 * Copy source files.
 */
gulp.task('copy:src', ['concat:src'], function() {
  return gulp.src('./.tmp/mindsmash-table.js')
      .pipe($.header(banner, { pkg: pkg }))
      .pipe(gulp.dest('./dist'));
});


/**
 * Uglify the plugin file and also append header to it.
 */
gulp.task('uglify:src', ['copy:src'], function() {
  return gulp.src('./dist/mindsmash-table.js')
      .pipe($.uglify())
      .pipe($.header(banner, { pkg: pkg }))
      .pipe($.rename({ suffix: '.min' }))
      .pipe(gulp.dest('./dist'));
});


/**
 * Delete temporary folders.
 */
gulp.task('clean:tmp', function() {
  return del(['./.tmp']);
});
gulp.task('clean:dist', function() {
  return del(['./dist']);
});
gulp.task('clean:docs', function() {
  return del(['./docs']);
});


/**
 * Lint source files.
 */
gulp.task('lint:src', function() {
  return gulp.src('./src/**/*.js')
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe($.eslint.failAfterError());
});


/**
 * Lint source files (force).
 */
gulp.task('lint:src:nofail', function() {
  return gulp.src('./src/**/*.js')
      .pipe($.eslint())
      .pipe($.eslint.format());
});


/**
 * Init a browser-sync with proxy and port.
 */
function browserSyncInit(baseDir, browser) {
  browserSync.init({
    startPath: '/',
    server: {
      baseDir: baseDir,
      routes: {
        '/bower_components': 'bower_components',
        '/docs': 'docs',
        '/tmp': '.tmp'
      }
    },
    browser: browser === undefined ? 'default' : browser,
    notify: false
  });
}


/**
 * Generate docs templates with plugin source file
 */
gulp.task('build:docs', ['build'], function() {
  return gulp.src('.tmp/mindsmash-table.js')
      .pipe($.ngdocs.process({
        html5Mode: false,
        startPage: '/api/mindsmash-table',
        loadDefaults: {
          angular: false,
          angularAnimate: false,
          marked: false
        },
        scripts: [
          'bower_components/angular/angular.min.js',
          'bower_components/angular-animate/angular-animate.min.js',
          'bower_components/marked/lib/marked.js'
        ]
      }))
      .pipe(gulp.dest('./docs'));
});


/**
 * Watch source files and reload docs page when detects change.
 */
gulp.task('serve:docs', ['build:docs'], function() {
  browserSyncInit('./docs');
  gulp.watch(['./src/!(example)/*.js'], ['build:docs']);
  gulp.watch(['./docs/index.html']).on('change', browserSync.reload);
});


gulp.task('serve:example', ['build'], function() {
  browserSyncInit('./src/example');
  gulp.watch(['./src/!(example)/*.html'], ['build']);
  gulp.watch(['./src/!(example)/*.js'], ['build', 'lint:src:nofail']);
  gulp.watch(['./tmp/mindsmash-table.js']).on('change', browserSync.reload);
  gulp.watch(['./src/example/*']).on('change', browserSync.reload);
});


gulp.task('test:spec', ['build', 'lint:src'], function(done) {
  new karma({
        configFile: __dirname + '/karma.conf.js',
        browsers: ['PhantomJS'],
        singleRun: true
      }, function() {
        done();
      }
  ).start();
});


gulp.task('clean', ['clean:tmp', 'clean:dist', 'clean:docs']);

gulp.task('build', ['template:src', 'concat:src', 'copy:src', 'uglify:src']);

gulp.task('test', ['build', 'lint:src', 'test:spec']);

gulp.task('docs', ['build:docs']);

gulp.task('default', ['build', 'test']);
