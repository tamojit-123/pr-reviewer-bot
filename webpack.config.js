// webpack.config.js
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./server.js", // Entry point for your server application
  target: "node", // Specify that we're bundling for Node.js
  externals: [nodeExternals()], // Ignore `node_modules` in the bundle
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.bundle.mjs", // Output bundle file
  },
  module: {
    rules: [
      {
        test: /\.js$/, // All JavaScript files
        exclude: /node_modules/, // Ignore `node_modules`
        use: {
          loader: "babel-loader", // Use Babel to transpile the code
          options: {
            presets: ["@babel/preset-env"], // Use the preset-env for modern JavaScript
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js"], // Resolve these extensions
  },
};