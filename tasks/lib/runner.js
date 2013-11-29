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

  var mainId = 0;// mainId
  // Here is the Virtual Machine
  var moduleCache = {};
  
  // Module Class
  var Module = function(code, id) {
    this._code = code;
    this._id = id;

    this._module = {
        exports: {},
        id: this._id,
    };
  };
  
  Module.prototype.require = function(id) {
    if(moduleCache[id] !== undefined) {
      return moduleCache[id]._module.exports;
    } else if(moduleList[id] !== undefined) {
      moduleList[id].run();
      return moduleCache[id]._module.exports;
    } else {
      throw 'Cannot import module!';
    }
  };

  // A module can only run once, then we'll store it in the cache
  Module.prototype.run = function() {
    moduleCache[this._id] = this;
    
    var obj = this;
    var wrap_require = function(id) {
      return obj.require(id);
    };

    this._code(wrap_require, this._module.exports, this._module);
    // code run only once
    delete this._code;

    // Set the id back
    this._module.id = this._id;
  };
  
  // Read metas
  for(var id in moduleList) {
      var meta = moduleList[id];
      moduleList[id] = new Module(meta.module, id);
  }

  // Run main
  if(moduleList[mainId] !== undefined) {
    moduleList[mainId].run();
  } else {
    throw 'Main entry not found!';
  }
})();
