import { isArray, isObject } from "../shared/util";
import { arrayMethods } from "./array";
import Dep from "./dep";

class Observer {
    constructor(data) {
        // 相当于给对象或数组加了dep
        this.dep = new Dep();
        // define.prototype只能劫持已经存在的属性，新增的和删除的无法劫持，vue中会单独增加一些api，解决这个问题，比如，$set，$delete
        // 数组的更改索引和长度,无法被监控

        // 判断一个对象是否被观测过
        // 不能直接写value.__ob__ = this; 会产生死循环

        // 把Observer的实例放到data的属性上

        // 给数据加了一个标识，同时在外面能够获取到observeArray方法
        Object.defineProperty(data, "__ob__", {
            enumerable: false, // 不能被枚举，不能被循环出来，避免死循环
            configurable: false,
            value: this,
        });

        // 使用define.prototype重新定义属性
        if (Array.isArray(data)) {
            // 劫持数组push，unshift等改变原有数组的方法
            // 同时还要避免原来原型上的方法被覆盖，也就是说只有部分方法被重写
            data.__proto__ = arrayMethods;

            // 如果数组中存在对象，变化也要监测
            // 数组中普通类型值是不做劫持的
            this.observeArray(data);
        } else {
            this.observeObject(data);
        }
    }
    observeArray(data) {
        data.forEach((item) => observer(item));
    }
    // 循环对象，属性依次劫持

    observeObject(data) {
        let keys = Object.keys(data);
        keys.forEach((key) => {
            defineReactive(data, key, data[key]);
        });
    }
}
export function defineReactive(data, key, value) {
    // 如果value是对象，继续observer
    // 递归，层次越深，性能越低
    let childOb = observer(value);

    // 给每个属性都添加一个dep
    let dep = new Dep();

    // 这是一个闭包的形式，get和set都可以获取value，value不销毁
    Object.defineProperty(data, key, {
        // 取值时依赖收集
        get() {
            // 让dep记住当前的watcher
            if (Dep.target) {
                // 属性收集器，记住当前的watcher
                dep.depend();

                if (childOb) {
                    childOb.dep.depend();
                    if (isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return value;
        },
        // 修改时依赖更新
        set(newValue) {
            if (newValue === value) return;

            // 新设置的值可能也是对象,所以需要继续监测
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
    // 如果被劫持过，就不需要在劫持了，所以需要判断这个对象是否被劫持过，可以添加一个实例
    if (data.__ob__) {
        return data;
    }
    return new Observer(data);
}

function dependArray(value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i];
        if (e && e.__ob__) {
            e.__ob__.dep.depend();
        }
        if (isArray(e)) {
            dependArray(e);
        }
    }
}
