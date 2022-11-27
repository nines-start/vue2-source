import { mergeOptions } from "../util/options";
export function initMixin(Vue) {
    // 全局定义的属性和方法都放在了vm.$options上面，所以要进行options合并
    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
        return this;
    };
}
