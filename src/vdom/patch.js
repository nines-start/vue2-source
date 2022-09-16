export function patch(oldVNode, vnode) {
    // patch既有初始化的功能，也有更新的功能
    const isRealElement = oldVNode.nodeType;
    if (isRealElement) {
        const el = oldVNode;
        // 获取父元素
        const parent = el.parentNode;

        // 根据虚拟节点创建真实dom
        let newEle = createElm(vnode);
     
        // 将新的dom插入到原来的节点后面,然后再把原来的删除
        parent.insertBefore(newEle, el.nextSibling);
        parent.removeChild(el);

        return newEle;
    } else {
        // 执行diff算法更新
    }
}

function createElm(vnode) {
    let { tag, data, children, text } = vnode;
    if (typeof tag === "string") {
        // 标签
        vnode.el = document.createElement(tag);

        patchProps(vnode.el, data);

        children.forEach((element) => {
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
    for (const key in props) {
        if (key === "style") {
             for (let styleName in props.style) {
                el.style[styleName] = props.style[styleName];
            }
        } else {
            el.setAttribute(key, props[key]);
        }
    }
}
