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
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: ["transform-class-properties"],
              presets: [
                [
                  "env", {
                    targets: {
                      browsers: "last 2 versions",
                    },
                  },
                ],
                "react",
              ],
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
  resolve: {
    extensions: [".js", ".jsx"],
  },
};

module.exports = config;
