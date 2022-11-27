import { isDef, isUndef } from "../shared/util";
export function patch(oldVnode, vnode) {
    if (isUndef(oldVnode)) {
        createElm(vnode);
    } else {
        const isRealElement = isDef(oldVnode.nodeType);
        if (isRealElement) {
            const el = oldVnode;
            const parent = el.parentNode;
            let newEle = createElm(vnode);
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
    let { tag, data, children, text } = vnode;
    if (typeof tag === "string") {
        // 标签
        vnode.el = document.createElement(tag);

        patchProps(vnode.el, {}, data);
        children.forEach((element) => {
            // 将子元素也处理成真实节点
            vnode.el.appendChild(createElm(element));
        });
    } else {
        // 文本
        vnode.el = document.createTextNode(text);
    }

    return vnode.el;
}
function patchProps(el, oldProps = {}, props = {}) {
    let oldStyle = oldProps.style || {};
    let newStyle = props.style || {};

    for (const key in oldStyle) {
        if (!Object.hasOwnProperty.call(newStyle, key)) {
            el.style[key] = "";
        }
    }

    for (const key in oldProps) {
        if (!Object.hasOwnProperty.call(props, key)) {
            el.removeAttribute(key);
        }
    }
    for (const key in props) {
        if (key === "style") {
            for (let styleName in props.style) {
                el.style[styleName] = props.style[styleName];
            }
        } else if (key === "class") {
            el.className = props.class;
        } else {
            el.setAttribute(key, props[key]);
        }
    }
}

function patchVnode(oldVnode, vnode) {
    if (oldVnode === vnode) {
        return;
    }
    // 如果元素不相同，直接替换
    let el = createElm(vnode);
    if (!sameVnode(oldVnode, vnode)) {
        oldVnode.el.parentNode.replaceChild(el, oldVnode.el);
        return el;
    }
    // 复用原来的节点标签
    el = vnode.el = oldVnode.el;
    // 文本没有标签
    if (!oldVnode.tag) {
        if (oldVnode.text !== vnode.text) {
            // 用新的文本替换原来的
            oldVnode.el.textContent = vnode.text;
        }
    }

    // 如果是标签，对比标签的属性
    patchProps(vnode.el, oldVnode.data, vnode.data);

    const oldCh = oldVnode.children || [];
    const ch = vnode.children || [];
    if (oldCh.length > 0 && ch.length > 0) {
        updateChildren(el, oldCh, ch);
    } else if (ch.length > 0) {
        for (const key in ch) {
            if (Object.hasOwnProperty.call(ch, key)) {
                const child = ch[key];
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
    let i, key;
    const map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (isDef(key)) map[key] = i;
    }
    return map;
}

function updateChildren(parentElm, oldCh, newCh) {
    // 原来子节点集合的起始索引
    let oldStartIdx = 0;
    // 原来子节点集合的结束索引
    let oldEndIdx = oldCh.length - 1;
    // 原来子节点集合的起始元素
    let oldStartVnode = oldCh[0];
    // 原来子节点集合的末尾元素
    let oldEndVnode = oldCh[oldEndIdx];

    // 新子节点集合的起始索引
    let newStartIdx = 0;
    // 新子节点集合的结束索引
    let newEndIdx = newCh.length - 1;
    // 新子节点集合的起始元素
    let newStartVnode = newCh[0];
    // 新子节点集合的末尾元素
    let newEndVnode = newCh[newEndIdx];
    // 如果有一方起始指针等于结束指针的索引，就结束对比
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
            parentElm.insertBefore(
                oldStartVnode.el,
                oldEndVnode.el.nextSibling
            );
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--oldEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode, newStartVnode);
            parentElm.insertBefore(oldEndVnode.el, oldStartVnode.el);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            let oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            let moveIndex = oldKeyToIdx[newStartVnode.key];
            // 说明没有复用，不需要移动
            if (isUndef(moveIndex)) {
                parentElm.insertBefore(
                    createElm(newStartVnode),
                    oldStartVnode.el
                );
            } else {
                let moveVnode = oldCh[oldKeyToIdx];
                oldCh[oldKeyToIdx] = null;
                parentElm.insertBefore(moveVnode.el, oldStartVnode.el);
                patch(moveVnode, newStartVnode);
            }
            newStartVnode = newCh[++newStartIdx];
        }
    }
    if (newStartIdx <= newEndIdx) {
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            let ele =
                newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el;
            parentElm.insertBefore(createElm(newCh[i]), ele);
        }
    }

    if (oldStartIdx <= oldEndIdx) {
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            let child = oldCh[i];
            if (isDef(child)) {
                parentElm.removeChild(child.el);
            }
        }
    }
}
