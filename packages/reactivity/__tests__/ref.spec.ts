import { effect, isRef, proxyRefs, ref, unref } from '../src';

describe('reactivity/ref', () => {
  it('should hold a value', () => {
    const a = ref(1);
    expect(a.value).toBe(1);
    a.value = 2;
    expect(a.value).toBe(2);
  });

  it('should be reactive', () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
  });

  it('should make nested properties reactive', () => {
    const a = ref({
      count: 1,
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  });

  it('unref', () => {
    const dummy = ref(1);
    expect(isRef(1)).toBe(false);
    expect(isRef(dummy)).toBe(true);
    expect(unref(1)).toBe(1);
    expect(unref(ref(1))).toBe(1);
  });

  it('proxyRefs', () => {
    const dummy = {
      foo: ref(1),
      bar: 'foobar',
    };
    const proxyDummy = proxyRefs(dummy);
    expect(dummy.foo.value).toBe(1);
    expect(proxyDummy.foo).toBe(1);
    expect(proxyDummy.bar).toBe('foobar');

    proxyDummy.foo++;
    expect(proxyDummy.foo).toBe(2);
    expect(dummy.foo.value).toBe(2);

    proxyDummy.foo = ref(3)
    expect(proxyDummy.foo).toBe(3);
    expect(dummy.foo.value).toBe(3);
  });
});
