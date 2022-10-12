import { observer } from "../observer/index";
import Watcher from "../observer/watcher";
import { isArray, isFunction, isPlainObject } from "../shared/util";

export function initState(vm) {
    const opts = vm.$options;
    if (opts.data) {
        initData(vm);
    }
    if (opts.watch) {
        initWatch(vm, opts.watch);
    }
}
// 设置一个数据代理,取值和设置值的时候直接操作vm._data
function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key];
        },
        set(newValue) {
            vm[target][key] = newValue;
        },    
    });
}

function initData(vm) {
    let data = vm.$options.data;

    vm._data = data = isFunction(data) ? data.call(vm) : data || {};
    if (!isPlainObject(data)) {
        data = {};
        console.error("[Vue warn] data functions should return an object");
    }

    observer(data);

    for (const key in data) {
        proxy(vm, "_data", key);
    }
}

function initWatch(vm, watch) {
    // 拿到watch后，循环watch
    for (const key in watch) {
        // 拿到watcher对应的方法 可能是string | Function | Object | Array
        const handler = watch[key];
        if (isArray(handler)) {
            // 如果是数组，循环数组
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i]);
            }
        } else {
            createWatcher(vm, key, handler);
        }
    }
}

function createWatcher(vm, expOrFn, handler, options) {
    if (isPlainObject(handler)) {
        options = handler;
        handler = handler.handler;
    }
    if (typeof handler === "string") {
        handler = vm[handler];
    }
    // 最终调用的是vm.$watch
    return vm.$watch(expOrFn, handler, options);
}

export function stateMixin(Vue) {
    // watch的核心是new Watcher
    Vue.prototype.$watch = function (expOrFn, cb, options) {
        const vm = this;
        options = options || {}
        options.user = true;
        new Watcher(vm, expOrFn, cb, options);
        // 如果是immediate就立即执行操作函数
        if (options.immediate) {
            cb.call(vm);
        }
    };
}