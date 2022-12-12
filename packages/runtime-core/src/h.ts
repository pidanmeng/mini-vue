import { createVNode } from './vnode';

export function h(type: any, props?: Record<string, any>, children?: any) {
  return createVNode(type, props, children);
}
