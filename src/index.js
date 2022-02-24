import * as React from "react";
import $ from "jquery";
import { render } from "react-dom";
import AppButton from "./components/AppButton";
import zhCN from "antd/lib/locale/zh_CN";
import "antd/dist/antd.css";
import { ConfigProvider } from "antd";

// 添加一个div作为React的入口文件
$("body").append(`<div id="ccll-app"/>`);

render(
  <ConfigProvider locale={zhCN}>
    <AppButton />
  </ConfigProvider>,
  document.getElementById("ccll-app")
);
