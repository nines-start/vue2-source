// 匹配{{}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

// 匹配文本标签
export function parseText(text) {
    if (!defaultTagRE.test(text)) {
        return `_v(${JSON.stringify(text)})`;
    }

    let tokens = [];

    let lastIndex = (defaultTagRE.lastIndex = 0);
    // 匹配到的结果
    let match;
    // 保存匹配到的索引
    let index;

    while ((match = defaultTagRE.exec(text))) {

        index = match.index;
        if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        // 当前索引加上匹配字符串的长度
        lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    return tokens.join("+");
}