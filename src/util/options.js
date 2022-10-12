import { hasOwn, isArray } from "../shared/util";

import { LIFECYCLE_HOOKS } from "../shared/constants";


// 定义一个策略对象
const strats = Object.create(null);

LIFECYCLE_HOOKS.forEach((hook) => {
    strats[hook] = mergeLifecycleHook;
});

const defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
};
// 生命周期的合并
export function mergeLifecycleHook(parentVal, childVal) {
    const res = childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : isArray(childVal)
            ? childVal
            : [childVal]
        : parentVal;
    return res ? dedupeHooks(res) : res;
}

function dedupeHooks(hooks) {
    const res = [];
    for (let i = 0; i < hooks.length; i++) {
        if (res.indexOf(hooks[i]) === -1) {
            res.push(hooks[i]);
        }
    }
    return res;
}

export function mergeOptions(parent, child) {
    const options = {}; 
    
    for (const key in parent) {
        mergeField(key);
    }

    for (const key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key);
        }
    }

    // 合并字段
    function mergeField(key) {
        const strat = strats[key] || defaultStrat;
        options[key] = strat(parent[key], child[key]);
    }       
    return options;
}