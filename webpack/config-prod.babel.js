import webpack from 'webpack';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import baseWebpackConfig from './config';

export default {
  ...baseWebpackConfig,
  debug: false,
  noInfo: true,
  devtool: 'cheap-source-map',
  entry: [
    path.join(__dirname, '../src/index'),
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
      {
        from: 'src/index.html',
      },
    ]),
  ],
};
