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
        grunt.log.warn('File ' + filepath + ' not found.\n');
        return ;
      }
      
      // to abs path
      filepath = fspath.resolve(filepath);

      // get ext
      var ext = fspath.extname(filepath);
      var moduleContent = null;
      if(ext === '.js') {
        grunt.log.ok('Found source file ' + filepath + ' ...');
        moduleContent = handleJavaScript(filepath);
      } else if(ext === '.json') {
        grunt.log.ok('Found data file ' + filepath + ' ...');
        moduleContent = handleJSON(filepath);
      } else {
        grunt.log.error('Unsupported file type: ' + filepath + ', ignored ...');
      }

      if(moduleContent !== null) {
        buffer += 
          'moduleList["' + SHA1(filepath) + '"] = {\n' +
          'module: ' + 'function(require, exports, module) {\n' +
             moduleContent + 
          '},\n' +
          '};\n';
      }
    });
    
    // need to escape $ first T T
    buffer = buffer.replace(/\$/g, '$$$$');

    // Write into buffer
    var destBuffer = grunt.file.read(filePair.dest);
    destBuffer = destBuffer.replace('// inner-code', buffer + '\n');
    // Write Main Id
    destBuffer = destBuffer.replace('0;// mainId', "'" + SHA1(fspath.resolve(main)) + "';");
    // Wirte into file
    grunt.file.write(filePair.dest, destBuffer);
  };
  
  // Handle JavaScript
  var handleJavaScript = function(filepath) {
    var supportedExt = meta.supportedExt;
    // wrap buffer
    var dirPath = fspath.dirname(filepath);
    var moduleContent = grunt.file.read(filepath);

    // Scan up requires and replace with SHA1 id
    var reg = /\brequire\s*\(\s*[\'\"](.*)[\'\"]\s*\)/g;
    var repfunc = function(ori, path) {
      // direct to abs path
      path = fspath.resolve(dirPath, path);

      // load file by extension
      var ext = fspath.extname(path);
      var i;

      // no extension, find .js, .json
      if(ext === '') { 
        for(i = 0;i < supportedExt.length;i ++) {
          var cpath = path + supportedExt[i];
          if(grunt.file.exists(cpath)) {
            ext = supportedExt[i];
            path = cpath;
            break;
          }
        }
      }
      // Cannot found supported file type
      if(ext === '') {
        throw 'Cannot found supported file type: ' + ori;
      }
      // Handle files
      // only support .js and .json now
      for(i = 0;i < supportedExt.length;i ++) {
        if(ext === supportedExt[i]) {
          return 'require("' + SHA1(path) + '")';
        }
      }

      throw 'Unsupported file type ' + ext + ' in: ' + ori;
    };
    moduleContent = moduleContent.replace(reg, repfunc);

    return moduleContent;
  };
  
  // Handle JSON
  var handleJSON = function(filepath) {
    var jsonContent = grunt.file.read(filepath);
    return 'module.exports = ' + jsonContent + ';';
  };
};
