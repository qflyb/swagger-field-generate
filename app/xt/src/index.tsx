import $ from "jquery";
import { render } from "react-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import "./index.css";
import XTButton from "./components/XTButton";

// 添加一个div作为React的入口文件
$("body").append(`<div id="ccll-app"/>`);

render(
  <ConfigProvider locale={zhCN}>
    <XTButton />
  </ConfigProvider>,
  document.getElementById("ccll-app")
);
