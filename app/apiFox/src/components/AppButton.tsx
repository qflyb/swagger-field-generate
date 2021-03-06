import { useRef, useState } from "react";
import $ from "jquery";
import { Button, Form, Input, message, Modal } from "antd";
import { extract, extractData } from "../utils/regExtract";
import { copy } from "../utils";
import { FieldProps } from "../../../xt/src/components/XTButton";

const { TextArea } = Input;

/** 输出字段的类型 */
export interface ColumnsProps extends FieldProps {
  key: string;
  hideInSearch: boolean;
  width: string;
}

export default function AppButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const swaggerData = useRef<FieldProps[]>([]);

  const [form] = Form.useForm();

  function extractFields() {
    /** 最终提取出来的数据 */
    const dataArr: FieldProps[] = [];
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
  }

  return (
    <>
      <Button
        onClick={() => {
          extractFields();
          setIsModalVisible(true);
        }}
        style={{ position: "fixed", bottom: "100px", right: "100px" }}
      >
        点我
      </Button>
      <Button
        onClick={() => {
          extractFields();
          copy(JSON.stringify(swaggerData.current));
        }}
        style={{ position: "fixed", bottom: "100px", right: "200px" }}
      >
        复制
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
              try {
                /** 将输入的值转换为数组 */
                const titleArr: string[] = extractData(
                  extract(/title: '(.+?)'/g, value.leftText)
                );

                const dataIndexArr: string[] = extractData(
                  extract(/dataIndex: '(.+?)'/g, value.leftText)
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

                const finalArr: ColumnsProps[] = [];
                /** 没有找到的字段 */
                const noArr: string[] = [];

                deleteTitleArr.forEach((value, index) => {
                  let dataIndex = "";

                  swaggerData.current?.forEach((data) => {
                    if (value !== data.title) return;
                    // 如果不以Id结尾，才是正确的值
                    if (!/Id$/.test(data.dataIndex)) dataIndex = data.dataIndex;
                  });

                  if (!dataIndex) noArr.push(titleArr[index]);

                  finalArr.push({
                    title: titleArr[index],
                    key: dataIndex || dataIndexArr[index],
                    dataIndex: dataIndex || dataIndexArr[index],
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
                form.setFieldsValue({
                  rightText: str,
                  noText: JSON.stringify(noArr),
                });
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
          <Form.Item name="noText">
            {/* 没有找到的字段 */}
            <TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
