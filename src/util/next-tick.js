import { isNative } from "../shared/util";

let callbacks = [];

let pending = false;

// nextTick中没有直接使用某个api，而是采用优雅降级的方式
// 内部先采用Promise，如果不兼容就采用MutationObserver()，然后是seImmediate（ie专用），最后是setTimeout
// 这些api是在浏览器中执行的，node不支持
let timerFunc;

if (typeof Promise !== "undefined" && isNative(Promise)) {
    const p = Promise.resolve();
    timerFunc = () => {
        p.then(flushCallbacks);
    };
} else if (
    typeof MutationObserver !== "undefined" &&
    (isNative(MutationObserver) ||
        MutationObserver.toString() === "[object MutationObserverConstructor]")
) {
    let counter = 1;
    const observer = new MutationObserver(flushCallbacks);
    const textNode = document.createTextNode(String(counter));
    // 监控文本的数据，并监控文本节点中字符的变化
    observer.observe(textNode, {
        characterData: true,
    });
    timerFunc = () => {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
    };
} else if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
    timerFunc = () => {
        setImmediate(flushCallbacks);
    };
} else {
    // Fallback to setTimeout.
    timerFunc = () => {
        setTimeout(flushCallbacks, 0);
    };
}

function flushCallbacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0; // 清空callback
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}       

// nextTick不是创建了异步任务，而是将这个任务维护到队列中

export function nextTick(cb, ctx) {
    callbacks.push(cb);
    if (!pending) {
        pending = true;
        timerFunc();
    }
}
