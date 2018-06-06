// entry -> output
const path = require('path');

module.exports = {
  entry: './src/app.jsx',
  output: {
    path: path.join(__dirname, 'public/src'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      loader: 'babel-loader',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      options: {
        presets: [
          'env',
          'react',
        ],
        plugins: [
          'transform-class-properties',
        ],
      },
    }, {
      test: /\.s?css$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ],
    }],
  },
  devtool: 'cheap-module-eval-source-map',
};
