/* eslint func-names: off */

// Karma configuration
// Generated on Sat Dec 10 2016 16:10:04 GMT-0500 (Eastern Standard Time)

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
    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [
      "Chrome",
      // "Firefox",
    ],
    singleRun: true,
    concurrency: Infinity,
    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel",
            query: {
              presets: ["es2015"],
            },
          },
        ],
      },
    },
  });
};
