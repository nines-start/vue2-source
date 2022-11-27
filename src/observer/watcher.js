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

        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
        } else {
            this.deep = this.user = this.lazy = false;
        }

        this.id = ++uid;
        this.vm = vm;
        this.cb = cb;
        this.dirty = this.lazy; // for lazy watchers

        this.deps = [];
        this.depIds = new Set();

        if (isFunction(expOrFn)) {
            // 调用getter意味着会发生取值操作
            this.getter = expOrFn;
        } else {
            this.getter = parsePath(expOrFn);
        }
        // this.newDeps = [];
        // this.newDepIds = new Set();

        // 默认会调用一次get方法，进行取值，将结果保存起来
        this.value = this.lazy ? undefined : this.get();
    }

    get() {
        const vm = this.vm;
        // 将当前的watcher放到全局变量上
        // this是当前watcher实例
        pushTarget(this);
        // 首先调用一次，让页面渲染,此时会取值,调用defineProperty 的get方法里,
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
        // 多次重复取值，watcher就会多次保存dep，所以要去重
        if (!this.depIds.has(id)) {
            this.deps.push(dep);
            this.depIds.add(id);
            dep.addSub(this);
        }
    }
    update() {
        // 把当前的watcher都保存起来，不立即更新
        // 依赖的值发生变化，就将dirty的值改为true，开启更新
        if (this.lazy) {
            this.dirty = true;
        } else {
            queueWatcher(this);
        }
    }

    run() {
        const vm = this.vm;
        // 新值
        const value = this.get();
        if (value !== this.value || isObject(value) || this.deep) {
            // set new value
            const oldValue = this.value;
            this.value = value;
            // 是用户的watcher
            if (this.user) {
                this.cb.call(vm, value, oldValue);
            }
        }
    }
    evaluate() {
        // 执行完成后的结果也要保存下来
        // 此时调用的get方法，内部的getter相当于是用户传入的函数
        this.value = this.get();
        // 修改标识
        this.dirty = false; 
    }
    depend() {
        let i = this.deps.length;
        while (i--) {
            this.deps[i].depend();
        }
    }
}

export default Watcher;
