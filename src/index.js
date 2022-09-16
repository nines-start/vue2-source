import { initMixin } from "./instance/init";
import { lifecycleMixin } from "./instance/lifecycle";
import { renderMixin } from "./vdom";

// options：用户传入的选项
function Vue(options) {
    this._init(options);
}

// 将initMixin引入，并将Vue传过去，相当于扩展了init方法
initMixin(Vue);

// 混合生命周期 渲染
lifecycleMixin(Vue);
// render 
renderMixin(Vue);

// 导出
export default Vue;
