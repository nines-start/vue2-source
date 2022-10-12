import { nextTick } from "../util/next-tick";

let has = {};
let queue = [];
let pending = false;

function flushSchedulerQueue() {
    let flushQueue = queue.slice(0);
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
    has[id] = true;
    queue.push(watcher);

    if (!pending) {
        nextTick(flushSchedulerQueue);
        pending = true;
    }
}
