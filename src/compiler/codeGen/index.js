import { parseText } from "../parse/text-parse";

// 处理属性
function genProps(ast) {
    const { attrs } = ast;

    let str = "";
    // 遍历attrs
    for (let i = 0; i < attrs.length; i++) {
        const at = attrs[i];
        // style属性需要单独处理
        // 样式  style="background-color: red" 需要把冒号转成对象
        if (at.name === "style") {
            let obj = {};
            // 先用分号分隔，再用冒号分隔
            at.value.split(";").forEach((item) => {
                let [key, value] = item.split(":");
                obj[key] = value;
            });
            at.value = obj;
        }
        // 其他情况可以直接拼接
        // 多个属性之间需要使用逗号
        str += `${at.name}:${JSON.stringify(at.value)},`;
    }
    // 删除最后一个，
    return `{${str.slice(0, -1)}}`;
}

function genChildren(ast) {
    // 判断是否有子元素
    const { children } = ast;
    // 需要把子元素拼接在一起，用逗号拼接起来
    if (children) {
        return children.map((child) => genNode(child)).join(",");
    }
}
function genNode(node) {
    // 节点可能有两种类型，一种是文本，一种是标签
    if (node.type === 1) {
        return genElement(node);
    } else {
        let { text } = node;
        return `_v(${parseText(text)})`;
    }
}

function genElement(ast) {
    let props = genProps(ast);
    let children = genChildren(ast);

    let code = `_c('${ast.tag}',
    ${ast.attrs.length > 0 ? `${props}` : "null"}${
        children ? `,${children}` : ""
    })`;
    return code;
}

export function generate(ast) {
    const code = ast ? genElement(ast) : '_c("div")';
    // 使用with的作用，去this上取值
    return {
        render: `with(this){return ${code}}`,
    };
}
