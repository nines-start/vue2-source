import { observer } from "../observer/index";
import { isFunction, isPlainObject } from "../shared/until";

export function initState(vm) {
    const opts = vm.$options;
    if (opts.data) {
        initData(vm);
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

    // 将data放到实例vm上
    vm._data = data = isFunction(data) ? data.call(vm) : data || {};
    if (!isPlainObject(data)) {
        data = {};
        console.error("[Vue warn] data functions should return an object");
    }

    observer(data);
    // 将vm._data用vm代理
    for (const key in data) {
        proxy(vm, "_data", key);
    }
}
