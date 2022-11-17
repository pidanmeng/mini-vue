import { track, trigger } from './effect';
import { reactive, ReactiveFlags, readonly, Target } from './reactive';
import { isObject } from 'shared';

function createGetter(isReadonly = false) {
  return function get(target: Target, key: string, receiver: Object) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      track(target, key);
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res): reactive(res);
    }
    return res;
  };
}
const get = createGetter();
const readonlyGet = createGetter(true);

function createSetter() {
  return function set(
    target: Target,
    key: string,
    value: unknown,
    receiver: Object
  ) {
    const res = Reflect.set(target, key, value, receiver);
    trigger(target);
    return res;
  };
}
const set = createSetter();

// has时没有触发getter
function has(target: Target, key: string) {
  const res = Reflect.has(target, key);
  track(target, key);
  return res;
}
// delete property时没有触发setter
function deleteProperty(target: Target, key: string) {
  const res = Reflect.deleteProperty(target, key);
  trigger(target);
  return res;
}

export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
  deleteProperty,
  has,
};

export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  set: (target, key): boolean => {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  },
  deleteProperty: (target, key): boolean => {
    console.warn(
      `Delete operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  },
};
