const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: {
    main: './src/index.js',
    'module1-main': './src/module-1/index.js',
    'module2-main': './src/module-2/index.js'
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
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
      filename: '[name].[chunkhash:8].css',
      chunkFilename: '[id].[chunkhash:8].css'
    })
  ],

  optimization: {
    runtimeChunk: 'single',
    namedModules: true,
    namedChunks: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          name: 'common~main',
          chunks: 'initial',
          minChunks: 2,
          minSize: 0
        },
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all'
        }
      }
    }
  }
}
