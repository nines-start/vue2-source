let uid = 0;

class Dep {
    constructor() {
        this.id = uid++;
        // 存放当前属性对应的watcher
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    depend() {
        // 希望让当前的target也能记住dep
        Dep.target.addDep(this);
    }
    notify() {
        this.subs.forEach((watcher) => watcher.update());
    }
}

// 添加一个全局变量,，保存当前的watcher
Dep.target = null;

const targetStack = [];

export function pushTarget(target = null) {
    targetStack.push(target);
    Dep.target = target;
}

export function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
}
export default Dep;
