import { nextTick } from "../util/next-tick";

export function renderMixin(Vue) {
    // 这几种方法都是用对象描述dom的结构

    // 创建元素
    // 参数是：标签，属性，子元素
    Vue.prototype._c = function () {
        return createElementVNode(...arguments);
    };
    // 创建文本元素
    Vue.prototype._v = function (text) {
        return creteTextVNode(text);
    };
    // stringify
    Vue.prototype._s = function (val) {
        return val === null
            ? ""
            : typeof val === "object"
            ? JSON.stringify(val)
            : val;
    };
    Vue.prototype.$nextTick = function (fn) {
        return nextTick(fn, this);
    };

    Vue.prototype._render = function () {
        const vm = this;
        const render = vm.$options.render;
        // 调用render，返回的结果是vnode
        let vnode = render.call(vm);
        return vnode;
    };
}

function createElementVNode(tag, data, ...children) {
    if (data == null) data = {};
    return vnode(tag, data, data.key, children);
}

function creteTextVNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
}
// 创建虚拟dom
// 虚拟节点可以自定义属性,ast一定是根据源代码来转换
function vnode(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text,
    };
}
