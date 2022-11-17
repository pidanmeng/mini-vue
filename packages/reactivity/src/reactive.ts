import { mutableHandlers, readonlyHandlers } from './baseHandlers';

export interface Target {
  [ReactiveFlags.IS_READONLY]?: boolean;
  [ReactiveFlags.IS_REACTIVE]?: boolean;
}

export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw'
}
function createReactiveObject(target: Target, baseHandler: ProxyHandler<any>) {
  const proxy = new Proxy(target, baseHandler);
  return proxy;
}

export function reactive<T extends object>(target: T):T {
  return createReactiveObject(target, mutableHandlers);
}

export function readonly<T extends object>(target: T):T {
  return createReactiveObject(target, readonlyHandlers);
}

export function isReadonly(target: unknown):boolean {
  return !!(target as Target)[ReactiveFlags.IS_READONLY];
}

export function isReactive(target: unknown): boolean {
  return !!(target as Target)[ReactiveFlags.IS_REACTIVE];
}

export function isProxy(target: unknown): boolean {
  return isReadonly(target) || isReactive(target);
}