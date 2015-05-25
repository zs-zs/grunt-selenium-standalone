'use strict';

var createClient = require('./createClient');

exports.selenium_standalone = {
	server_should_not_run: function(test) {
		createClient().then(function() {
			test.ok(false, 'Oops, the selenium server is still running...');
			test.done();
		}, function() {
			test.ok(true);
			test.done();
		});
	}
};
