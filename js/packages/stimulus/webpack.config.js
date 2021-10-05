const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = () => {
  const IS_PRODUCTION = process.env.NODE_ENV === 'production';

  return {
    mode: IS_PRODUCTION ? 'production' : 'development',
    entry: {
      stimulus: './index.js',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    plugins: [new CleanWebpackPlugin({ cleanStaleWebpackAssets: false })],
  }
};
