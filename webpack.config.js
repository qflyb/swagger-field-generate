const { resolve } = require("path");

module.exports = {
  entry: ["./src/index.js"],
  output: {
    path: resolve(__dirname, "build"),
    filename: "index.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              // 预设：指示babel做怎么样的兼容性处理。
              presets: [
                [
                  "@babel/preset-env",
                  {
                    corejs: {
                      version: 3,
                    }, // 按需加载
                    useBuiltIns: "usage",
                  },
                ],
                "@babel/preset-react",
              ],
            },
          },
        ],
      },
    ],
  },
  mode: "production",
  devtool: "source-map",
};
