var path = require('path');
var webpack = require('webpack');

module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['mocha', 'sinon'],
    reporters: ['mocha'],

    files: [
      'src/**/*-test.js'
    ],

    preprocessors: {
      'src/**/*-test.js': ['webpack', 'sourcemap'],
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            plugins: ['./babelRelayPlugin'],
            optional: 'runtime'
          }
        }]
      },
      resolve: {
        alias: {
          'relay-sink': path.join(__dirname, 'src')
        }
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('test')
        })
      ]
    },

    webpackMiddleware: {
      noInfo: true
    }
  });
};
