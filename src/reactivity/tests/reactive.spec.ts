import { isReactive, reactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(original).not.toBe(observed);
    expect(observed.foo).toBe(1);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
  });

  it('nested obj', () => {
    const original = {
      nested: { foo: 1 },
      array: [{ name: 'breezefeng' }]
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
});