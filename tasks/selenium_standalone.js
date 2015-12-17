/*
 * grunt-selenium-standalone
 * https://github.com/zs-zs/grunt-selenium-standalone
 *
 * Copyright (c) 2015 zs-zs
 * Licensed under the MIT license.
 */

'use strict';

var q = require('q');
var selenium = require('selenium-standalone');

var seleniumChildProcess;

var withSeleniumContext = function(grunt, performTask) {
    var drivers = this.data.drivers || {};

    if (!drivers.chrome) {
        drivers.chrome = false;
    }
    if (!drivers.ie) {
        drivers.ie = false;
    }

	var done = this.async();
	performTask.call(this, drivers).then(done, function(e) {
		grunt.log.error(e);
		done(false);
	});
};

var start = function start(grunt) {
    var that = this;
	withSeleniumContext.call(this, grunt, function(drivers) {
		return q.denodeify(selenium.start)({
            version: this.data.seleniumVersion,
			drivers: drivers,
			logger: function(message) {
				grunt.log.debug(message);
			}
		}).then(function(seleniumProcess) {
			seleniumChildProcess = seleniumProcess;
			seleniumProcess.stderr.on('data', function(data) {
				grunt.log.debug(data.toString());
			});
            if (that.data.stopOnExit === true) {
                process.on('exit', function () {
                    stop.call(that, grunt);
                });
            }
		});
	});
};

var stop = function stop(grunt) {
    if (seleniumChildProcess.kill) {
        grunt.log.debug('Killing Selenium server child process...');
        seleniumChildProcess.kill();
        grunt.log.debug('Selenium server killed.');
    }
};

var install = function install(grunt) {
	withSeleniumContext.call(this, grunt, function(drivers) {
		return q.denodeify(selenium.install)({
			version: this.data.seleniumVersion,
			baseURL: this.data.seleniumDownloadURL,
			drivers: drivers,
			logger: function(message) {
				grunt.log.debug(message);
			},
			progressCb: function(totalLength, progressLength, chunkLength) {
				grunt.log.debug('INSTALLING SELENIUM WEBDRIVER... ' + progressLength + ' / ' + totalLength + ' IS DONE.');
			}
		});
	});
};

module.exports = function(grunt) {
	grunt.registerMultiTask('selenium_standalone', function(commandVerb) {
		if(!commandVerb) {
			grunt.fatal('command verb should be specified, such as "selenium_server:serverConfig:start"');
		}
		switch(commandVerb.toLowerCase()) {
			case 'start': start.call(this, grunt); break;
			case 'stop': stop.call(this, grunt); break;
			case 'install': install.call(this, grunt); break;
			default: grunt.fatal('Unknown command verb: "' + commandVerb + '"'); break;
		}
	});
};
