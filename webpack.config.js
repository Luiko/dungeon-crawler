const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

module.exports = {
  entry: {
    main: [
      'babel-polyfill',
      'react-hot-loader/patch',
      './src/index'
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/, exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.png$/,
        loader: 'file-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader'
        },{
          loader: 'css-loader'
        },{
          loader: 'sass-loader'
        }]
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: process.env.PORT
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'src/assets/favicon.ico'
    })
  ],
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  }
}
