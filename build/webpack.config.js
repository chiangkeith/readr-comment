const path = require('path')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const { version } = require('../package.json')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'index.js',
    library:'readr-comment',
    libraryTarget: 'umd'    
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },      
    ]
  },
  devtool: '#source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'VERSION': JSON.stringify(version),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })    
  ],
  externals: {
    vue: 'vue'
  },  
  resolve: {
    // extensions: ['.js', '.vue', '.css'],
    alias: {
      'src': path.resolve(__dirname, '../src'),
    }
  },
}