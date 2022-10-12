import { isNative } from "../shared/util";

let callbacks = [];

let pending = false;

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

export function nextTick(cb, ctx) {
    callbacks.push(cb);
    if (!pending) {
        pending = true;
        timerFunc();
    }
}
