import Dep from "../observer/dep";
import { observer } from "../observer/index";
import Watcher from "../observer/watcher";
import { isArray, isFunction, isPlainObject, noop } from "../shared/util";

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop,
};

export function initState(vm) {
    const opts = vm.$options;
    // 数据劫持
    if (opts.data) {
        initData(vm);
    }
    if (opts.watch) {
        initWatch(vm, opts.watch);
    }

    if (opts.computed) {
        initComputed(vm, opts.computed);
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

    // 将data方到实例vm上
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
            // 其他情况
            createWatcher(vm, key, handler);
        }
    }
}

// 第二个参数可能是key或者一个函数
// 在使用vm.$watch()这种方式时，传给vm.$watch()的是一个函数，此时的参数是会获取这个函数的返回结果
function createWatcher(vm, expOrFn, handler, options) {
    // handler 可能是string | Function | Object
    // options用来添加标识
    if (isPlainObject(handler)) {
        // 如果是对象，将对象中的handler取出来
        // 然后将其他选项放入options，例如deep：true，immediate：true等选项
        options = handler;
        handler = handler.handler;
    }
    if (typeof handler === "string") {
        // 去当前实例上将方法取出来,赋给handler
        handler = vm[handler];
    }
    // 最终调用的是vm.$watch
    return vm.$watch(expOrFn, handler, options);
}

const computedWatcherOptions = { lazy: true };

function initComputed(vm, computed) {
    // 将计算属性watcher保存到vm上
    const watchers = (vm._computedWatchers = Object.create(null));

    for (const key in computed) {
        const userDef = computed[key];
        const getter = isFunction(userDef) ? userDef : userDef.get;

        // 将属性和watcher对应起来
        watchers[key] = new Watcher(
            vm,
            getter || noop,
            noop,
            computedWatcherOptions
        );

        defineComputed(vm, key, userDef);
    }
}

function defineComputed(target, key, userDef) {
    if (isFunction(userDef)) {
        sharedPropertyDefinition.get = createComputedGetter(key);
        sharedPropertyDefinition.set = noop;
    } else {
        sharedPropertyDefinition.get = userDef.get
            ? createComputedGetter(key)
            : noop;

        sharedPropertyDefinition.set = userDef.set || noop;
    }

    if (sharedPropertyDefinition.set === noop) {
        sharedPropertyDefinition.set = function () {
            console.error(
                `Computed property "${key}" was assigned to but it has no setter.`
            );
        };
    }

    Object.defineProperty(target, key, sharedPropertyDefinition);
}

// 检测是否执行这个getter
function createComputedGetter(key) {
    return function computedGetter() {
        // 获取到对应属性的watcher
        const watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
            if (watcher.dirty) {
                // 此时watcher栈中有两个watcher
                watcher.evaluate();
            }

            if (Dep.target) {
                watcher.depend();
            }

            // 将值返回
            return watcher.value;
        }
    };
}

export function stateMixin(Vue) {
    // watch的核心是new Watcher
    Vue.prototype.$watch = function (expOrFn, cb, options) {
        const vm = this;
        // 标识是一个用户watcher
        options = options || {};
        new Watcher(vm, expOrFn, cb, options);
        // 如果是immediate就立即执行操作函数
        if (options.immediate) {
            cb.call(vm);
        }
    };
}
