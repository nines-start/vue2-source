import { initGlobalAPI } from "./global-api";
import { initMixin } from "./instance/init";
import { lifecycleMixin } from "./instance/lifecycle";
import { stateMixin } from "./instance/state";
import { renderMixin } from "./vdom";

// options：用户传入的选项
function Vue(options) {
  this._init(options);
}

/* 原型方法 */

initMixin(Vue); // 扩展了init方法

stateMixin(Vue);

// 混合生命周期渲染
lifecycleMixin(Vue);
// render
renderMixin(Vue);

/* 静态方法 */
initGlobalAPI(Vue);

// 导出
export default Vue;
