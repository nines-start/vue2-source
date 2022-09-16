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
    vm.$el = el;

    const updateComponent = () => {
        vm._update(vm._render());
    };

    new Watcher(vm, updateComponent, () => {}, {}, true);
    vm._update(vm._render());
}
