import { Dep, ReactiveEffect, trackEffect, triggerEffects } from './effect';

class ComputedRefImpl {
  private effect: ReactiveEffect;
  private _value: any;
  private _dirty: boolean = true;
  private dep: Dep = new Set();
  constructor(getter: any) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerEffects(this.dep);
        
      }
    });
  }

  get value() {
    trackEffect(this.dep);
    if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run()!;
    }
    return this._value;
  }
}
export function computed(getter: any) {
  return new ComputedRefImpl(getter);
}
