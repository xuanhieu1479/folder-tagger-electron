const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules')
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/splash.html'),
          to: path.resolve(__dirname, './.webpack/main/')
        },
        {
          from: path.resolve(__dirname, './src/splash.css'),
          to: path.resolve(__dirname, './.webpack/main/')
        },
        {
          from: path.resolve(__dirname, './src/fe/assets'),
          to: path.resolve(__dirname, `./.webpack/renderer/Asset/`)
        }
      ]
    })
  ],
  optimization: {
    // Typeorm depends on entity class name to create table alias
    // if none were defined before, and since webpack minimizes all class name
    // on production it causes typeorm to mess up every database query.
    // Therefore turning webpack minification off is a must.
    // REFERENCE: https://github.com/typeorm/typeorm/issues/4266#issuecomment-505139399
    minimize: false
  }
};
