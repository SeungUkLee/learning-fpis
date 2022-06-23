import { absurd } from 'fp-ts/lib/function';
import { List, foldRight, nil, cons } from '../3. Functional Data Structures/list';

class Some<A> {
  readonly _tag = "Some"
  constructor(readonly get: A) {}
}

class None {
  readonly _tag = "None"
}

export type Option<A> = Some<A> | None;

export const some = <A>(get: A): Option<A> => new Some(get);
export const none = (): Option<never> => new None(); 

interface Match<A, B> {
  None: () => B,
  Some: (v: A) => B
}

export const match = <A>(option: Option<A>) => <B>(m: Match<A, B>): B => {
  switch (option._tag) {
    case 'None':
      return m.None()
    case 'Some':
      return m.Some(option.get)
    default:
      return absurd(option)
  }
}

// Exercise 4-1
export const map = <A, B>(f: (a: A) => B, o: Option<A>): Option<B> => {
  return match(o)({
    'None': () => none(),
    'Some': (v) => some(f(v)),
  })
  
};

export const flatMap = <A, B>(f: (a: A) => Option<B>, o: Option<A>): Option<B> => 
  getOrElse(map(f, o), () => none());

export const getOrElse = <A>(o: Option<A>, d: () => A): A => {
  return match(o)({
    'None': () => d(),
    'Some': (v) => v
  })
};

export const orElse = <A>(o: Option<A>, ob: () => Option<A>): Option<A> => 
  getOrElse(map(some, o), ob);

export const filter = <A>(f: (a: A) => boolean) => (o: Option<A>): Option<A> => 
  flatMap(x => (f(x) ? some(x) : none()), o)

// Exercise 4-2
const mean = (ns: number[]): Option<number> => {
  const nsLen = ns.length;
  const nsSum = ns.reduce((acc, a) => acc + a, 0)

  return nsLen ? none() : some(nsSum / nsLen)
}

export const variance = (xs: number[]): Option<number> =>
  flatMap((m) => mean(xs.map(x => Math.pow(x - m, 2))), mean(xs))

// Exercise 4-3
export const map2 = <A, B, C>(f: (a: A, b: B) => C, a: Option<A>, b: Option<B>): Option<C> =>
  flatMap((x) => map((y) => f(x, y), b), a)
//  a._tag === 'None' || b._tag === 'None' ? makeNone() : makeSome(f(a.get, b.get))


// ** Exercise 4-4
export const sequence = <A>(a: List<Option<A>>): Option<List<A>> =>
  foldRight(a, some(nil()) as Option<List<A>>)((e, acc) => map2(cons, e, acc));

// Exercise 4-5
export const traverse = <A>(a: List<A>) => <B>(f: (a: A) => Option<B>): Option<List<B>> =>
  foldRight(a, some(nil()) as Option<List<B>>)((e, acc) => map2(cons, f(e), acc))

const id = <A>(x: A): A => x;
export const sequence2 = <A>(a: List<Option<A>>): Option<List<A>> => traverse(a)(id);

