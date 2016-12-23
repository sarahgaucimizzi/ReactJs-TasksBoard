import webpack from 'webpack';
import path from 'path';

export default {
  debug: true,
  devtool: 'source-map',
  noInfo: false,
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true', // note that it reloads the page if hot module reloading fails.
    path.join(__dirname, '../src/index'),
  ],
  target: 'web',
  output: {
    path: path.join(__dirname, '/../dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, '../src'),
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, '../src'),
        loaders: [
          'babel',
        ],
      },
      {
        test: /(\.css)$/,
        loaders: [
          'style',
          'css',
        ],
      },
      {
        test: /(\.scss)$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]',
          'postcss-loader',
        ],
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(svg|eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
      },
    ],
  },
};
