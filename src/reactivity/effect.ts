import { extend } from '../shared';

let activeEffect: any;
let shouldTrack;

class ReactiveEffect {
  private _fn;
  deps = [];
  active = true;
  onStop?: () => void;
  constructor(fn: Function, public scheduler?: any) {
    this._fn = fn;
  }
  run() {
    if (!this.active) return this._fn();

    shouldTrack = true;
    activeEffect = this;
  
    const result = this._fn();
    shouldTrack = false;
  
    return result;
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

function cleanupEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  });
  effect.deps.length = 0;
}

const targetMap = new Map();

export function track(target: any, key: any) {
  if (!isTracking()) return;

  let depsMap = targetMap.get(target);

  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);

  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  if (dep.has(activeEffect)) return;

  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trigger(target: any, key: any) {
  const depsMap = targetMap.get(target);
  const dep = depsMap.get(key);

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function stop(runner: any) {
  runner.effect.stop();
}

export function effect(fn: Function, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);

  _effect.run();

  const runner = _effect.run.bind(_effect);

  (runner as any).effect = _effect;

  return runner;
}