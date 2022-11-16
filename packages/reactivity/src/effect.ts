import { extend } from 'shared';
import { Target } from './reactive';

let activeEffect: ReactiveEffect | undefined;
export let shouldTrack: boolean = true;

class ReactiveEffect<T = any> {
  active = true;
  deps: Dep[] = [];

  onStop?: () => void;
  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null
  ) {
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
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}

export function stop(runner: ReactiveEffectRunner) {
  return runner.effect.stop();
}

type EffectScheduler = (...args: any[]) => any;

export interface ReactiveEffectOptions {
  lazy?: boolean;
  scheduler?: EffectScheduler;
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
  if (options) {
    extend(_effect, options);
  }
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
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
