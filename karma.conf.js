/* eslint-disable func-names, no-var */

// Karma configuration
// Generated on Sat Dec 10 2016 16:10:04 GMT-0500 (Eastern Standard Time)

var webpackConfig = require("./webpack.config.js");

delete webpackConfig.entry;

module.exports = function (config) {
  config.set({
    frameworks: ["mocha"],
    files: [
      "test/*_test.js",
      "test/**/*_test.js",
    ],
    preprocessors: {
      "test/*_test.js": ["webpack"],
      "test/**/*_test.js": ["webpack"],
    },
    reporters: ["mocha"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [
      "Chrome",
      // "Firefox",
    ],
    singleRun: false,
    concurrency: Infinity,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
  });
};
