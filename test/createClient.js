'use strict';

var wd = require('wd');

var automatedBrowsers = require('./automatedBrowsers.json');
var browser = process.env.BROWSER || 'chrome'

var createClient = function createClient() {
	var res = wd.promiseChainRemote('localhost', process.env.LOCAL_SELENIUM_PORT || 4444)
		.init(automatedBrowsers[browser].driver.config)
		.setWindowSize(1000, 1000) // do something
        .quit();
	return res;
};

module.exports = createClient;
