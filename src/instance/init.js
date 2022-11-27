import { compilerToFunctions } from "../compiler";
import { mergeOptions } from "../util/options";
import { callHook, mountComponent } from "./lifecycle";
import { initState } from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        // 需要将用户自定义的options和全局的options合并
        vm.$options = mergeOptions(vm.constructor.options, options);

        // 初始化之前调用beforeCreate
        callHook(vm, "beforeCreate");
        
        // 初始化状态     
        initState(vm);
        
        callHook(vm, "created");

        // 如果当前有el属性，说明要进行模板渲染
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    };
    // 挂载操作
    Vue.prototype.$mount = function (el) {
        // 查找dom元素
        const vm = this;
        const opts = vm.$options;
        el = document.querySelector(el);

        // 没有render，将template转换成render
        if (!opts.render) {
            // 根据生命周期图示，有el，有template才会进行编译的操作，把模板编译成render函数
            let template = opts.template;
            if (!template && el) {
                // 获取整个app的div，包括外层元素
                template = el.outerHTML;
            }
            // 将模板编译成render
            const render = compilerToFunctions(template);
            opts.render = render;
        }

        // 挂载组件，将实例挂载到el上
        mountComponent(vm, el);
    };
}

