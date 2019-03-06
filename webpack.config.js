const slsw = require("serverless-webpack");
const TerserPlugin = require('terser-webpack-plugin');

const ENABLE_MINIFY = true;
const ENABLE_SOURCE_MAPS = true;

const optimization = ENABLE_MINIFY
  ? {
    minimizer: [
      new TerserPlugin({
        sourceMap: ENABLE_SOURCE_MAPS,
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        }
      })
    ]
  }
  : {
    minimize: false
  };

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  // Generate sourcemaps for proper error messages
  devtool: ENABLE_SOURCE_MAPS ? "source-map" : false,
  // Since "aws-sdk" is not compatible with webpack,
  externals: [ "aws-sdk" ],
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  optimization: optimization,
  performance: {
    // Turn off size warnings for entry points
    hints: false
  },
  // Run babel on all .js files and skip those in node_modules
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: __dirname,
        exclude: /node_modules/
      }
    ]
  }
};

