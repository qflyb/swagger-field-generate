const { resolve } = require("path");
const config = require("./config");

module.exports = {
  entry: ["./app/xt/src/index.js"],
  output: {
    path: resolve(__dirname, "../build"),
    filename: "xtIndex.js",
    publicPath: "/",
  },
  ...config
};
