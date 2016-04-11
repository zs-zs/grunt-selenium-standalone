/*
 * grunt-selenium-standalone
 * https://github.com/zs-zs/grunt-selenium-standalone
 *
 * Copyright (c) 2015-2016 zs-zs
 * Licensed under the MIT license.
 */

'use strict';

var q = require('q');
var cloneDeep = require('lodash.clonedeep');
var selenium = require('selenium-standalone');

var seleniumChildProcess;

function withSeleniumContext(grunt, performTask) {
	var ssOptions = cloneDeep( this.data );
	if ( ssOptions.seleniumVersion ) {
		ssOptions.version = ssOptions.seleniumVersion;
	}
	if ( ssOptions.seleniumBaseURL ) {
		ssOptions.baseURL = ssOptions.seleniumBaseURL;
	}
	if ( !ssOptions.drivers ) {
		ssOptions.drivers = {};
	}
	if ( !ssOptions.logger ) {
		ssOptions.logger = function(message) {
			grunt.log.debug(message);
		};
	}

	delete ssOptions.seleniumVersion;
	delete ssOptions.seleniumBaseURL;

	var done = this.async();
	performTask.call(this, ssOptions)
		.then(done, function(e) {
			grunt.log.error(e);
			done(false);
		});
}

function start(grunt) {
	var that = this;
	withSeleniumContext.call(this, grunt, function(ssOptions) {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
					stopOnExit: false
				});

		if (options.stopOnExit === true) {
			process.on('exit', function() {
				stop.call(that, grunt);
			});
		}

		return q.denodeify(selenium.start)(ssOptions)
			.then(function(seleniumProcess) {
				seleniumChildProcess = seleniumProcess;
				seleniumProcess.stderr.on('data', function(data) {
					grunt.log.debug(data.toString());
				});
			});
	});
}

function stop(grunt) {
	if (seleniumChildProcess && typeof seleniumChildProcess.kill === 'function') {
		grunt.log.debug('Killing Selenium server child process...');
		seleniumChildProcess.kill();
		grunt.log.debug('Selenium server killed.');
	}
}

function install(grunt) {
	withSeleniumContext.call(this, grunt, function(ssOptions) {
		if ( !ssOptions.progressCb ) {
			ssOptions.progressCb = function(totalLength, progressLength, chunkLength) {
				grunt.log.debug('INSTALLING SELENIUM WEBDRIVER... ' + progressLength + ' / ' + totalLength + ' IS DONE.');
			};
		}
		return q.denodeify(selenium.install)(ssOptions);
	});
}

module.exports = function(grunt) {
	grunt.registerMultiTask('selenium_standalone', function(commandVerb) {
		if (!commandVerb) {
			grunt.fatal('command verb should be specified, such as "selenium_standalone:serverConfig:start"');
		}

		switch (commandVerb.toLowerCase()) {
			case 'start':
				start.call(this, grunt);
				break;
			case 'stop':
				stop.call(this, grunt);
				break;
			case 'install':
				install.call(this, grunt);
				break;
			default:
				grunt.fatal('Unknown command verb: "' + commandVerb + '"');
				break;
		}
	});
};
