import { Target } from './reactive';

let activeEffect: ReactiveEffect | undefined;
export let shouldTrack: boolean = true;

class ReactiveEffect<T = any> {
  deps: Dep[] = [];
  constructor(public fn: () => T) {
    return;
  }
  run() {
    try {
      activeEffect = this;
      shouldTrack = true;
    } catch (e) {
      console.warn(e);
    }
    return this.fn();
  }
}

export interface ReactiveEffectOptions {
  lazy?: boolean;
}

export interface ReactiveEffectRunner<T = any> {
  (): T;
  effect: ReactiveEffect;
}
/**
 * 创建ReactiveEffect对象，并返回其runner
 */
export function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions) {
  const _effect = new ReactiveEffect(fn);
  if (!options || !options.lazy) {
    _effect.run();
  }
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner;
  runner.effect = _effect;
  return runner;
}

type Dep = Set<any>;
type KeyToDepMap = Map<any, Dep>;
const targetMap = new WeakMap<any, KeyToDepMap>();
/**
 * 将activeEffect作为依赖收集到全局变量`targetMap`中
 */
export function track(target: object, key: unknown) {
  if (shouldTrack && activeEffect) {
    // 获取depsMap - 一个响应式对象对应最多一个depsMap
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    // 获取dep - 响应式对象的每个key 对应最多一个 effect 数组(dep)
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set([])));
    }
    trackEffect(dep);
  }
}

/**
 * 将activeEffect作为依赖收集到特定的dep中
 */
export function trackEffect(dep: Dep) {
  dep.add(activeEffect);
  activeEffect!.deps.push(dep);
}

/**
 * 触发target对应的依赖
 */
export function trigger(target: Target) {
  const depsMap = targetMap.get(target);
  let deps: (Dep | undefined)[] = [];
  if (depsMap) {
    deps = [...depsMap.values()];
  }
  const effects: ReactiveEffect[] = [];
  for (const dep of deps) {
    if (dep) {
      effects.push(...dep);
    }
  }
  triggerEffects(effects);
}

/**
 * 触发Effect对应的所有依赖
 */
export function triggerEffects(effects: ReactiveEffect[]) {
  for (const effect of effects) {
    effect.run?.();
  }
}
