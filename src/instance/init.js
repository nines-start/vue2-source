import { compilerToFunctions } from "../compiler";
import { mergeOptions } from "../util/options";
import { callHook, mountComponent } from "./lifecycle";
import { initState } from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = mergeOptions(vm.constructor.options, options);

        callHook(vm, "beforeCreate");
        
        initState(vm);
        
        callHook(vm, "created");

        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    };
    Vue.prototype.$mount = function (el) {
        const vm = this;
        const opts = vm.$options;
        el = document.querySelector(el);

        // 没有rencer，将template转换成render
        if (!opts.render) {
            let template = opts.template;
            if (!template && el) {
                template = el.outerHTML;
            }
            const render = compilerToFunctions(template);
            opts.render = render;
        }

        // 挂载组件，将实例挂载到el上
        mountComponent(vm, el);
    };
}