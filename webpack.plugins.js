/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new webpack.DefinePlugin({
    'process.env': '{}',
    global: {}
  })
];
