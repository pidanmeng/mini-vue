import { createComponentInstance, setupComponent } from './component';
import { isObject } from 'shared';
import { createVNode } from './vnode';
import { ShapeFlags } from 'shared/src/shapeFlags';

export function render(vnode: any, container: any) {
  patch(vnode, container);
}

export function patch(vnode: any, container: any) {
  const { shapeFlag } = vnode;
  // 处理组件
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}
function mountComponent(initialVNode: any, container: any) {
  const instance = createComponentInstance(initialVNode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}

function mountElement(vnode: any, container: any) {
  const { shapeFlag, type, children, props } = vnode;
  const el = (vnode.el = document.createElement(type));
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el);
  }
  for (const attr in props) {
    const val = props[attr];
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(attr)) {
      const event = attr.slice(2).toLowerCase();
      el.addEventListener(event, val);
    } else {
      el.setAttribute(attr, vnode.props[attr]);
    }
  }
  container.append(el);
}

function mountChildren(vnode: any, container: any) {
  vnode.children.forEach((child: any) => {
    patch(child, container);
  });
}

function setupRenderEffect(instance: any, initialVNode: any, container: any) {
  const { proxy } = instance;

  const subTree = instance.render.call(proxy);
  patch(subTree, container);

  initialVNode.el = subTree.el;
}
