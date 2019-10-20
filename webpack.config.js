const _ = require('lodash');
const path = require('path');

const baseConfig = {
  watch: true,
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  output: {
    path: __dirname,
    library: 'text-revealer-js',
    libraryTarget: 'umd'
  },
  target: 'web',
  devtool: 'source-map',
  mode: 'development'
};

module.exports = [
  _.merge({}, baseConfig, {
    output: {
      filename: '_global.js'
    },
    mode: 'production',
    devtool: undefined,
  }),
  _.merge({}, baseConfig, {
    output: {
      filename: 'web-dev.js'
    }
  })
];
