'use strict';

module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

	require('time-grunt')(grunt);

	grunt.initConfig({

		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['wiredep']
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['newer:jshint:all'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			compass: {
				files: ['src/scss/**/*.{scss,sass}'],
				tasks: ['compass:server', 'autoprefixer']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'src/**/*.html',
					'.tmp/css/**/*.css',
					'src/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		connect: {
			options: {
				port: 9000,
				hostname: '0.0.0.0',
				livereload: 35729
			},
			livereload: {
				options: {
					open: true,
					middleware: function (connect) {
						return [
							connect.static('.tmp'),
							connect().use(
								'/bower_components',
								connect.static('./bower_components')
							),
							connect.static('src')
						];
					}
				}
			},
			dist: {
				options: {
					open: true,
					base: 'dist'
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: {
				src: [
					'Gruntfile.js',
					'src/js/**/*.js'
				]
			},
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'dist/**/*',
						'!dist/.git**/*'
					]
				}]
			},
			doc: {
				files: [{
					dot: true,
					src: [
						'doc/**/*'
					]
				}]
			},
			server: '.tmp'
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 1 version']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/css/',
					src: '**/*.css',
					dest: '.tmp/css/'
				}]
			}
		},

		// Automatically inject Bower components into the app
		wiredep: {
			app: {
				src: ['src/*.html'],
				ignorePath:  /\.\.\//
			},
			sass: {
				src: ['src/styles/**/*.{scss,sass}'],
				ignorePath: /(\.\.\/){1,2}bower_components\//
			}
		},

		// Compiles Sass to CSS and generates necessary files if requested
		compass: {
			options: {
				sassDir: 'src/scss',
				cssDir: '.tmp/css',
				generatedImagesDir: '.tmp/images/generated',
				imagesDir: 'src/images',
				javascriptsDir: 'src/js',
				fontsDir: 'src/styles/fonts',
				importPath: ['./bower_components', 'src/scss/style/scss'],
				httpImagesPath: '/images',
				httpGeneratedImagesPath: '/images/generated',
				httpFontsPath: '/styles/fonts',
				relativeAssets: false,
				assetCacheBuster: false,
				raw: 'Sass::Script::Number.precision = 10\n'
			},
			dist: {
				options: {
					generatedImagesDir: 'dist/images/generated'
				}
			},
			server: {
				options: {
					debugInfo: true
				}
			}
		},

		cssmin: {
			dist: {
				files: {
					'dist/css/reader.min.css': [
						'dist/css/reader.css'
					]
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'dist/js/reader.min.js': 'dist/js/reader.js',
					'dist/js/vendor/commonmark.min.js': 'dist/js/vendor/commonmark.js',
					'dist/js/vendor/hyphenator.min.js': 'dist/js/vendor/hyphenator.js'
				}
			}
		},
		concat: {
			options: {
			},
			dist: {
				src: ['src/js/*.js'],
				dest: 'dist/js/reader.js',
			},
			css: {
				src: ['.tmp/css/*.css'],
				dest: 'dist/css/reader.css',
			}
		},

		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'src/images',
					src: '**/*.{png,jpg,jpeg,gif}',
					dest: 'dist/images'
				}]
			}
		},

		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'src/images',
					src: '**/*.svg',
					dest: 'dist/images'
				}]
			}
		},

		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					minifyJS: true,
					minifyCSS: true,
					collapseWhitespace: true,
					conservativeCollapse: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: false
				},
				files: {
					'dist/reader.min.html': 'dist/reader.html',
					'dist/single.html': 'dist/single.html'
				}
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'src',
					dest: 'dist',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'*.html',
						'views/**/*.html',
						'images/**/*.{webp}',
						'fonts/**/*.*'
					]
				}, {
					expand: true,
					cwd: '.tmp/images',
					dest: 'dist/images',
					src: ['generated/*']
				}, {
					expand: true,
					cwd: 'bower_components/commonmark/dist',
					src: '*.js',
					dest: 'dist/js/vendor'
				}, {
					expand: true,
					cwd: 'bower_components/Hyphenator',
					src: ['Hyphenator.js', 'patterns/**'],
					dest: 'dist/js/vendor'
				}]
			},
			styles: {
				expand: true,
				cwd: 'src/scss',
				dest: '.tmp/css/',
				src: '**/*.css'
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'compass:server'
			],
			test: [
				'compass'
			],
			dist: [
				'compass:dist',
				'imagemin',
				'svgmin',
				'doc'
			]
		},
		inline: {
			single: {
				options:{
						//uglify: true,
						//cssmin: true,
						tag: ''
				},
				src: 'dist/reader.html',
				dest: 'dist/single.html'
			}
		},
		jsdoc : {
			dist : {
				options: {
					destination: 'doc',
//					template : 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
//					configure : 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json'
				},
//				src: ['src/js/reader.js']
				src: ['src/js/**/*.js', 'README.md', 'package.json']
			}
		}
	});


	grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'wiredep',
			'concurrent:server',
			'autoprefixer',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve:' + target]);
	});

	grunt.registerTask('test', [
		'clean:server',
		'concurrent:test',
		'autoprefixer',
		'connect:test'
	]);

	grunt.registerTask('doc', [
		'clean:doc',
		'jsdoc'
	]);

	grunt.registerTask('build', [
		'clean:dist',
    'wiredep',
		'concurrent:dist',
		'autoprefixer',
		'concat',
		'copy:dist',
    'cssmin',
		'uglify',
		'inline',
		'htmlmin'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'build'
	]);
};
