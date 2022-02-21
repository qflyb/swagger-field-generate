import * as React from "react";
import $ from "jquery";
import { render } from "react-dom";
import AppButton from "./components/AppButton";
import "antd/dist/antd.css"

// 添加一个div作为React的入口文件
$("body").append(`<div id="ccll-app"/>`);



render(<AppButton />, document.getElementById("ccll-app"));
