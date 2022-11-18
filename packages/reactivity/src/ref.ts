import { isObject } from 'shared';
import { Dep, trackEffect, triggerEffects } from './effect';
import { isReactive, reactive } from './reactive';

export function ref(val: any) {
  return new RefImpl(val);
}

class RefImpl<T> {
  private _value: T;
  private dep: Dep = new Set();
  public readonly __v_isRef: boolean = true;
  constructor(value: T) {
    this._value = isObject(value) ? reactive(value) : value;
  }
  get value() {
    trackEffect(this.dep);
    return this._value;
  }
  set value(val: T) {
    if (this._value === val) {
      return;
    }
    this._value = val;
    triggerEffects(this.dep);
  }
}

export function isRef(val: any) {
  return !!(val && val.__v_isRef);
}

export function unref(val: any) {
  return isRef(val) ? val.value : val;
}

const shallowUnwrapHandlers: ProxyHandler<any> = {
  get: (target, key) => unref(Reflect.get(target, key)),
  set: (target, key, value) => {
    const oldValue = target[key];
    if (isRef(oldValue) && isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value);
    }
  },
};
export function proxyRefs<T extends object>(objectWithRefs: T) {
  return isReactive(objectWithRefs)
    ? objectWithRefs
    : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
