/*
 * grunt-simple-common
 * https://github.com/rapidhere/simple-commonjs
 *
 * Copyright (c) 2013 rapidhere
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'tasks/lib/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: ['tmp', 'dist'],

    // Configuration to be run (and then tested).
    'simple-commonjs': {
      default_options: {
        options: {
          main: 'test/index.js',
        },
        files: {
          'dist/index.js': ['test/**/*.js'],
        },
      },
      custom_options: {
        options: {
          standalone: false,
          main: 'test/index.js',
        },
        files: {
          'dist/index.js': ['test/**/*.js'],
        },
      },
    },

  });
  // Load plugin
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'simple-commonjs']);

  // Lint Only
  grunt.registerTask('lint', ['jshint']);

};
