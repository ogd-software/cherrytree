var fs = require("fs");

// Use ENV vars on CI and sauce.json locally to get credentials
if (!process.env.SAUCE_USERNAME) {
  if (!fs.existsSync('sauce.json')) {
    console.log('Create a sauce.json with your credentials {username,accessKey}.');
    process.exit(1);
  } else {
    var sauce = require('./sauce');
    process.env.SAUCE_USERNAME = sauce.username;
    process.env.SAUCE_ACCESS_KEY = sauce.accessKey;
  }
}


var customLaunchers = {
  'SL_Chrome': {
    base: 'SauceLabs',
    browserName: 'chrome'
  },
  'SL_Firefox': {
    base: 'SauceLabs',
    browserName: 'firefox'
  },
  'SL_Safari': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.9',
    version: '7'
  },
  'SL_IE_9': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2008',
    version: '9'
  },
  'SL_IE_10': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2012',
    version: '10'
  },
  'SL_IE_11': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  }
};


module.exports = function(config) {
  config.set({

    frameworks: ['mocha', 'sinon', 'sinon-chai'],

    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap']
    },

    files: [
      'test/index.js'
    ],

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // this watcher watches when bundled files are updated
    autoWatch: true,

    webpack: {
      cache: true,
      // this watcher watches when source files are updated
      watch: false,
      resolve: {
        alias: {
          'cherrytree': __dirname
        }
      },
      devtool: 'inline-source-map'
    },

    webpackServer: {
      noInfo: true
    },

    sauceLabs: {
      testName: 'Cherrytree Tests'
    },
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: ['dots', 'saucelabs'],
    singleRun: true,

    browserDisconnectTimeout : 10000, // default 2000
    browserDisconnectTolerance : 1, // default 0
    browserNoActivityTimeout : 4 * 60 * 1000, //default 10000
    captureTimeout: 4 * 60 * 1000 //default 60000
  });
};
