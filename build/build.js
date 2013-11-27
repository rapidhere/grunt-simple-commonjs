/*
 * grunt-simple-common
 * https://github.com/rapidhere/simple-commonjs
 *
 * Copyright (c) 2013 rapidhere
 * Licensed under the LGPL license.
 *
 * This is the build script for simple-commonjs
 */

'use strict';

(function() {
  var fs = require('fs');

  var jsonBuffer = fs.readFileSync('build/_meta.json', 'utf-8');
  var runnerBuffer = fs.readFileSync('tasks/lib/runner.js', 'utf-8');

  //Escape 
  runnerBuffer = runnerBuffer.replace(/\\/g, '\\\\');
  runnerBuffer = runnerBuffer.replace(/\n/g, '\\n');

  jsonBuffer = jsonBuffer.replace('runner-here', runnerBuffer);
  fs.writeFileSync('tasks/meta.json', jsonBuffer, 'utf-8');
}) ();
