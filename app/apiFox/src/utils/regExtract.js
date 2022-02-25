/**
 * 正则表达式相关的工具
 * @Author myk
 * @Description 该版本改动信息
 * @Date 2021/6/9
 * @FilePath src\utils\regExtract.ts
 */

/**
 * 循环提取符合所有条件的正则表达式
 * @param regex 正则表达式
 * @param str 需要匹配的字符串
 */
export const extract = (regex, str) => {
  let matches = [],
    match,
    index,
    error;
  while ((match = regex.exec(str))) {
    // 如果为无穷的话强行匹配出最终的结果，缺陷就是会产生大量空白数组
    index = regex.lastIndex;
    if (index === regex.lastIndex) {
      error = { id: "infinite", warning: true };
      ++regex.lastIndex;
    }
    let groups = match.reduce((arr, s, i) => {
      return (i === 0 || arr.push({ s: s })) && arr;
    }, []);

    // i：匹配到的字符串在总字符串中的起始位置
    // l：匹配到的字符串长度
    // groups：正则中提出出来的字符
    matches.push({ i: match.index, l: match[0].length, groups: groups });
    // 如果说不为全局正则，则直接跳出循环，否则会无限循环
    if (!regex.global) {
      break;
    }
  }
  return matches;
};

/**
 * 过滤正则提出来的结果
 * @param data 需要提取的数据
 * @param index 需要提取的数据在哪一位上
 */
export const extractData = (data, index = 0) => {
  let endData = data.map((item) => {
    if (item.groups[index]?.s) {
      return item.groups[index]?.s;
    }
    return "";
  });
  // 提取出有效的结果，过滤空白结果
  endData = endData.filter((item) => item);
  return endData;
};
