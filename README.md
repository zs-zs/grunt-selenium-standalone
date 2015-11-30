# grunt-selenium-standalone

> Grunt tasks for running a standalone Selenium server using the popular selenium-standalone package

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-selenium-standalone --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-selenium-standalone');
```

## The "selenium_standalone" task

### Configuration overview

In your project's Gruntfile, add a section named `selenium_standalone` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    'selenium_standalone': {
        your_target: {
            seleniumVersion: '2.45.0',
            seleniumDownloadURL: 'http://selenium-release.storage.googleapis.com',
            drivers: {
                chrome: {
                  version: '2.15',
                  arch: process.arch,
                  baseURL: 'http://chromedriver.storage.googleapis.com'
                },
                ie: {
                  version: '2.45',
                  arch: process.arch,
                  baseURL: 'http://selenium-release.storage.googleapis.com'
                }
            },
            stopOnExit: true
        }
    }
});
```

### Command verbs

For each target of the task `selenium_standalone` you can issue multiple commands with command verbs.
The supported command verbs are:

- *install*: installs the web drivers which were specified for a given target
- *start*: starts the selenium server
- *stop*: stops the selenium server

### stopOnExit

For each target you can specify if the selenium server should stop automatically when the called grunt task completes or fails. The default is `false`.

## Contributing

### Run tests

```js
grunt test
```

## Release History

_0.1.0_: initial implementation. Commands: install, start, stop are implemented.
