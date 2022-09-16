export function renderMixin(Vue) {
    // 创建元素
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
function vnode(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text,
    };
}
