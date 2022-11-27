import { nextTick } from "../util/next-tick";

let has = {};
let queue = [];
let pending = false;

function flushSchedulerQueue() {
    // 把每一个任务进行执行
    let flushQueue = queue.slice(0);
    // 执行后清空
    // 刷新的过程中，还有新的watcher，watcher可以继续放入queue中
    queue = [];
    has = {};
    pending = false;
    flushQueue.forEach((q) => q.run());
}

export function queueWatcher(watcher) {
    const id = watcher.id;
    if (has[id] != null) {
        return;
    }
    // 标识
    has[id] = true;

    // 无论watcher的update执行多少次，queueWatcher只执行一次

    queue.push(watcher);

    if (!pending) {
        // 把多次的执行合并成一次
        nextTick(flushSchedulerQueue);
        pending = true;
    }
}
