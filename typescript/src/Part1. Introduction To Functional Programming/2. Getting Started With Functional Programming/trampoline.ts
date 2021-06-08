class Return<T> {
  readonly _tag = 'Return';
  constructor(readonly val: T) {}
}

class Delay<T> {
  readonly _tag = 'Delay';
  constructor(readonly fn: () => Recursion<T>) {}
}

export type Recursion<T> = Delay<T> | Return<T>

export function makeReturn<T>(val: T) {
  return new Return(val);
}
export function makeDelay<T>(fn: () => Recursion<T>) {
  return new Delay(fn);
}

export function runRec<T>(rec: Recursion<T>) {
  let c = rec;
  while (c._tag === 'Delay') {
    c = c.fn()
  }
  return c.val;
}
