import Watcher from "../observer/watcher";
import { patch } from "../vdom/patch";

export function lifecycleMixin(Vue) {
    // 将vnode转换成真实dom
    Vue.prototype._update = function (vnode) {
        const vm = this;
        const el = vm.$el;

        // 将patch生成的el重新赋值给$el
        vm.$el = patch(el, vnode);
    };
}

export function mountComponent(vm, el) {
    // 挂载之前调用beforeMount
    callHook(vm, "beforeMount");

    vm.$el = el;
    const updateComponent = () => {
        vm._update(vm._render());
    };
    new Watcher(vm, updateComponent, () => {}, {}, true);

    // 挂载后调用mounted
    callHook(vm, "mounted");
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook];
    if (handlers) {
        for (let i = 0, j = handlers.length; i < j; i++) {
            handlers[i].call(vm);
        }
    }
}
