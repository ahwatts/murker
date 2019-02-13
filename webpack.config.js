const path = require("path");

const config = {
  mode: "development",
  entry: {
    murker: ["babel-polyfill", "./src/murker.js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
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
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(glsl|vert|frag)$/,
        exclude: /node_modules/,
        use: ["webpack-glsl-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "fonts/[name]-[hash].[ext]",
            },
          },
        ],
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
