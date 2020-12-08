const webpack = require("webpack");

module.exports = {
  entry: "./src/udp_rcon.js",
  target: "node",
  output: {
    filename: "bundle.js",
    library: "UDP_RCON",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  },
  resolve: {
    extensions: [".js"],
  },
};