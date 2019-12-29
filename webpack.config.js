const _ = require('lodash');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const baseConfig = {
  entry: {
    main: ['./src/index.js', './src/scss/_global.scss']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    // Where the compiled SASS is saved to
    new MiniCssExtractPlugin({
      filename: '_global.css',
      chunkFilename: '_global.css'
    })
  ],
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
    devtool: undefined
  }),
  _.merge({}, baseConfig, {
    output: {
      filename: 'web-dev.js'
    },
    mode: 'development'
  })
];
