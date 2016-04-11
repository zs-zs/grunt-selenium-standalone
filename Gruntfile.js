/*
 * grunt-selenium-standalone
 * https://github.com/zs-zs/grunt-selenium-standalone
 *
 * Copyright (c) 2015-2016 zs-zs
 * Licensed under the MIT license.
 */

'use strict';

var automatedBrowsers = require('./test/automatedBrowsers.json');

module.exports = function(grunt) {

	var testDrivers = {};
	Object.keys(automatedBrowsers).forEach(function(browserName) {
		var automationConfig = automatedBrowsers[browserName];
		testDrivers[browserName] = {
			version: automationConfig.version,
			arch: process.arch,
			downloadURL: automationConfig.downloadURL
		};
	});

	grunt.initConfig({
		eslint: {
			target: ['*.js']
		},
		// Configuration to run the tests
		'selenium_standalone': {
			testConfig: {
				seleniumVersion: '2.53.0',
				seleniumDownloadURL: 'http://selenium-release.storage.googleapis.com',
				drivers: testDrivers
			}
		},
		// Integration tests
		nodeunit: {
			server_should_run: ['test/server_should_run.js'],
			server_should_not_run: ['test/server_should_not_run.js']
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.registerTask('test', [
		'eslint',
		'nodeunit:server_should_not_run',
		'selenium_standalone:testConfig:install',
		'nodeunit:server_should_not_run',
		'selenium_standalone:testConfig:start',
		'nodeunit:server_should_run', // server should be up and running at this point
		'selenium_standalone:testConfig:stop',
		'nodeunit:server_should_not_run'
	]);
};
