import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _getter;
  private _dirty = true;
  private _value;
  private _effect;
  constructor(getter) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }

  get value() {
    if (this._dirty) {
      this._value = this._effect.run();
      this._dirty = false;
    }
    return this._value;
  }
}

export function computed(getter: Function) {
  return new ComputedRefImpl(getter);
}