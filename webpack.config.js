const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: [
    './entry.js'
  ],
  output: {
    path: path.resolve(__dirname, '.'),
    publicPath: '/',
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.font\.js/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'webfonts-loader',
            options: {
              publicPath: '/',
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bc-font.css'
    })
  ],
  devServer: {
    compress: true,
    historyApiFallback: true,
    host: 'localhost',
    hot: true,
    https: true,
    inline: true,
    port: '8080'
  }
};
