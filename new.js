import $ from "jquery";

setInterval(() => {
  $(".ant-table-thead")
    .find(".ant-table-cell")
    .each((index, dom) => {
      dom.title = "这是测试是否能用";
    });

  $(".ant-descriptions-item-content").each((index, dom) => {
    dom.title = "这是测试是否能用";
  });
}, 5000);
