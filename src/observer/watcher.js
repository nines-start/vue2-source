import { isFunction } from "../shared/until";
import Dep, { popTarget, pushTarget } from "./dep";

// 每个watcher都添加一个唯一值
let uid = 0;

class Watcher {
    constructor(vm, expOrFn, cb, options, isRenderWatcher) {
        this.id = ++uid;
        this.vm = vm;
        this.cb = cb;
        if (isFunction(expOrFn)) {
            this.getter = expOrFn;
        }
        this.deps = [];
        this.depIds = new Set();

        this.get();
    }

    get() {
        // 将当前的watcher放到全局变量上
        // this是当前watcher实例
        pushTarget(this);

        // 首先调用一次，让页面渲染
        this.getter();

        // 视图渲染完成后，清空这个值
        popTarget();
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
        this.get();
    }
}

export default Watcher;
