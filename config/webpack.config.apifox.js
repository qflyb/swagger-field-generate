const { resolve } = require("path");
const config = require("./config");

module.exports = {
  entry: ["./app/apiFox/src/index.tsx"],
  output: {
    path: resolve(__dirname, "../build"),
    filename: "apiFoxIndex.js",
    publicPath: "/",
  },
  ...config,
};
