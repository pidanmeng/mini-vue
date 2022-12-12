export function createComponentInstance(vnode: any) {
  const componentInstance = {
    vnode,
    type: vnode.type,
  };
  return componentInstance;
}

export function setupComponent(instance: any) {
  // TODO
  // const { props, children } = instance.vnode;
  // initProps(instance, props);
  // initSlots(instance, children);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  const { setup } = Component;
  if (setup) {
    const setupResult = setup();
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
