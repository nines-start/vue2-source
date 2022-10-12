import { initGlobalAPI } from "./global-api";
import { initMixin } from "./instance/init";
import { lifecycleMixin } from "./instance/lifecycle";
import { stateMixin } from "./instance/state";
import { renderMixin } from "./vdom";

function Vue(options) {
    this._init(options);
}

initMixin(Vue);

stateMixin(Vue)

lifecycleMixin(Vue);

renderMixin(Vue);

initGlobalAPI(Vue)

export default Vue;




