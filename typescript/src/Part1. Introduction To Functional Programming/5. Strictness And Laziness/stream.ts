import { absurd } from "fp-ts/lib/function";
import { none } from "fp-ts/lib/Option";
import * as L from "../3. Functional Data Structures/list";
import * as O from "../4. Handling Erros Without Exceptions/option";

class Cons<A> {
  readonly _tag = "Cons"
  constructor(readonly h: () => A, readonly t: () => Stream<A>) {}
}

class Empty {
  readonly _tag = "Empty"
}

export type Stream<A> = Cons<A> | Empty;

// @see https://matt.might.net/articles/implementing-laziness/
const cachingLazyValues = <A>(f: () => A): () => A => {
  let cache: A | null = null;

  return () => {
    if (cache !== null) {
      return cache;
    } else {
      cache = f();
      return cache;
    }
  }
};


export const cons = <A>(hd: () => A, tl: () => Stream<A>): Stream<A> => {
  const head = cachingLazyValues(hd);
  const tail = cachingLazyValues(tl);

  return new Cons(head, tail)
};

export const empty = (): Stream<never> => new Empty();

interface Match<A, B> {
  Empty: () => B,
  Cons: (h: () => A, t: () => Stream<A>) => B
}

export const match = <A>(stream: Stream<A>) => <B>(m: Match<A, B>): B => {
  switch (stream._tag) {
    case 'Empty':
      return m.Empty()
    case 'Cons':
      return m.Cons(stream.h, stream.t)
    default:
      return absurd(stream)
  }
}

export const apply = <A>(...as: A[]): Stream<A> => {
  const [head, ...tail] = as;

  if (as.length === 0) {
    return empty();
  } else {
    return cons(() => head, () => apply(...tail))
  }
}

export const headOption = <A>(st: Stream<A>): O.Option<A> => {
  return match(st)({
    'Cons': (h, t) => O.some(h()),
    'Empty': () => O.none()
  })
}

type Pair<A, B> = [A, B];
const pair = <A, B>(a: A, b: B): Pair<A, B> => [a, b]

// Exercise 5-1
export const toList = <A>(st: Stream<A>): L.List<A> => {
  const iter = (s: Stream<A>, acc: L.List<A>): L.List<A> => {
    return match(s)({
      'Cons': (h, t) => iter(t(), L.cons(h(), acc)),
      'Empty': () => acc
    })
  };
  return L.reverse(iter(st, L.nil()));
};

// Exercise 5-2
export const take = <A>(st: Stream<A>, n: number): Stream<A> => {
  return match(st)({
    'Cons': (h, t) => n > 1 ? cons(h, () => take(t(), n - 1)) : cons(h, empty),
    'Empty': () => empty()
  })
};

export const drop = <A>(st: Stream<A>, n: number): Stream<A> => {
  return match(st)({
    'Cons': (h, t) => n > 1 ? drop(t(), n - 1) : st,
    'Empty': () => empty()
  })
};

// Exercise 5-3
export const takeWhile = <A>(st: Stream<A>, p: (a: A) => boolean): Stream<A> => {
  return match(st)({
    'Cons': (h, t) => p(h()) ? cons(h, () => takeWhile(t(), p)) : empty(),
    'Empty': () => empty()
  })
}

// in 90p
export const foldRight = <A>(st: Stream<A>) => <B>(z: () => B) => (f: (a: A, b: () => B) => B): B => {
  return match(st)({
    'Cons': (h, t) => f(h(), () => foldRight(t())(z)(f)),
    'Empty': () => z()
  })
};

// no stack safe
export const exists = <A>(st: Stream<A>, p: (a: A) => boolean): boolean =>
  foldRight(st)(() => false)((a, b) => p(a) || b());

// Exercise 5-4
export const forAll = <A>(st: Stream<A>, p: (a: A) => boolean): boolean =>
  foldRight(st)(() => true)((a, b) => p(a) && b())

// Exercise 5-5
export const takeWhile2 = <A>(st: Stream<A>, p: (a: A) => boolean): Stream<A> =>
  foldRight(st)(empty as () => Stream<A>)((a, b) => p(a) ? cons(() => a, b) : empty())

// Exercise 5-6
export const headOption2 = <A>(st: Stream<A>): O.Option<A> =>
  foldRight(st)(O.none as () => O.Option<A>)((a, _) => O.some(a));

// Exercise 5-7
export const map = <A>(st: Stream<A>) => <B>(f: (a: A) => B): Stream<B> =>
  foldRight(st)(empty as () => Stream<B>)((a, b) => cons(() => f(a), b))

export const filter = <A>(st: Stream<A>) => (p: (a: A) => boolean): Stream<A> =>
  foldRight(st)(empty as () => Stream<A>)((a, b) => p(a) ? cons(() => a, b) : b())

export const append = <A>(st: Stream<A>, s: () => Stream<A>): Stream<A> =>
  foldRight(st)(s)((a, b) => cons(() => a, b))

export const flatMap = <A>(st: Stream<A>) => <B>(f: (a: A) => Stream<B>): Stream<B> =>
  foldRight(st)(empty as () => Stream<B>)((a, b) => append(f(a), b))

// in 93p
export const find = <A>(st: Stream<A>) => (p: (a: A) => boolean): O.Option<A> =>
  headOption(filter(st)(p))

// Exercise 5-8
export const constant = <A>(a: A): Stream<A> => cons(() => a, () => constant(a));

// Exercise 5-9
export const from = (n: number): Stream<number> => cons(() => n, () => from(n + 1));

// Exercise 5-10
export const fibs = (): Stream<number> => {
  const iter = (n1: number, n2: number): Stream<number> => cons(() => n1, () => iter(n2, n1 + n2));
  return iter(0, 1);
};

// Exercise 5-11
// corecursive
export const unfold = <S, A>(z: S, f: (s: S) => O.Option<[A, S]>): Stream<A> => {
  const o = f(z)

  return O.match(o)({
    'None': () => empty(),
    'Some': ([a, s]) => cons(() => a, () => unfold(s, f))
  })
};

// Exercise 5-12
export const fibs2 = (): Stream<number> =>
  unfold([0, 1], ([a, s]) => O.some([s, [s, a + s]]));

export const from2 = (n: number): Stream<number> =>
  unfold(n, (s) => O.some([s, s + 1]));

export const constant2 = <A>(a: A): Stream<A> =>
  unfold(a, (_) => O.some([a, a]));

export const ones: Stream<number> = unfold(1, (_) => O.some([1, 1]));

// Exercise 5-13
export const map2 = <A>(st: Stream<A>) => <B>(f: (a: A) => B): Stream<B> =>
  unfold(st, (a) => match(a)({
    'Cons': (h, t) => O.some([f(h()), t()]),
    'Empty': () => O.none()
  })
);

export const take2 = <A>(st: Stream<A>, n: number): Stream<A> =>
  unfold(pair(st, n), ([st, n]) => match(st)({
    'Cons': (h, t) => n > 1 ? O.some(pair(h(), pair(t(), n - 1))) : O.none(),
    'Empty': () => O.none()
  })
);

export const takeWhile3 = <A>(st: Stream<A>, p: (a: A) => boolean): Stream<A> =>
  unfold(st, (a) => match(a)({
    'Cons': (h, t) => p(h()) ? O.some([h(), t()]) : O.none(),
    'Empty': () => O.none()
  })
);

export const zipWith = <A, B>(st1: Stream<A>, st2: Stream<B>) => <C>(f: (a: A, b: B) => C): Stream<C> =>
  unfold(pair(st1, st2), ([st1, st2]) => match(st1)({
    'Cons': (h, t) => match(st2)({
      'Cons': (h2, t2) => O.some(pair(f(h(), h2()), pair(t(), t2()))),
      'Empty': () => O.none()
    }),
    'Empty': () => O.none()
  })
);

export const zipAll = <A, B>(st1: Stream<A>, st2: Stream<B>): Stream<[O.Option<A>, O.Option<B>]> =>
  unfold(pair(st1, st2), ([st1, st2]) => match(st1)({
    'Cons': (h, t) => match(st2)({
      'Cons': (h2, t2) => O.some(
        pair(
          pair(O.some(h()), O.some(h2())),
          pair(t(), t2()))),
      'Empty': () => O.some(
        pair(
          pair(O.some(h()), O.none()), 
          pair(t(), empty())))
     }),
    'Empty': () => match(st2)({
      'Cons': (h, t) => O.some(
         pair(
           pair(O.none(), O.some(h())),
           pair(empty(), t()))),
      'Empty': () => O.none()
    })
  }))

// Exercise 5-14
// NOTE: Hard...
export const startsWith = <A>(st1: Stream<A>, st2: Stream<A>): boolean =>
  forAll(zipAll(st1, st2), ([a, b]) => O.match(a)({
    'Some': (v) => O.match(b)({
      'Some': (v2) => v === v2 ? true : false,
      'None': () => false
    }),
    'None': () => false
  }))

// Exercise 5-15
export const tails = <A>(st: Stream<A>): Stream<Stream<A>> =>
  unfold(st, (a) => match(a)({
    'Cons': (_, t) => O.some(pair(a, t())),
    'Empty': () => O.none()
  }))

// in 97p
export const hasSubsequence = <A>(st1: Stream<A>, st2: Stream<A>) =>
  exists(tails(st1), (st) => startsWith(st, st2))

// Exercise 5-16
// NOTE: Hard...
// @see https://github.com/fpinscala/fpinscala/blob/first-edition/answers/src/main/scala/fpinscala/laziness/Stream.scala#L176
// Q. 이 함수를 unfold 를 이용하여 구현할 수 있을까?
// A: No. unfold 는 Stream 을 왼쪽에서 오른쪽으로 생성한다. 따라서 이 함수는 foldRight 를 이용해야한다.
// TODO:
export const scanRight = <A>(st: Stream<A>) => <B>(z: B, f: (a: A, b: () => B) => B) => {
}

// ---
export const zip = <A, B>(st1: Stream<A>, st2: Stream<B>): Stream<[A, B]> =>
  unfold(pair(st1, st2), ([st1, st2]) => match(st1)({
    'Cons': (h, t) => match(st2)({
      'Cons': (h2, t2) => O.some(
        pair(
          pair(h(), h2()),
          pair(t(), t2()))),
      'Empty': () => O.none()
    }),
    'Empty': () => O.none()
  }))
