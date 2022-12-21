const publicPropertiesMap: Record<string, any> = {
  $el: (i: any) => i.vnode.el,
};
export const PublicInstanceProxyHandlers = {
  get({ _: instance }: any, key: string) {
    const { vnode, setupState } = instance;
    if (key in setupState) {
      return setupState[key];
    }

    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
