import webpack from 'webpack';
import _ from 'lodash';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import baseWebpackConfig from './config';

module.exports = _.assign(baseWebpackConfig, {
  debug: false,
  noInfo: true,
  devtool: 'cheap-source-map',
  entry: [
    path.resolve(__dirname, '../src/index'),
  ],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      __DEV__: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new CopyWebpackPlugin([
        { from: 'src/index.html' },
    ]),
  ],
});
