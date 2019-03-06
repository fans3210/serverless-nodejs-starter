const slsw = require("serverless-webpack");
const TerserPlugin = require("terser-webpack-plugin");

const ENABLE_MINIFY = true;
// Generate sourcemaps for proper error messages
const ENABLE_SOURCE_MAPS = true;

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  devtool: ENABLE_SOURCE_MAPS ? "source-map" : false,
  // Exclude "aws-sdk" since it's a built-in package
  externals: ["aws-sdk"],
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  optimization: ENABLE_MINIFY
    ? {
        minimizer: [
          new TerserPlugin({
            sourceMap: ENABLE_SOURCE_MAPS,
            terserOptions: {
              mangle: ! ENABLE_SOURCE_MAPS
            }
          })
        ]
      }
    : {
        minimize: false
      },
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
