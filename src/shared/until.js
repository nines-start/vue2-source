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
