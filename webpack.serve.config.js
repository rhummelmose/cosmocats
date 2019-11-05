const { webpackMerge, htmlOverlay, webpackServeConfig } = require('just-scripts');
const Dotenv = require('dotenv-webpack');

module.exports = webpackMerge(
  webpackServeConfig,
  htmlOverlay({
    template: 'resources/index.html'
  }),
  {
    // Here you can custom webpack configurations
    output: {
      publicPath: '/'
    },
    node: {
      fs: "empty"
    },
    plugins: [
      new Dotenv()
    ]
  }
);
