var webpack = require("webpack"),
  path = require("path"),
  yargs = require("yargs");

var libraryName = "PrismicMarkdown",
  fileName = "prismic-markdown",
  plugins = [],
  outputFile;

if (yargs.argv.p) {
  outputFile = fileName + ".min.js";
} else {
  outputFile = fileName + ".js";
}

var config = {
  entry: [__dirname + "/src/index.js"],
  output: {
    path: path.join(__dirname, "/dist"),
    filename: outputFile,
    library: libraryName,
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.json$/,
        use: "json-loader"
      }
    ]
  },
  resolve: {
    alias: {
      "@root": path.resolve(__dirname, "./src")
    },
    extensions: [".js"]
  },
  plugins: plugins
};

module.exports = config;
