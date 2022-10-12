import { isFunction, isObject, parsePath } from "../shared/util";
import Dep, { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./scheduler";
import { traverse } from "./traverse";

// 每个watcher都添加一个唯一值
let uid = 0;

class Watcher {
    constructor(vm, expOrFn, cb, options, isRenderWatcher) {
        if ((this.vm = vm) && isRenderWatcher) {
            vm._watcher = this;
        }

        this.id = ++uid;
        this.vm = vm;
        this.cb = cb;
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
        } else {
            this.deep = this.user = false;
        }

        if (isFunction(expOrFn)) {
            this.getter = expOrFn;
        } else {
            this.getter = parsePath(expOrFn);
        }
        this.deps = [];
        this.depIds = new Set();

        this.value = this.get();
    }

    get() {
        const vm = this.vm;
        // 将当前的watcher放到全局变量上
        // this是当前watcher实例
        pushTarget(this);

        // 首先调用一次，让页面渲染
        const value = this.getter.call(vm, vm);
        if (this.deep) {
            traverse(value);
        }

        // 视图渲染完成后，清空这个值
        popTarget();
        return value;
    }
    // 让watcher记住dep
    addDep(dep) {
        const id = dep.id;
        // 去重
        if (!this.depIds.has(id)) {
            this.deps.push(dep);
            this.depIds.add(id);
            dep.addSub(this);
        }
    }
    update() {
        queueWatcher(this);
    }
    run() {
        const vm = this.vm;
        // 新值
        const value = this.get();
        if (value !== this.value || isObject(value) || this.deep) {
            // set new value
            // 原来的值
            const oldValue = this.value;
            this.value = value;
            // 是用户的watcher
            if (this.user) {
                this.cb.call(vm, value, oldValue);
            }
        }
    }
}

export default Watcher;
