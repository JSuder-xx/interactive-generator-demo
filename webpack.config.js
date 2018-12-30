const path = require('path');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './src/index.ts'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  mode: "development",
  devtool: 'inline-source-map',    
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  }
};