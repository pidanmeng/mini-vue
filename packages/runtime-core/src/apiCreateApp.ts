import { render } from './renderer';
import { createVNode } from './vnode';

export function createApp(rootComponent: any, rootProps?: any) {
  const app = {
    _container: null,
    mount(rootContainer: any) {
      const vnode = createVNode(rootComponent, rootProps);
      render(vnode, rootContainer);
      app._container = rootContainer;
    },
  };

  return app;
}
