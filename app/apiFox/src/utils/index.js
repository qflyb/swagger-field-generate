import { message } from "antd";

export function copy(str) {
  const oInput = document.createElement("textarea");
  oInput.value = str;
  document.body.appendChild(oInput);
  oInput.select();
  oInput.setSelectionRange(0, oInput.value.length);
  document.execCommand("Copy");
  document.body.removeChild(oInput);
  message.success("复制成功，可直接在其它界面粘贴");
}
