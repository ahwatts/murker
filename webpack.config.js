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
      {
        test: /\.(glsl|vert|frag)$/,
        exclode: /node_modules/,
        loader: "webpack-glsl",
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
