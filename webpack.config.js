const config = {
  entry: {
    murker: ["babel-polyfill", "./src/murker.js"],
  },
  output: {
    // path: "dist",
    publicPath: "/assets/",
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["es2015"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(glsl|vert|frag)$/,
        exclude: /node_modules/,
        use: ["webpack-glsl-loader"],
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
