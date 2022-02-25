import { useRef, useState } from "react";
import $ from "jquery";
import { Button, Form, Input, Modal } from "antd";
import ProDescriptions from "@ant-design/pro-descriptions";
const { TextArea } = Input;

export interface FieldProps {
  title: string;
  dataIndex: string;
}

function treatDeleteTitleArr(tableArr: string[]) {
  /** 去除了单位的表头 */
  return tableArr?.map((title) => {
    // 去除中文的（
    let str = title.replace(/（.+/, "");
    // 去除英文的括号，因为原型图有些括号是英文的，如果不去除，下面会报错
    str = str.replace(/\(/, "");
    return str;
  });
}

export default function XTButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();

  /** 表格上面的字段，存储起来 */
  const tableArr = useRef<string[]>([]);
  /** 详情上面的字段，存储起来 */
  const descriptionsArr = useRef<string[]>([]);

  /** 打开的什么弹窗 */
  const type = useRef("");

  const [finalShowArr, setFinalShowArr] = useState<FieldProps[]>([]);

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

          type.current = "表格";
          setIsModalVisible(true);
        }}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "100px",
          zIndex: 9999,
        }}
      >
        点我对表格
      </Button>
      <Button
        onClick={() => {
          descriptionsArr.current = [];

          // 获取详情列表
          $(".ant-descriptions-item-label").each((index, dom) => {
            descriptionsArr.current.push($(dom).text());
          });

          type.current = "详情";
          setIsModalVisible(true);
        }}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "300px",
          zIndex: 9999,
        }}
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
              const arr: FieldProps[] = JSON.parse(value.leftText);

              /** 去除了单位的表头 */
              let deleteTitleArr: string[] = [];

              if (type.current === "表格")
                deleteTitleArr = treatDeleteTitleArr(tableArr.current);

              if (type.current === "详情")
                deleteTitleArr = treatDeleteTitleArr(descriptionsArr.current);

              /** 最终打印的字段 */
              const finalArr: FieldProps[] = [];

              deleteTitleArr?.forEach((value) => {
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

              setFinalShowArr(finalArr);
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
          {finalShowArr?.map((item) => (
            <ProDescriptions
              column={1}
              dataSource={item}
              columns={[
                {
                  title: "字段名",
                  dataIndex: "title",
                },
                {
                  title: "匹配字段",
                  dataIndex: "dataIndex",
                  copyable: true,
                },
              ]}
            />
          ))}
        </div>
      </Modal>
    </>
  );
}
