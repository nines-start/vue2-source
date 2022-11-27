// 数组原来原型上的方法
let oldArrayProtoMethods = Array.prototype;

// 继承方法
export let arrayMethods = Object.create(oldArrayProtoMethods);

let methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"];

// 如果存在重写的方法，就调用重写的，如果没有，就调用原来的
methods.forEach((method) => {
    arrayMethods[method] = function (...args) {
        // const result = oldArrayProtoMethods[method].apply(this, args);
        const result = oldArrayProtoMethods[method].call(this, ...args);

        // 对新增的数据需要再次劫持

        let insert = null;
        let ob = this.__ob__;
        // 数组中新添加的项有可能也是对象
        switch (method) {
            // 这两个都是追加，追加的内容可能是数组
            case "push":
            case "unshift":
                insert = args;
                break;

            case "splice": 
                // splice添加时，第二个参数是新增的内容
                insert = args.slice(2);
            default:
                break;
        } 
        // 给数组新增的值也要观测
        if (insert) ob.observeArray(insert);
        ob.dep.notify();
        return result;
    };
});
