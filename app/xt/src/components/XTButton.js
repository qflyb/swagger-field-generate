import * as React from "react";
import { useRef, useState } from "react";
import $ from "jquery";
import { Button, Form, Input, Modal } from "antd";

const { TextArea } = Input;

export default function XTButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();

  /** 表格上面的字段，存储起来 */
  const tableArr = useRef([]);
  /** 详情上面的字段，存储起来 */
  const descriptionsArr = useRef([]);
  const [finalArr, setFinalArr] = useState([]);

  return (
    <>
      <Button
        onClick={() => {
          tableArr.current = [];

          // 获取到表头数据
          $(".ant-table-thead")
            .find(".ant-table-cell")
            .each((index, dom) => {
              tableArr.current.push($(dom).text());
            });

          setIsModalVisible(true);
        }}
        style={{ position: "fixed", bottom: "100px", right: "100px" }}
      >
        点我对表格
      </Button>
      <Button
        onClick={() => {
          // 获取详情列表
          $(".ant-descriptions-item-content").each((index, dom) => {
            dom.title = "这是测试是否能用";
          });
        }}
        style={{ position: "fixed", bottom: "100px", right: "300px" }}
      >
        点我对详情
      </Button>
      <Modal
        title="自动对字段"
        visible={isModalVisible}
        centered
        destroyOnClose
        width={1000}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <Form
          preserve={false}
          onValuesChange={async (value) => {
            if (value.leftText) {
              const arr = JSON.parse(value.leftText);

              /** 去除了单位的表头 */
              const deleteTitleArr = tableArr.current?.map((title) => {
                // 去除中文的（
                let str = title.replace(/（.+/, "");
                // 去除英文的括号，因为原型图有些括号是英文的，如果不去除，下面会报错
                str = str.replace(/\(/, "");
                return str;
              });

              /** 最终打印的字段 */
              const finalArr = [];

              deleteTitleArr?.forEach((value, index) => {
                let dataIndex = "";

                arr?.forEach((data) => {
                  if (value !== data.title) return;
                  // 如果不以Id结尾，才是正确的值
                  if (!/Id$/.test(data.dataIndex)) dataIndex = data.dataIndex;
                });

                finalArr.push({
                  title: value,
                  dataIndex,
                });
              });

              setFinalArr(finalArr);
            }
          }}
          form={form}
        >
          <Form.Item name="leftText">
            {/* 需要比对的数据，从aipfox上面粘贴过来 */}
            <TextArea rows={10} />
          </Form.Item>
        </Form>

        {/* 这里是将对的字段展示出来 */}
        <div className="xt-show-name">
          {finalArr?.map((item) => (
            <div key={item.dataIndex}>
              <p>{item.title}</p>
              <p className="xt-show-index">{item.dataIndex}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
