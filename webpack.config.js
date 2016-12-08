const config = {
  entry: "./src/murker.js",
  output: {
    path: "./dist",
    publicPath: "/assets/",
    filename: "murker.js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ["es2015"],
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: "style!css",
      },
    ],
  },
  devtool: "sourcemap",
  devServer: {
    contentBase: "./public",
    publicPath: "/assets/",
  },
};

module.exports = config;
