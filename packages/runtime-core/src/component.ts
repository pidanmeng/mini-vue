import { readonly } from '../../reactivity';
import { initProps } from './componentProps';
import { PublicInstanceProxyHandlers } from './componentPublicInstance';

export interface componentInstance {
  vnode: any;
  type: any;
  props: any;
  setupState: any;
  render?: any;
}
export function createComponentInstance(vnode: any) {
  const componentInstance = {
    vnode,
    type: vnode.type,
    props: {},
    setupState: {},
  };
  return componentInstance;
}

export function setupComponent(instance: any) {
  // TODO
  // const { props, children } = instance.vnode;
  initProps(instance, instance.vnode.props);
  // initSlots(instance, children);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  const { setup } = Component;

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  if (setup) {
    const setupResult = setup(readonly(instance.props));
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance: any, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
