import Watcher from "../observer/watcher";
import { patch } from "../vdom/patch";

export function lifecycleMixin(Vue) {
    // 将vnode转换成真实dom
    Vue.prototype._update = function (vnode) {
        const vm = this;
        const el = vm.$el;

        // patch既有初始化的功能，也有更新的功能
        // 将patch生成的el重新赋值给$el
        vm.$el = patch(el, vnode);
    };
}

export function mountComponent(vm, el) {
    // 挂载之前调用beforeMount
    callHook(vm, "beforeMount");

    vm.$el = el;
    // 1.调用render方法产生虚拟节点
    // 2.根据虚拟dom产生真实dom
    // 3.将真实dom插入到el中
    // vm._update(vm._render());

    // 渲染和更新时调用的方法
    const updateComponent = () => {
        vm._update(vm._render());
    };

    // isRenderWatcher参数为true，代表是一个渲染watcher
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
