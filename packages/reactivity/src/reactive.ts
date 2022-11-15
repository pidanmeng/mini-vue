import { mutableHandlers } from './baseHandlers';

export interface Target {}

function createReactiveObject(target: Target, baseHandler: ProxyHandler<any>) {
  const proxy = new Proxy(target, baseHandler);
  return proxy;
}

export function reactive(target: Target) {
  return createReactiveObject(target, mutableHandlers);
}
