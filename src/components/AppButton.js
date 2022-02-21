import * as React from "react";
import $ from "jquery";
import { Button, Col, Form, Input, message, Modal, Row, Space } from "antd";
import { useRef, useState } from "react";
import { extract, extractData } from "../utils/regExtract";

const { TextArea } = Input;

export default function AppButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const swaggerData = useRef([]);

  const [form] = Form.useForm();

  return (
    <>
      <Button
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
          swaggerData.current = dataArr;
          setIsModalVisible(true);
        }}
        style={{ position: "fixed", bottom: "100px", right: "100px" }}
      >
        点我
      </Button>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        centered
        width={1000}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <Form
          onValuesChange={async (value) => {
            if (value.leftText) {
              try {
                /** 将输入的值转换为数组 */
                const titleArr = extractData(
                  extract(/title: '(.+?)'/g, value.leftText)
                );

                /** 去除了单位的表头 */
                const deleteTitleArr = titleArr.map((title) => {
                  // 去除中文的（
                  let str = title.replace(/（.+/, "");
                  // 去除英文的括号，因为原型图有些括号是英文的，如果不去除，下面会报错
                  str = str.replace(/\(/, "");
                  return str;
                });

                /** 将表格宽度信息保存起来 */
                const widthArr = extractData(
                  extract(/width:.+\('(.+)'\)/g, value.leftText)
                );

                const finalArr = [];

                deleteTitleArr.forEach((value, index) => {
                  const dataIndex = swaggerData.current?.find((item) => {
                    return RegExp(value).test(item.title);
                  })?.dataIndex;

                  finalArr.push({
                    title: titleArr[index],
                    key: dataIndex || "没找到",
                    dataIndex: dataIndex || "没找到",
                    hideInSearch: true,
                    width: `tableWidth.get('${widthArr[index]}')`,
                  });
                });

                let str = JSON.stringify(finalArr);
                // 去除tableWidth.get中的引号
                str = str.replaceAll(
                  /"tableWidth.get\((.+?)\)"/g,
                  "tableWidth.get($1)"
                );
                form.setFieldsValue({ rightText: str });
              } catch (e) {
                message.error("检查title中的单位是否错误");
              }
            }
          }}
          form={form}
        >
          <Form.Item name="leftText">
            {/* 需要比对的数据 */}
            <TextArea rows={10} />
          </Form.Item>
          <Form.Item name="rightText">
            {/* 输出的结果 */}
            <TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
