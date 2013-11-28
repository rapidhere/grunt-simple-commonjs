/*
 * grunt-simple-common
 * https://github.com/rapidhere/simple-commonjs
 *
 * Copyright (c) 2013 rapidhere
 * Licensed under the LGPL license.
 */

'use strict';

/* Options:
 *  files: src, dest
 *  main: the entry of the programm
 */

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  
  // Load default Options from json
  var meta = require('./meta');
  var fspath = require('path');
  var crypto = require('crypto');

  grunt.registerMultiTask('simple-commonjs', 'A Simple tool that wrapper a CommonJS Project into a single file for client side usage', function() {
    // Grunt task goes here
    
    // Get options
    var options = this.options(meta.defaultOptions);

    // Check options
    if(typeof options.main !== 'string') {
      grunt.fatal('Option `main` is invlaid or missed');
    }

    if(!grunt.file.exists(options.main)) {
      grunt.fatal('Cannot found main file ' + options.main);
    }
    
    // Check file array length; This is only require ver 0.1
    if(this.files.length !== 1) {
      grunt.fatal('Can only handle one single src-dest pair!');
    }

    this.files.forEach(function(filePair) {
      grunt.log.subhead('Start building <' + filePair.dest + '>');

      var success = true;

      try {
        // Open new dest file
        var dest = filePair.dest;
        createNewDist(dest);

        // Generate target
        build(filePair, options.main);
      } catch(e) {
        success = false;
        grunt.log.warn('Build Failed!' +
          '\nerr: ' + e + '\n'
        );
      }

      if(success) {
        grunt.log.ok('Build Successfully!');
      }
    });
  });

  var SHA1 = function(cont) {
    var f = crypto.createHash('sha1');
    f.update(cont);
    return f.digest('hex');
  };
  
  var createNewDist = function(filepath) {
    if(grunt.file.exists(filepath)) {
        throw 'Destination file ' + filepath + ' existed!';
    }

    grunt.file.write(filepath, meta.runnerJS);
  };

  var build = function(filePair, main) {
    var buffer = '';

    filePair.src.forEach(function(filepath) {
      // Filter out the existed file
      if(!grunt.file.exists(filepath)) {
        grunt.log.warn('Source file ' + filepath + ' not found.\n');
        return ;
      }

      grunt.log.ok('Found source file ' + filepath + ' ...');
      
      // wrap buffer
      var modulePath = fspath.resolve(filepath);
      var moduleContent = grunt.file.read(filepath);

      // Scan up requires and replace with SHA1 id
      var reg = /\brequire\s*\(\s*[\'\"](.*)[\'\"]\s*\)/g;
      var repfunc = function(ori, path) {
        path = fspath.resolve(modulePath, '..', path);
        return 'require("' + SHA1(path) + '")';
      };
      moduleContent = moduleContent.replace(reg, repfunc);

      buffer += 'moduleList["' + SHA1(modulePath) + '"] = {' +
        'module: ' + 'function(require, exports, module) {' +
          moduleContent + 
        '},' +
      '};';
    });
    
    // Write into buffer
    var destBuffer = grunt.file.read(filePair.dest);
    destBuffer = destBuffer.replace('// inner-code', buffer + '\n');
    // Write Main Id
    destBuffer = destBuffer.replace('0;// mainId', "'" + SHA1(fspath.resolve(main)) + "';");
    grunt.file.write(filePair.dest, destBuffer);
  };
};
