import { nextTick } from "../util/next-tick";
import { initMixin } from "./mixin";

// 全局公共方法
export function initGlobalAPI(Vue) {
    Vue.options = Object.create(null);
    initMixin(Vue);
    Vue.nextTick = nextTick;
}

