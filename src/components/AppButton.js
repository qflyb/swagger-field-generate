import * as React from "react";
import $ from "jquery";

export default function AppButton() {
  return (
    <>
      <button
        onClick={() => {
          /** 最终提取出来的数据 */
          const dataArr = [];
          // 遍历提取swagger上面的信息
          $(".TreeListItem").each((index, element) => {
            const str = element.innerHTML;
            const name = /<span>(\w+)<\/span>/.exec(str);
            // 如果名字不存在
            if (!name?.[1]) {
              return;
            }

            // 将数据进行拼接
            dataArr.push({
              title: $(element).find(".fox-text-fg-low").text(),
              dataIndex: name?.[1],
            });
          });
          console.log(dataArr);
        }}
        style={{ position: "fixed", bottom: "100px", right: "100px" }}
      >
        点我
      </button>
    </>
  );
}
