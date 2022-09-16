import { isObject } from "../shared/until";
import { arrayMethods } from "./array";
import Dep from "./dep";

class Observer {
    constructor(data) {
        Object.defineProperty(data, "__ob__", {
            enumerable: false,
            configurable: false,
            value: this,
        });

        // 使用define.prototype重新定义属性
        if (Array.isArray(data)) {
            data.__proto__ = arrayMethods;
            this.observeArray(data);
        } else {
            this.observeObject(data);
        }
    }
    observeArray(data) {
        data.forEach((item) => observer(item));
    }

    observeObject(data) {
        let keys = Object.keys(data);
        keys.forEach((key) => {
            defineReactive(data, key, data[key]);
        });
    }
}
export function defineReactive(data, key, value) {
    observer(value);

    // 给每个属性都添加一个dep
    let dep = new Dep();

    // 这是一个闭包的形式，get和set都可以获取value，value不销毁
    Object.defineProperty(data, key, {
        get() {
            // 让dep记住当前的watcher
            if (Dep.target) {
                // 属性收集器，记住当前的watcher
                dep.depend();
            }

            return value;
        },
        set(newValue) {
            if (newValue === value) return;

            // 新设置的值可能也是对象,所以需要继续劫持
            observer(newValue);
            value = newValue;

            dep.notify();
        },
    });
}

export function observer(data) {
    if (!isObject(data)) {
        return;
    }
    if (data.__ob__) {
        return data;
    }
    return new Observer(data);
}
