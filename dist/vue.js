(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function isFunction(value) {
    return typeof value === "function";
  }
  var _toString = Object.prototype.toString;
  function isPlainObject(obj) {
    return _toString.call(obj) === "[object Object]";
  }
  function isObject(obj) {
    return obj !== null && _typeof(obj) === "object";
  }
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }
  var isArray = Array.isArray;
  function isNative(Ctor) {
    return typeof Ctor === "function" && /native code/.test(Ctor.toString());
  }
  function parsePath(path) {
    // 'obj.a.b.c'
    var segments = path.split(".");
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) return; // 取值之后再把值赋回去

        obj = obj[segments[i]];
      }

      return obj;
    };
  }
  function noop(a, b, c) {}
  function isUndef(v) {
    return v === undefined || v === null;
  }
  function isDef(v) {
    return v !== undefined && v !== null;
  }

  var callbacks = [];
  var pending$1 = false; // nextTick中没有直接使用某个api，而是采用优雅降级的方式
  // 内部先采用Promise，如果不兼容就采用MutationObserver()，然后是seImmediate（ie专用），最后是setTimeout
  // 这些api是在浏览器中执行的，node不支持

  var timerFunc;

  if (typeof Promise !== "undefined" && isNative(Promise)) {
    var p = Promise.resolve();

    timerFunc = function timerFunc() {
      p.then(flushCallbacks);
    };
  } else if (typeof MutationObserver !== "undefined" && (isNative(MutationObserver) || MutationObserver.toString() === "[object MutationObserverConstructor]")) {
    var counter = 1;
    var observer$1 = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter)); // 监控文本的数据，并监控文本节点中字符的变化

    observer$1.observe(textNode, {
      characterData: true
    });

    timerFunc = function timerFunc() {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
    timerFunc = function timerFunc() {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    timerFunc = function timerFunc() {
      setTimeout(flushCallbacks, 0);
    };
  }

  function flushCallbacks() {
    pending$1 = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0; // 清空callback

    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  } // nextTick不是创建了异步任务，而是将这个任务维护到队列中


  function nextTick(cb, ctx) {
    callbacks.push(cb);

    if (!pending$1) {
      pending$1 = true;
      timerFunc();
    }
  }

  var LIFECYCLE_HOOKS = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed", "activated", "deactivated", "errorCaptured", "serverPrefetch", "renderTracked", "renderTriggered"];

  // 不同的钩子使用相同的策略
  // 相当于if()else if() else(){}...的形式
  // 定义一个策略对象

  var strats = Object.create(null);
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeLifecycleHook;
  });

  var defaultStrat = function defaultStrat(parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
  }; // 生命周期的合并


  function mergeLifecycleHook(parentVal, childVal) {
    // 最终合并的是一个数组
    var res = childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
    return res ? dedupeHooks(res) : res;
  }

  function dedupeHooks(hooks) {
    var res = [];

    for (var i = 0; i < hooks.length; i++) {
      if (res.indexOf(hooks[i]) === -1) {
        res.push(hooks[i]);
      }
    }

    return res;
  }

  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      if (!hasOwn(parent, _key)) {
        mergeField(_key);
      }
    } // 合并字段


    function mergeField(key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key]);
    }

    return options;
  }

  function initMixin$1(Vue) {
    // 全局定义的属性和方法都放在了vm.$options上面，所以要进行options合并
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
  }

  function initGlobalAPI(Vue) {
    Vue.options = Object.create(null);
    initMixin$1(Vue);
    Vue.nextTick = nextTick;
  }

  // 匹配{{}}
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配文本标签

  function parseText(text) {
    if (!defaultTagRE.test(text)) {
      // 如果是普通文本，不带双括号的文本
      return "_v(".concat(JSON.stringify(text), ")");
    }

    var tokens = []; // 如果正则匹配是全局模式，需要每次置为 0

    var lastIndex = defaultTagRE.lastIndex = 0; // 匹配到的结果

    var match; // 保存匹配到的索引

    var index;

    while (match = defaultTagRE.exec(text)) {
      index = match.index;

      if (index > lastIndex) {
        // 说明是文本
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }

      tokens.push("_s(".concat(match[1].trim(), ")")); // 当前索引加上匹配字符串的长度

      lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }

    return tokens.join("+");
  }

  function genProps(ast) {
    var attrs = ast.attrs;
    var str = ""; // 遍历attrs

    for (var i = 0; i < attrs.length; i++) {
      var at = attrs[i]; // style属性需要单独处理
      // 样式  style="background-color: red" 需要把冒号转成对象

      if (at.name === "style") {
        (function () {
          var obj = {}; // 先用分号分隔，再用冒号分隔

          at.value.split(";").forEach(function (item) {
            var _item$split = item.split(":"),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          at.value = obj;
        })();
      } // 其他情况可以直接拼接
      // 多个属性之间需要使用逗号


      str += "".concat(at.name, ":").concat(JSON.stringify(at.value), ",");
    } // 删除最后一个，


    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(ast) {
    // 判断是否有子元素
    var children = ast.children; // 需要把子元素拼接在一起，用逗号拼接起来

    if (children) {
      return children.map(function (child) {
        return genNode(child);
      }).join(",");
    }
  }

  function genNode(node) {
    // 节点可能有两种类型，一种是文本，一种是标签
    if (node.type === 1) {
      return genElement(node);
    } else {
      var text = node.text;
      return "_v(".concat(parseText(text), ")");
    }
  } // 这部分的核心是字符串拼接，处理成想要的形式


  function genElement(ast) {
    var props = genProps(ast);
    var children = genChildren(ast); // 首先解析出根元素
    // 如果attrs存在，就解析attrs，否则是一个null字符串

    var code = "_c('".concat(ast.tag, "',\n    ").concat(ast.attrs.length > 0 ? "".concat(props) : "null").concat(children ? ",".concat(children) : "", ")");
    return code;
  }

  function generate(ast) {
    var code = ast ? genElement(ast) : '_c("div")'; // 使用with的作用，去this上取值

    return {
      render: "with(this){return ".concat(code, "}")
    };
  }

  // 匹配属性
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // ?:匹配不捕获，捕获xx:yy这种类型的标签

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 标签开头
  // `<` 开头 +（ `a-z`或`A-Z`或`_`）+（`-`或`.`或`0-9`或`_`或`a-z`或`A-Z`）+ （`:`可选） +（ `a-z`或`A-Z`或`_`）+（`-`或`.`或`0-9`或`_`或`a-z`或`A-Z`）
  // 所以标签可能有两种情况，一种是`<div`，另一种是`<div:xxx`,带有命名空间的形式。

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配标签结束

  var startTagClose = /^\s*(\/?)>/; // 结尾标签

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  function parseHTML(html) {
    // 树根
    var root; // 当前的父标签，永远指向栈中最后一个

    var currentParent; // 栈结构

    var stack = [];
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3; // 只要html不为空，就一直循环解析

    while (html) {
      var textEnd = html.indexOf("<"); // 等于0 ，是标签

      if (textEnd === 0) {
        var startTagMatch = parseStartTag(); // 开始标签

        if (startTagMatch) {
          handleStartTag(startTagMatch);
          continue;
        } // 结束标签


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          handleEndTag(endTagMatch[1]);
          advance(endTagMatch[0].length);
        }
      } // 是文本


      var text = void 0;

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        charts(text);
        advance(text.length);
      }
    } // 截取的方法 step是截取的位置,substring不传结束索引end，会一直截取到末尾
    // 将字符串进行截取操作，然后替换html


    function advance(n) {
      html = html.substring(n);
    } // 匹配开始标签


    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        // 匹配到后将标签名和属性拿出来，放到一个对象里面
        var match = {
          tagName: start[1],
          attrs: []
        }; // 获取标签后删除

        advance(start[0].length); // 如果没有遇到闭合标签，说明没有属性
        // 而且还要能匹配到属性

        var end, attr; // 不是开始标签的结束，并且是属性就一直匹配

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 使用双引号，属性值是第3项，使用单引号，是第四项不用引号是是第五项
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          }); // 获取属性后删除

          advance(attr[0].length);
        }

        if (end) {
          advance(end[0].length);
          return match;
        }
      }
    } // 创建ast语法树


    function createASTElement(tagName, attrs) {
      return {
        // 标签名
        tag: tagName,
        // 标签type是1
        type: ELEMENT_TYPE,
        // 子节点
        children: [],
        // 属性
        attrs: attrs,
        // 父节点
        parent: null
      };
    } // 处理开始标签


    function handleStartTag(match) {
      // 匹配元素出栈后，此时栈中最后一个元素是出栈元素的父亲。
      var tagName = match.tagName,
          attrs = match.attrs;
      var element = createASTElement(tagName, attrs); // 第一次调用的是树根

      if (!root) {
        root = element;
      } // 当前解析的标签保存为父标签


      currentParent = element; // 将开始标签元素放入栈中

      stack.push(element);
    } // 处理结束标签，在结尾标签闭合时，可以创建父子关系


    function handleEndTag(tagName) {
      // 取出栈中最后一个标签
      var element = stack.pop(); // 当前父元素也要变成前一个元素

      currentParent = stack[stack.length - 1]; // 元素闭合时，可以知道这个标签的父亲是谁
      // 同时也知道这个父亲的子元素

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function charts(text) {
      text = text.trim(); // 如果有文本，就将文本放入当前的父标签

      if (text) {
        currentParent.children.push({
          // 文本类型是3
          type: TEXT_TYPE,
          text: text
        });
      }
    }

    return root;
  }

  function compilerToFunctions(template) {
    // 将html代码转成语法树
    var ast = parseHTML(template); // 通过ast,生成新的代码

    var code = generate(ast); // 生成render函数

    var render = new Function(code.render);
    return render;
  }

  var uid$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = uid$1++; // 存放当前属性对应的watcher

      this.subs = [];
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(sub) {
        this.subs.push(sub);
      }
    }, {
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }(); // 添加一个全局变量,，保存当前的watcher


  Dep.target = null;
  var targetStack = []; // 单线程思想

  function pushTarget() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    targetStack.push(target);
    Dep.target = target;
  }
  function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
  }

  var has = {};
  var queue = [];
  var pending = false;

  function flushSchedulerQueue() {
    // 把每一个任务进行执行
    var flushQueue = queue.slice(0); // 执行后清空
    // 刷新的过程中，还有新的watcher，watcher可以继续放入queue中

    queue = [];
    has = {};
    pending = false;
    flushQueue.forEach(function (q) {
      return q.run();
    });
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] != null) {
      return;
    } // 标识


    has[id] = true; // 无论watcher的update执行多少次，queueWatcher只执行一次

    queue.push(watcher);

    if (!pending) {
      // 把多次的执行合并成一次
      nextTick(flushSchedulerQueue);
      pending = true;
    }
  }

  var seenObjects = new Set();
  function traverse(val) {
    _traverse(val, seenObjects);

    seenObjects.clear();
    return val;
  }

  function _traverse(val, seen) {
    var i, keys;
    var isA = isArray(val);

    if (val.__ob__) {
      var depId = val.__ob__.dep.id;

      if (seen.has(depId)) {
        return;
      }

      seen.add(depId);
    }

    if (isA) {
      i = val.length;

      while (i--) {
        _traverse(val[i], seen);
      }
    } else {
      keys = Object.keys(val);
      i = keys.length;

      while (i--) {
        _traverse(val[keys[i]], seen);
      }
    }
  }

  var uid = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
      _classCallCheck(this, Watcher);

      if ((this.vm = vm) && isRenderWatcher) {
        vm._watcher = this;
      }

      if (options) {
        this.deep = !!options.deep;
        this.user = !!options.user;
        this.lazy = !!options.lazy;
      } else {
        this.deep = this.user = this.lazy = false;
      }

      this.id = ++uid;
      this.vm = vm;
      this.cb = cb;
      this.dirty = this.lazy; // for lazy watchers

      this.deps = [];
      this.depIds = new Set();

      if (isFunction(expOrFn)) {
        // 调用getter意味着会发生取值操作
        this.getter = expOrFn;
      } else {
        this.getter = parsePath(expOrFn);
      } // this.newDeps = [];
      // this.newDepIds = new Set();
      // 默认会调用一次get方法，进行取值，将结果保存起来


      this.value = this.lazy ? undefined : this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        var vm = this.vm; // 将当前的watcher放到全局变量上
        // this是当前watcher实例

        pushTarget(this); // 首先调用一次，让页面渲染,此时会取值,调用defineProperty 的get方法里,

        var value = this.getter.call(vm, vm);

        if (this.deep) {
          traverse(value);
        } // 视图渲染完成后，清空这个值


        popTarget();
        return value;
      } // 让watcher记住dep

    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id; // 去重
        // 多次重复取值，watcher就会多次保存dep，所以要去重

        if (!this.depIds.has(id)) {
          this.deps.push(dep);
          this.depIds.add(id);
          dep.addSub(this);
        }
      }
    }, {
      key: "update",
      value: function update() {
        // 把当前的watcher都保存起来，不立即更新
        // 依赖的值发生变化，就将dirty的值改为true，开启更新
        if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        var vm = this.vm; // 新值

        var value = this.get();

        if (value !== this.value || isObject(value) || this.deep) {
          // set new value
          var oldValue = this.value;
          this.value = value; // 是用户的watcher

          if (this.user) {
            this.cb.call(vm, value, oldValue);
          }
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        // 执行完成后的结果也要保存下来
        // 此时调用的get方法，内部的getter相当于是用户传入的函数
        this.value = this.get(); // 修改标识

        this.dirty = false;
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;

        while (i--) {
          this.deps[i].depend();
        }
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, vnode) {
    if (isUndef(oldVnode)) {
      createElm(vnode);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);

      if (isRealElement) {
        var el = oldVnode;
        var parent = el.parentNode;
        var newEle = createElm(vnode);
        parent.insertBefore(newEle, el.nextSibling);
        parent.removeChild(el);
        return newEle;
      } else {
        // 执行diff算法更新
        patchVnode(oldVnode, vnode);
      }
    }
  }

  function createElm(vnode) {
    var tag = vnode.tag,
        data = vnode.data,
        children = vnode.children,
        text = vnode.text;

    if (typeof tag === "string") {
      // 标签
      vnode.el = document.createElement(tag);
      patchProps(vnode.el, {}, data);
      children.forEach(function (element) {
        // 将子元素也处理成真实节点
        vnode.el.appendChild(createElm(element));
      });
    } else {
      // 文本
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function patchProps(el) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var oldStyle = oldProps.style || {};
    var newStyle = props.style || {};

    for (var key in oldStyle) {
      if (!Object.hasOwnProperty.call(newStyle, key)) {
        el.style[key] = "";
      }
    }

    for (var _key in oldProps) {
      if (!Object.hasOwnProperty.call(props, _key)) {
        el.removeAttribute(_key);
      }
    }

    for (var _key2 in props) {
      if (_key2 === "style") {
        for (var styleName in props.style) {
          el.style[styleName] = props.style[styleName];
        }
      } else if (_key2 === "class") {
        el.className = props["class"];
      } else {
        el.setAttribute(_key2, props[_key2]);
      }
    }
  }

  function patchVnode(oldVnode, vnode) {
    if (oldVnode === vnode) {
      return;
    } // 如果元素不相同，直接替换


    var el = createElm(vnode);

    if (!sameVnode(oldVnode, vnode)) {
      oldVnode.el.parentNode.replaceChild(el, oldVnode.el);
      return el;
    } // 复用原来的节点标签


    el = vnode.el = oldVnode.el; // 文本没有标签

    if (!oldVnode.tag) {
      if (oldVnode.text !== vnode.text) {
        // 用新的文本替换原来的
        oldVnode.el.textContent = vnode.text;
      }
    } // 如果是标签，对比标签的属性


    patchProps(vnode.el, oldVnode.data, vnode.data);
    var oldCh = oldVnode.children || [];
    var ch = vnode.children || [];

    if (oldCh.length > 0 && ch.length > 0) {
      updateChildren(el, oldCh, ch);
    } else if (ch.length > 0) {
      for (var key in ch) {
        if (Object.hasOwnProperty.call(ch, key)) {
          var child = ch[key];
          el.appendChild(createElm(child));
        }
      }
    } else if (oldCh.length > 0) {
      el.innerHTML = "";
    }
  }

  function sameVnode(a, b) {
    return a.tag === b.tag && a.key === b.key;
  }

  function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, key;
    var map = {};

    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) map[key] = i;
    }

    return map;
  }

  function updateChildren(parentElm, oldCh, newCh) {
    // 原来子节点集合的起始索引
    var oldStartIdx = 0; // 原来子节点集合的结束索引

    var oldEndIdx = oldCh.length - 1; // 原来子节点集合的起始元素

    var oldStartVnode = oldCh[0]; // 原来子节点集合的末尾元素

    var oldEndVnode = oldCh[oldEndIdx]; // 新子节点集合的起始索引

    var newStartIdx = 0; // 新子节点集合的结束索引

    var newEndIdx = newCh.length - 1; // 新子节点集合的起始元素

    var newStartVnode = newCh[0]; // 新子节点集合的末尾元素

    var newEndVnode = newCh[newEndIdx]; // 如果有一方起始指针等于结束指针的索引，就结束对比

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx];
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        //  如果当前的元素相同，就更新属性，然后再比较子元素
        patchVnode(oldStartVnode, newStartVnode);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        patch(oldStartVnode, newEndVnode);
        parentElm.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--oldEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        patch(oldEndVnode, newStartVnode);
        parentElm.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        var oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        var moveIndex = oldKeyToIdx[newStartVnode.key]; // 说明没有复用，不需要移动

        if (isUndef(moveIndex)) {
          parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          var moveVnode = oldCh[oldKeyToIdx];
          oldCh[oldKeyToIdx] = null;
          parentElm.insertBefore(moveVnode.el, oldStartVnode.el);
          patch(moveVnode, newStartVnode);
        }

        newStartVnode = newCh[++newStartIdx];
      }
    }

    if (newStartIdx <= newEndIdx) {
      for (var i = newStartIdx; i <= newEndIdx; i++) {
        var ele = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el;
        parentElm.insertBefore(createElm(newCh[i]), ele);
      }
    }

    if (oldStartIdx <= oldEndIdx) {
      for (var _i = oldStartIdx; _i <= oldEndIdx; _i++) {
        var child = oldCh[_i];

        if (isDef(child)) {
          parentElm.removeChild(child.el);
        }
      }
    }
  }

  function lifecycleMixin(Vue) {
    // 将vnode转换成真实dom
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var el = vm.$el; // patch既有初始化的功能，也有更新的功能
      // 将patch生成的el重新赋值给$el

      vm.$el = patch(el, vnode);
    };
  }
  function mountComponent(vm, el) {
    // 挂载之前调用beforeMount
    callHook(vm, "beforeMount");
    vm.$el = el; // 1.调用render方法产生虚拟节点
    // 2.根据虚拟dom产生真实dom
    // 3.将真实dom插入到el中
    // vm._update(vm._render());
    // 渲染和更新时调用的方法

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    }; // isRenderWatcher参数为true，代表是一个渲染watcher


    new Watcher(vm, updateComponent, function () {}, {}, true); // 挂载后调用mounted

    callHook(vm, "mounted");
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        handlers[i].call(vm);
      }
    }
  }

  // 数组原来原型上的方法
  var oldArrayProtoMethods = Array.prototype; // 继承方法

  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"]; // 如果存在重写的方法，就调用重写的，如果没有，就调用原来的

  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayProtoMethods;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // const result = oldArrayProtoMethods[method].apply(this, args);
      var result = (_oldArrayProtoMethods = oldArrayProtoMethods[method]).call.apply(_oldArrayProtoMethods, [this].concat(args)); // 对新增的数据需要再次劫持


      var insert = null;
      var ob = this.__ob__; // 数组中新添加的项有可能也是对象

      switch (method) {
        // 这两个都是追加，追加的内容可能是数组
        case "push":
        case "unshift":
          insert = args;
          break;

        case "splice":
          // splice添加时，第二个参数是新增的内容
          insert = args.slice(2);
      } // 给数组新增的值也要观测


      if (insert) ob.observeArray(insert);
      ob.dep.notify();
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 相当于给对象或数组加了dep
      this.dep = new Dep(); // define.prototype只能劫持已经存在的属性，新增的和删除的无法劫持，vue中会单独增加一些api，解决这个问题，比如，$set，$delete
      // 数组的更改索引和长度,无法被监控
      // 判断一个对象是否被观测过
      // 不能直接写value.__ob__ = this; 会产生死循环
      // 把Observer的实例放到data的属性上
      // 给数据加了一个标识，同时在外面能够获取到observeArray方法

      Object.defineProperty(data, "__ob__", {
        enumerable: false,
        // 不能被枚举，不能被循环出来，避免死循环
        configurable: false,
        value: this
      }); // 使用define.prototype重新定义属性

      if (Array.isArray(data)) {
        // 劫持数组push，unshift等改变原有数组的方法
        // 同时还要避免原来原型上的方法被覆盖，也就是说只有部分方法被重写
        data.__proto__ = arrayMethods; // 如果数组中存在对象，变化也要监测
        // 数组中普通类型值是不做劫持的

        this.observeArray(data);
      } else {
        this.observeObject(data);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observer(item);
        });
      } // 循环对象，属性依次劫持

    }, {
      key: "observeObject",
      value: function observeObject(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    // 如果value是对象，继续observer
    // 递归，层次越深，性能越低
    var childOb = observer(value); // 给每个属性都添加一个dep

    var dep = new Dep(); // 这是一个闭包的形式，get和set都可以获取value，value不销毁

    Object.defineProperty(data, key, {
      // 取值时依赖收集
      get: function get() {
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
      set: function set(newValue) {
        if (newValue === value) return; // 新设置的值可能也是对象,所以需要继续监测

        observer(newValue);
        value = newValue;
        dep.notify();
      }
    });
  }
  function observer(data) {
    if (!isObject(data)) {
      return;
    } // 如果被劫持过，就不需要在劫持了，所以需要判断这个对象是否被劫持过，可以添加一个实例


    if (data.__ob__) {
      return data;
    }

    return new Observer(data);
  }

  function dependArray(value) {
    for (var e, i = 0, l = value.length; i < l; i++) {
      e = value[i];

      if (e && e.__ob__) {
        e.__ob__.dep.depend();
      }

      if (isArray(e)) {
        dependArray(e);
      }
    }
  }

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };
  function initState(vm) {
    var opts = vm.$options; // 数据劫持

    if (opts.data) {
      initData(vm);
    }

    if (opts.watch) {
      initWatch(vm, opts.watch);
    }

    if (opts.computed) {
      initComputed(vm, opts.computed);
    }
  } // 设置一个数据代理,取值和设置值的时候直接操作vm._data

  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data; // 将data方到实例vm上

    vm._data = data = isFunction(data) ? data.call(vm) : data || {};

    if (!isPlainObject(data)) {
      data = {};
      console.error("[Vue warn] data functions should return an object");
    }

    observer(data); // 将vm._data用vm代理

    for (var key in data) {
      proxy(vm, "_data", key);
    }
  }

  function initWatch(vm, watch) {
    // 拿到watch后，循环watch
    for (var key in watch) {
      // 拿到watcher对应的方法 可能是string | Function | Object | Array
      var handler = watch[key];

      if (isArray(handler)) {
        // 如果是数组，循环数组
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        // 其他情况
        createWatcher(vm, key, handler);
      }
    }
  } // 第二个参数可能是key或者一个函数
  // 在使用vm.$watch()这种方式时，传给vm.$watch()的是一个函数，此时的参数是会获取这个函数的返回结果


  function createWatcher(vm, expOrFn, handler, options) {
    // handler 可能是string | Function | Object
    // options用来添加标识
    if (isPlainObject(handler)) {
      // 如果是对象，将对象中的handler取出来
      // 然后将其他选项放入options，例如deep：true，immediate：true等选项
      options = handler;
      handler = handler.handler;
    }

    if (typeof handler === "string") {
      // 去当前实例上将方法取出来,赋给handler
      handler = vm[handler];
    } // 最终调用的是vm.$watch


    return vm.$watch(expOrFn, handler, options);
  }

  var computedWatcherOptions = {
    lazy: true
  };

  function initComputed(vm, computed) {
    // 将计算属性watcher保存到vm上
    var watchers = vm._computedWatchers = Object.create(null);

    for (var key in computed) {
      var userDef = computed[key];
      var getter = isFunction(userDef) ? userDef : userDef.get; // 将属性和watcher对应起来

      watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
      defineComputed(vm, key, userDef);
    }
  }

  function defineComputed(target, key, userDef) {
    if (isFunction(userDef)) {
      sharedPropertyDefinition.get = createComputedGetter(key);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get ? createComputedGetter(key) : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }

    if (sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
        console.error("Computed property \"".concat(key, "\" was assigned to but it has no setter."));
      };
    }

    Object.defineProperty(target, key, sharedPropertyDefinition);
  } // 检测是否执行这个getter


  function createComputedGetter(key) {
    return function computedGetter() {
      // 获取到对应属性的watcher
      var watcher = this._computedWatchers && this._computedWatchers[key];

      if (watcher) {
        if (watcher.dirty) {
          // 此时watcher栈中有两个watcher
          watcher.evaluate();
        }

        if (Dep.target) {
          watcher.depend();
        } // 将值返回


        return watcher.value;
      }
    };
  }

  function stateMixin(Vue) {
    // watch的核心是new Watcher
    Vue.prototype.$watch = function (expOrFn, cb, options) {
      var vm = this; // 标识是一个用户watcher

      options = options || {};
      new Watcher(vm, expOrFn, cb, options); // 如果是immediate就立即执行操作函数

      if (options.immediate) {
        cb.call(vm);
      }
    };
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 需要将用户自定义的options和全局的options合并

      vm.$options = mergeOptions(vm.constructor.options, options); // 初始化之前调用beforeCreate

      callHook(vm, "beforeCreate"); // 初始化状态     

      initState(vm);
      callHook(vm, "created"); // 如果当前有el属性，说明要进行模板渲染

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    }; // 挂载操作


    Vue.prototype.$mount = function (el) {
      // 查找dom元素
      var vm = this;
      var opts = vm.$options;
      el = document.querySelector(el); // 没有render，将template转换成render

      if (!opts.render) {
        // 根据生命周期图示，有el，有template才会进行编译的操作，把模板编译成render函数
        var template = opts.template;

        if (!template && el) {
          // 获取整个app的div，包括外层元素
          template = el.outerHTML;
        } // 将模板编译成render


        var render = compilerToFunctions(template);
        opts.render = render;
      } // 挂载组件，将实例挂载到el上


      mountComponent(vm, el);
    };
  }

  function renderMixin(Vue) {
    // 这几种方法都是用对象描述dom的结构
    // 创建元素
    // 参数是：标签，属性，子元素
    Vue.prototype._c = function () {
      return createElementVNode.apply(void 0, arguments);
    }; // 创建文本元素


    Vue.prototype._v = function (text) {
      return creteTextVNode(text);
    }; // stringify


    Vue.prototype._s = function (val) {
      return val === null ? "" : _typeof(val) === "object" ? JSON.stringify(val) : val;
    };

    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn);
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render; // 调用render，返回的结果是vnode

      var vnode = render.call(vm);
      return vnode;
    };
  }

  function createElementVNode(tag, data) {
    if (data == null) data = {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, data.key, children);
  }

  function creteTextVNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  } // 创建虚拟dom
  // 虚拟节点可以自定义属性,ast一定是根据源代码来转换


  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function Vue(options) {
    this._init(options);
  }
  /* 原型方法 */


  initMixin(Vue); // 扩展了init方法

  stateMixin(Vue); // 混合生命周期渲染

  lifecycleMixin(Vue); // render

  renderMixin(Vue);
  /* 静态方法 */

  initGlobalAPI(Vue); // 导出

  return Vue;

}));
//# sourceMappingURL=vue.js.map
