import { mutableHandlers } from './baseHandlers';

export interface Target {}

function createReactiveObject(target: Target, baseHandler: ProxyHandler<any>) {
  const proxy = new Proxy(target, baseHandler);
  return proxy;
}

export function reactive<T extends object>(target: T):T {
  return createReactiveObject(target, mutableHandlers);
}
