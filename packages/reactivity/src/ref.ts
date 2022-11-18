import { isObject } from 'shared';
import { Dep, trackEffect, triggerEffects } from './effect';
import { reactive } from './reactive';

export function ref(val: any) {
  return new RefImpl(val);
}

class RefImpl<T> {
  private _value: T;
  private dep: Dep = new Set();
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
