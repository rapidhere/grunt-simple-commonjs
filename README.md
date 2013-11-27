# grunt-simple-commonjs

> A Simple tool that wrapper a CommonJS Project into a single file for client side usage

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
        standalone: true,
        main: 'src/index.js'
    },
    all: {
        files: {
            'dist/index.js': ['src/**/*.js']
        }
    },
  },
});
```

### Options

#### options.standalone
Type: `boolean`
Default value: `true`

To build a standalone javascript that donesn't use extra CommonJS wrapper

#### options.main
Type: `String`
Default value: null

The entry of your programm

### Usage Examples

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
