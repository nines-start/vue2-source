import { generate } from "./codeGen";
import { parseHTML } from "./parse/html-parse";

export function compilerToFunctions(template) {
    const ast = parseHTML(template);
    const code = generate(ast);

    let render = new Function(code.render);
    return render;
}
