export function isFunction(value) {
    return typeof value === "function";
}

const _toString = Object.prototype.toString;
export function isPlainObject(obj) {
    return _toString.call(obj) === "[object Object]";
}

export function isObject(obj) {
    return obj !== null && typeof obj === "object";
}

export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

export const isArray = Array.isArray;

export function isNative(Ctor) {
    return typeof Ctor === "function" && /native code/.test(Ctor.toString());
}


export function parsePath(path) {
    // 'obj.a.b.c'
    const segments = path.split(".");
    return function (obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return;
            // 取值之后再把值赋回去
            obj = obj[segments[i]];
        }
        return obj;
    };
}
