/*
 * grunt-simple-common
 * https://github.com/rapidhere/simple-commonjs
 *
 * Copyright (c) 2013 rapidhere
 * Licensed under the LGPL license.
 */

/*
 * This is the outter runner of simple common js
 * all of the files will compress to this file and
 * the this runner will run this file as a Node or CommonJS VM
 *
 * These files will wrapped by grunt-simple-commonjs firstly
 */

'use strict';

(function() {
  // List of Modules
  var moduleList = {};

  // Inner code goes here
  // inner-code
  // End of inner code

  var mainPath = 0;// mainPath
  // Here is the Virtual Machine
  var moduleCache = {};

  // utils:
  var rootPath = mainPath;
  var pathJoin = function(dir1, dir2) {
    // assume that dir1 is abs
    if(dir2.charAt(0) === '/') {
      return dir2;
    }
    
    dir2 = dir2.split('/');
    dir1 = dir1.split('/');
    for(var i = 0;i < dir2.length;i ++) {
      var d = dir2[i];
      if(d === '.') {
        continue;
      } else if(d === '..' && dir1.join('/') !== rootPath) {
        dir1 = dir1.slice(0, dir1.length - 1);
      } else {
        dir1.push(d);
      }
    }

    return dir1.join('/');
  };
  
  // Module Class
  var Module = function(code, path) {
    this._code = code;
    this._path = path;

    this._export = {};
    // TODO: this._module = {exports: this._exports};
  };
  
  Module.prototype.require = function(path) {
    var p = this._path.split('/');
    p = p.slice(0, p.length - 1);
    path = pathJoin(p.join('/'), path);
    
    if(moduleCache[path] !== undefined) {
      return moduleCache[path]._export;
    } else if(moduleList[path] !== undefined) {
      moduleList[path].run();
      return moduleCache[path]._export;
    } else {
      throw this._path + ': Cannot import module ' + path;
    }
  };

  Module.prototype.run = function() {
    moduleCache[this._path] = this;
    
    var obj = this;
    var wrap_require = function(path) {
      return obj.require(path);
    };

    this._code(wrap_require, this._export, undefined);
  };
  
  // Read metas
  for(var path in moduleList) {
      var meta = moduleList[path];
      moduleList[path] = new Module(meta.module, path);
  }

  // Run main
  moduleList[mainPath].run();
})();
