import { createComponentInstance, setupComponent } from './component';
import { isObject } from 'shared';
import { createVNode } from './vnode';

export function render(vnode: any, container: any) {
  patch(vnode, container);
}

export function patch(vnode: any, container: any) {
  // 处理组件
  if (typeof vnode.type === 'string') {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
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
  const { type, children, props } = vnode;
  const el = (vnode.el = document.createElement(type));
  if (typeof children === 'string') {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, container);
  }
  for (const attr in props) {
    el.setAttribute(attr, vnode.props[attr]);
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
