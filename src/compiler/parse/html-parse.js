// 匹配属性
const attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

const dynamicArgAttribute =
    /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

// 匹配标签名
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;

// ?:匹配不捕获，捕获xx:yy这种类型的标签
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;

// 标签开头
// `<` 开头 +（ `a-z`或`A-Z`或`_`）+（`-`或`.`或`0-9`或`_`或`a-z`或`A-Z`）+ （`:`可选） +（ `a-z`或`A-Z`或`_`）+（`-`或`.`或`0-9`或`_`或`a-z`或`A-Z`）
// 所以标签可能有两种情况，一种是`<div`，另一种是`<div:xxx`,带有命名空间的形式。
const startTagOpen = new RegExp(`^<${qnameCapture}`);

// 匹配标签结束
const startTagClose = /^\s*(\/?)>/;

// 结尾标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);

export function parseHTML(html) {
    // 树根
    let root;

    // 当前的父标签，永远指向栈中最后一个
    let currentParent;

    // 栈结构
    let stack = [];

    const ELEMENT_TYPE = 1;
    const TEXT_TYPE = 3;

    // 只要html不为空，就一直循环解析
    while (html) {
        let textEnd = html.indexOf("<");
        // 等于0 ，是标签
        if (textEnd === 0) {

            const startTagMatch = parseStartTag();
            // 开始标签
            if (startTagMatch) {
                handleStartTag(startTagMatch);
                continue;
            }
            // 结束标签
            const endTagMatch = html.match(endTag);
            if (endTagMatch) {
                handleEndTag(endTagMatch[1]);
                advance(endTagMatch[0].length);
            }
        }

        // 是文本
        let text;
        if (textEnd > 0) {
            text = html.substring(0, textEnd);
        }
        if (text) {
            charts(text);
            advance(text.length);
        }
    }

    // 截取的方法 step是截取的位置,substring不传结束索引end，会一直截取到末尾
    // 将字符串进行截取操作，然后替换html
    function advance(n) {
        html = html.substring(n);
    }

    // 匹配开始标签
    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            // 匹配到后将标签名和属性拿出来，放到一个对象里面
            const match = {
                tagName: start[1],
                attrs: [],
            };
            // 获取标签后删除
            advance(start[0].length);
            // 如果没有遇到闭合标签，说明没有属性
            // 而且还要能匹配到属性
            let end, attr;

            // 不是开始标签的结束，并且是属性就一直匹配
            while (
                !(end = html.match(startTagClose)) &&
                (attr = html.match(attribute))
            ) {
                // 使用双引号，属性值是第3项，使用单引号，是第四项不用引号是是第五项
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5],
                });
                // 获取属性后删除
                advance(attr[0].length);
            }
            if (end) {
                advance(end[0].length);
                return match;
            }
        }
    }
    // 创建ast语法树
    function createASTElement(tagName, attrs) {
        return {
            // 标签名
            tag: tagName,
            // 标签type是1
            type: ELEMENT_TYPE,
            // 子节点
            children: [],
            // 属性
            attrs,
            // 父节点
            parent: null,
        };
    }

    // 处理开始标签
    function handleStartTag(match) {
        // 匹配元素出栈后，此时栈中最后一个元素是出栈元素的父亲。

        const { tagName, attrs } = match;
        const element = createASTElement(tagName, attrs);

        // 第一次调用的是树根
        if (!root) {
            root = element;
        }
        // 当前解析的标签保存为父标签
        currentParent = element;

        // 将开始标签元素放入栈中
        stack.push(element);
    }

    // 处理结束标签，在结尾标签闭合时，可以创建父子关系
    function handleEndTag(tagName) {
        // 取出栈中最后一个标签
        const element = stack.pop();
        // 当前父元素也要变成前一个元素
        currentParent = stack[stack.length - 1];

        // 元素闭合时，可以知道这个标签的父亲是谁
        // 同时也知道这个父亲的子元素
        if (currentParent) {
            element.parent = currentParent;
            currentParent.children.push(element);
        }
    }

    function charts(text) {
        text = text.trim();
        // 如果有文本，就将文本放入当前的父标签
        if (text) {
            currentParent.children.push({
                // 文本类型是3
                type: TEXT_TYPE,
                text,
            });
        }
    }

    return root;
}
