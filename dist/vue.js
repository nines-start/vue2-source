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

  var callbacks = [];
  var pending$1 = false;
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
  }

  function nextTick$1(cb, ctx) {
    callbacks.push(cb);

    if (!pending$1) {
      pending$1 = true;
      timerFunc();
    }
  }

  var LIFECYCLE_HOOKS = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed", "activated", "deactivated", "errorCaptured", "serverPrefetch", "renderTracked", "renderTriggered"];

  var strats = Object.create(null);
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeLifecycleHook;
  });

  var defaultStrat = function defaultStrat(parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
  }; // 生命周期的合并


  function mergeLifecycleHook(parentVal, childVal) {
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
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
  }

  function initGlobalAPI(Vue) {
    Vue.options = Object.create(null);
    initMixin$1(Vue);
    Vue.nextTick = nextTick$1;
  }

  // 匹配{{}}
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配文本标签

  function parseText(text) {
    if (!defaultTagRE.test(text)) {
      return "_v(".concat(JSON.stringify(text), ")");
    }

    var tokens = [];
    var lastIndex = defaultTagRE.lastIndex = 0; // 匹配到的结果

    var match; // 保存匹配到的索引

    var index;

    while (match = defaultTagRE.exec(text)) {
      index = match.index;

      if (index > lastIndex) {
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
  }

  function genElement(ast) {
    var props = genProps(ast);
    var children = genChildren(ast);
    var code = "_c('".concat(ast.tag, "',\n    ").concat(ast.attrs.length > 0 ? "".concat(props) : "null").concat(children ? ",".concat(children) : "", ")");
    return code;
  }

  function generate(ast) {
    var code = ast ? genElement(ast) : '_c("div")'; // 使用with的作用，去this上取值

    return {
      render: "with(this){return ".concat(code, "}")
    };
  }

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  function parseHTML(html) {
    // 树根
    var root;
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
    } // 将字符串进行截取操作， 然后替换html


    function advance(n) {
      html = html.substring(n);
    } // 匹配开始标签


    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        }; // 获取标签后删除

        advance(start[0].length);
        var end, attr; // 不是开始标签的结束，并且是属性就一直匹配

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 使用双引号，属性值是第3项，使用单引号，是第四项， 不用引号是是第五项
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
      // 双向检测

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function charts(text) {
      text = text.trim();

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
    var ast = parseHTML(template);
    var code = generate(ast);
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
        // 希望让当前的target也能记住dep
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
  var targetStack = [];
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
    var flushQueue = queue.slice(0);
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
    }

    has[id] = true;
    queue.push(watcher);

    if (!pending) {
      nextTick$1(flushSchedulerQueue);
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

      this.id = ++uid;
      this.vm = vm;
      this.cb = cb;

      if (options) {
        this.deep = !!options.deep;
        this.user = !!options.user;
      } else {
        this.deep = this.user = false;
      }

      if (isFunction(expOrFn)) {
        this.getter = expOrFn;
      } else {
        this.getter = parsePath(expOrFn);
      }

      this.deps = [];
      this.depIds = new Set();
      this.value = this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        var vm = this.vm; // 将当前的watcher放到全局变量上
        // this是当前watcher实例

        pushTarget(this); // 首先调用一次，让页面渲染

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

        if (!this.depIds.has(id)) {
          this.deps.push(dep);
          this.depIds.add(id);
          dep.addSub(this);
        }
      }
    }, {
      key: "update",
      value: function update() {
        queueWatcher(this);
      }
    }, {
      key: "run",
      value: function run() {
        var vm = this.vm; // 新值

        var value = this.get();

        if (value !== this.value || isObject(value) || this.deep) {
          // set new value
          // 原来的值
          var oldValue = this.value;
          this.value = value; // 是用户的watcher

          if (this.user) {
            this.cb.call(vm, value, oldValue);
          }
        }
      }
    }]);

    return Watcher;
  }();

  function patch(oldVNode, vnode) {
    // patch既有初始化的功能，也有更新的功能
    var isRealElement = oldVNode.nodeType;

    if (isRealElement) {
      var el = oldVNode; // 获取父元素

      var parent = el.parentNode; // 根据虚拟节点创建真实dom

      var newEle = createElm(vnode); // 将新的dom插入到原来的节点后面,然后再把原来的删除

      parent.insertBefore(newEle, el.nextSibling);
      parent.removeChild(el);
      return newEle;
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
      patchProps(vnode.el, data);
      children.forEach(function (element) {
        // 子元素
        vnode.el.appendChild(createElm(element));
      });
    } else {
      // 文本
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function patchProps(el, props) {
    for (var key in props) {
      if (key === "style") {
        for (var styleName in props.style) {
          el.style[styleName] = props.style[styleName];
        }
      } else {
        el.setAttribute(key, props[key]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    // 将vnode转换成真实dom
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var el = vm.$el; // 将patch生成的el重新赋值给$el

      vm.$el = patch(el, vnode);
    };
  }
  function mountComponent(vm, el) {
    // 挂载之前调用beforeMount
    callHook(vm, "beforeMount");
    vm.$el = el;

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };

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
  var oldArrayProtoMethods = Array.prototype; // 继承一下方法

  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayProtoMethods;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = (_oldArrayProtoMethods = oldArrayProtoMethods[method]).call.apply(_oldArrayProtoMethods, [this].concat(args)); // 对新增的数据需要再次劫持


      var insert = null;
      var ob = this.__ob__; // 数组中新添加的项有可能也是对象

      switch (method) {
        // 这两个方法都是追加，追加的内容可能是数组
        case "push":
        case "unshift":
          insert = args;
          break;

        case "splice":
          // splice添加时，第二个参数是新增的内容
          insert = args.slice(2);
      } // 给数组新增的值也要劫持


      if (insert) ob.observeArray(insert);
      ob.dep.notify();
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      this.dep = new Dep();
      Object.defineProperty(data, "__ob__", {
        enumerable: false,
        configurable: false,
        value: this
      }); // 使用define.prototype重新定义属性

      if (Array.isArray(data)) {
        data.__proto__ = arrayMethods;
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
      }
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
    var childOb = observer(value); // 给每个属性都添加一个dep

    var dep = new Dep(); // 这是一个闭包的形式，get和set都可以获取value，value不销毁

    Object.defineProperty(data, key, {
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
      set: function set(newValue) {
        if (newValue === value) return; // 新设置的值可能也是对象,所以需要继续劫持

        observer(newValue);
        value = newValue;
        dep.notify();
      }
    });
  }
  function observer(data) {
    if (!isObject(data)) {
      return;
    }

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

  function initState(vm) {
    var opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }

    if (opts.watch) {
      initWatch(vm, opts.watch);
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
    var data = vm.$options.data;
    vm._data = data = isFunction(data) ? data.call(vm) : data || {};

    if (!isPlainObject(data)) {
      data = {};
      console.error("[Vue warn] data functions should return an object");
    }

    observer(data);

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
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher(vm, expOrFn, handler, options) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }

    if (typeof handler === "string") {
      handler = vm[handler];
    } // 最终调用的是vm.$watch


    return vm.$watch(expOrFn, handler, options);
  }

  function stateMixin(Vue) {
    // watch的核心是new Watcher
    Vue.prototype.$watch = function (expOrFn, cb, options) {
      var vm = this;
      options = options || {};
      options.user = true;
      new Watcher(vm, expOrFn, cb, options); // 如果是immediate就立即执行操作函数

      if (options.immediate) {
        cb.call(vm);
      }
    };
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, "beforeCreate");
      initState(vm);
      callHook(vm, "created");

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var opts = vm.$options;
      el = document.querySelector(el); // 没有rencer，将template转换成render

      if (!opts.render) {
        var template = opts.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compilerToFunctions(template);
        opts.render = render;
      } // 挂载组件，将实例挂载到el上


      mountComponent(vm, el);
    };
  }

  function renderMixin(Vue) {
    // 创建元素
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
      return nextTick(fn, this);
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

  initMixin(Vue);
  stateMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);
  initGlobalAPI(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
