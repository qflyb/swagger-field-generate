module.exports = {
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
      {
        test: /\.css$/,
        // 使用哪些 loader 进行处理
        use: [
          // use 数组中 loader 执行顺序：从右到左，从下到上 依次执行
          // 创建 style 标签，将 js 中的样式资源插入进行，添加到 head 中生效
          "style-loader",
          // 将 css 文件变成 commonjs 模块加载 js 中，里面内容是样式字符串
          "css-loader",
        ],
      },
      {
        test: /\.less$/,
        // 使用哪些 loader 进行处理
        use: [
          // use 数组中 loader 执行顺序：从右到左，从下到上 依次执行
          // 创建 style 标签，将 js 中的样式资源插入进行，添加到 head 中生效
          "style-loader",
          // 将 css 文件变成 commonjs 模块加载 js 中，里面内容是样式字符串
          "css-loader",
          "less-loader",
        ],
      },
    ],
  },
  mode: "production",
  devtool: "source-map",
};
