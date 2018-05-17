const webpack = require.main.require('webpack')
const { name, version } = require('./package.json')

module.exports = {
  webpack: {
    devtool: '#cheap-module-source-map',
    output: {
      publicPath: '.',
      filename: 'index.js',
    },
    plugins: [
      new webpack.DefinePlugin({
        'proccess.env.VERSION': JSON.stringify(version)
      })
    ]
  }
}