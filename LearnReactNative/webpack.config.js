const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Webpack configuration (web only, Android/iOS still use Metro)
 * https://necolas.github.io/react-native-web/docs/setup/
 */
module.exports = (env, argv) => ({
  entry: path.resolve(__dirname, 'index.web.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        // React Native libraries are published untranspiled, so compile them too
        exclude: /node_modules[\\/](?!(react-native-(?!web)|@react-native))/,
        use: {
          loader: 'babel-loader',
          options: {cacheDirectory: true},
        },
      },
      {
        // React Navigation imports platform files without an extension
        // (e.g. './useLinking'), which strict ES modules reject by default
        test: /\.m?js$/,
        resolve: {fullySpecified: false},
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|otf)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'web/index.html'),
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(argv.mode !== 'production'),
    }),
  ],
  devServer: {
    port: 8080,
    hot: true,
    historyApiFallback: true,
  },
});
