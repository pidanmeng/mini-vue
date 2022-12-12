export function createVNode(
  type: any,
  props?: Record<string, any>,
  children?: any
) {
  const vnode = {
    type,
    props,
    children,
  };

  return vnode;
}
