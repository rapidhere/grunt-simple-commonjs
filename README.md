# grunt-simple-commonjs

> A Simple tool that wrapper a CommonJS Project into a single file for client side usage

## Note
This is just a simple CommonJS wrapper

Currently you can only use require, exports, and module.exports

And only .json and .js files can be imported

This plugin is still under development, for issues please contact me on github

And I'm a freshman in fudan university, this is my first plugin for Grunt, thx for supporting me :)

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-simple-commonjs --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-simple-commonjs');
```

## The "simple-commonjs" task

### Overview
In your project's Gruntfile, add a section named `simple-commonjs` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  'simple-commonjs': {
    options: {
        main: 'src/index.js'
    },
    all: {
        files: {
            'dist/index.js': ['src/**/*.js', 'src/**/*.json']
        }
    },
  },
});
```

### Options

#### options.main
Type: `String`
Default value: null

The entry of your programm

Note that this option is required

### Usage Examples

The test show a simple Example

You can use `make example` to see it

If you don't get full code, you can't get it on my github

And if you don't want to get it, the gruntfile of test should be the example shows above

### Build from code

```bash
$ make
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
