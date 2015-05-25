'use strict';

var createClient = require('./createClient');

exports.selenium_standalone = {
	server_running: function(test) {
		createClient().then(function() {
			test.ok(true);
			test.done();
		}, function() {
			test.ok(false, 'An error occured during connecting to the selenium server');
			test.done();
		});
	}
};
