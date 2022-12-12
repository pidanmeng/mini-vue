import { createComponentInstance, setupComponent } from './component';
import { isObject } from 'shared';

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
function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function mountElement(vnode: any, container: any) {
  console.log(container.append);
  const { type, children, props } = vnode;
  const el = document.createElement(type);
  if (typeof children === 'string') {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, container)
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

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render();
  patch(subTree, container);
}
