const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: {
    main: './src/index.js',
    'module1-main': './src/module-1/index.js',
    'module2-main': './src/module-2/index.js',
  },

  module: {
    rules: [{
      test: /\.css$/i,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader"
      ]
    }, ],
  },

  mode: 'production',

  output: {
    filename: '[name].[chunkhash:8].js'
  },

  plugins: [
    // new webpack.HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].[chunkhash:8].css",
      chunkFilename: "[id].[chunkhash:8].css"
    })
  ],

  optimization: {
    runtimeChunk: 'single',
    namedModules: true,
    namedChunks: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          }
        },
        commons: {
          name: "common~main",
          chunks: "initial",
          minChunks: 2,
          minSize: 0
        }
      }
    }
  }
}
