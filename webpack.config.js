const { webpackConfig, webpackMerge, htmlOverlay } = require('just-scripts');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = webpackMerge(
  webpackConfig,
  htmlOverlay({
    template: 'resources/index.html'
  }),
  {
    // Here you can custom webpack configurations
    node: {
      fs: "empty"
    },
    output: {
      path: __dirname + '/dist',
      filename: 'index_bundle.js'
    },
    plugins: [
      new HtmlWebpackPlugin({template: "./resources/index.html"})
    ]
  }
);
