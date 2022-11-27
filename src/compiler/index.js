import { generate } from "./codeGen";
import { parseHTML } from "./parse/html-parse";

export function compilerToFunctions(template) {
    // 将html代码转成语法树
    const ast = parseHTML(template);

    // 通过ast,生成新的代码
    const code = generate(ast);

    // 生成render函数
    let render = new Function(code.render);
    return render;
}
