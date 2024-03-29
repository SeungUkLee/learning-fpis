import { absurd } from "fp-ts/lib/function";

class Nil {
  readonly _tag = "Nil"
}

class Cons<A> {
  readonly _tag = "Cons"
  constructor (readonly head: A, readonly tail: List<A>) {}
}

export type List<A> = Cons<A> | Nil;

export const consC = <A>(haed: A) => (tail: List<A>): List<A> => {
  return new Cons(haed, tail);
}

export function cons<A>(head: A, tail: List<A>): List<A> {
  return new Cons(head, tail);
}

export function nil(): List<never> {
  return new Nil()
}

interface Match<A, B> {
  Nil: () => B,
  Cons: (h: A, t: List<A>) => B
}

export const match = <A>(as: List<A>) => <B>(m: Match<A, B>): B => {
  switch (as._tag) {
    case 'Nil':
      return m.Nil()
    case 'Cons':
      return m.Cons(as.head, as.tail)
    default:
      return absurd(as)
  }
}

export function sum(ints: List<number>): number {
  return match(ints)({
    'Cons': (h, t) => h + sum(t),
    'Nil': () => 0
  })
}

export function product(ds: List<number>): number {
  return match(ds)({
    'Cons': (h, t) => h === 0.0 ? 0.0 : h * product(t),
    'Nil': () => 0
  }) 
}

// Exercise 3-2
export function tail<A>(as: List<A>): List<A> {
  return match(as)({
    'Cons': (_, t) => t,
    'Nil': () => nil()
  })
}

// Exercise 3-3
export function setHead<A>(val: A, as: List<A>): List<A> {
  return match(as)({
    'Cons': (h, t) => cons(val, t),
    'Nil': () => cons(val, nil())
  })
}

// Exercise 3-4
export function drop<A>(l: List<A>, n: number): List<A> {
  return match(l)({
    'Cons': (h, t) => n <= 0 ? l : drop(t, n - 1),
    'Nil': () => nil()
  })
}

// Exercise 3-5
export function dropWhile<A>(l: List<A>, f: (a: A) => boolean): List<A> {
  return match(l)({
    'Cons': (h, t) => f(h) ? dropWhile(t, f) : l,
    'Nil': () => l
  })
}

// 46p
export function append<A>(a1: List<A>, a2: List<A>): List<A> {
  return match(a1)({
    'Cons': (h, t) => cons(h, append(t, a2)),
    'Nil': () => a2
  })
}


// Exercise 3-6
export function init<A>(l: List<A>): List<A> {
  return match(l)({
    'Cons': (h, t) => t._tag === 'Nil' ? nil() : cons(h, init(t)),
    'Nil': () => nil()
  })
}

// Listing 3.2 in 49p 
// 하나의 값으로 collapsing(축약)되려면 반드시 리스트 끝까지 traversal(순회)해야됨
export const foldRight = <A, B>(
  as: List<A>,
  z: B
) => (f: (a: A, b: B) => B): B => {
  return match(as)({
    'Cons': (h, t) => f(h, foldRight(t, z)(f)),
    'Nil': () => z
  })
}

export const sum2 = (ns: List<number>): number =>
  foldRight(ns, 0)((x, y) => x + y)

export const product2 = (ns: List<number>): number =>
  foldRight(ns, 1.0)((x, y) => x * y)

// Exercise 3-7
// 1. 재귀를 멈추지 않는다:
//  0.0 을 만났을 때의 처리가 없고 재귀가 멈추는 조건이 오로지 Nil 인 경우이기 때문에 재귀는 멈추지 않고 끝가지 진행함.
// 2. 평가 단축은
//  1 * (2 * (3 * (4 * 5)))
//  => 1 * (2 * (3 * 20))
//  => 1 * (2 * 60)
//  => 1 * (120)
//  => 120

// Exercise 3-8
// 결과는 Cons(1, Cons(2, Cons(3, Nil)))
// List 의 생성자가 동작하는 방식과 동일한 방식으로 동작.
// foldRight 는 자료구조의 형태를 유지함 

// Exercise 3-9
export const length = <A>(as: List<A>): number =>
  foldRight(as, 0)((_, acc) => acc + 1)


// Exercise 3-10
// TODO: using Trampoline
export const foldLeft = <A, B>(
  as: List<A>,
  z: B
) => (f: (b: B, a: A) => B): B => {
  return match(as)({
    'Cons': (h, t) => foldLeft(t, f(z, h))(f),
    'Nil': () => z,
  })
}

// Exercise 3-11
export const sum3 = (ns: List<number>): number =>
  foldLeft(ns, 0)((x, y) => x + y)

export const product3 = (ns: List<number>): number =>
  foldLeft(ns, 1.0)((x, y) => x * y)

// Exercise 3-12
export const reverse = <A>(l: List<A>): List<A> =>
  foldLeft(l, nil() as List<A>)((tail, head) => cons(head, tail))

// TODO: Exercise 3-13

// Exercise 3-14
export const append2 = <A>(l: List<A>, base: List<A>): List<A> =>
  foldRight(l, base)((a, acc) => cons(a, acc))

// Exercise 3-15
export const flatten = <A>(ll: List<List<A>>): List<A> => 
  foldRight(ll, nil() as List<A>)(append)

// Exercise 3-16
export const addOne = (l: List<number>): List<number> =>
  foldRight(l, nil() as List<number>)((n, acc) => cons(n + 1, acc))

// Exercise 3-17
export const numberToString = (l: List<number>): List<string> =>
  foldRight(l, nil() as List<string>)((n, acc) => cons(`${n}`, acc) )

// Exercise 3-18
export const map = <A>(al: List<A>) => <B>(f: (a: A) => B): List<B> =>
  foldRight(al, nil() as List<B>)((a, acc) => cons(f(a), acc))

// Exercise 3-19
export const filter = <A>(al: List<A>) => (f: (a: A) => boolean): List<A> =>
  foldRight(al, nil() as List<A>)((a, acc) => f(a) ? cons(a, acc) : acc)

// Exercise 3-20
export const flatMap = <A>(al: List<A>) => <B>(f: (a: A) => List<B>): List<B> => {
  return flatten(map(al)(f) as List<List<B>>)
}

// Exercise 3-21
export const filter2 = <A>(al: List<A>) => (f: (a: A) => boolean): List<A> =>
  (flatMap(al)((a) => f(a) ? cons(a, nil()) : nil())) as List<A>

// Exercise 3-22
export const zipAdd = (nl: List<number>, ml: List<number>): List<number> => {
  return match(ml)({
    'Cons': (h, t) => match(nl)({
      'Cons': (h2, t2) => cons(h2 + h, zipAdd(nl, ml)),
      'Nil': () => nil()
    }),
    'Nil': () => nil()
  })
  // return nl._tag === 'Cons' && ml._tag === 'Cons' ? cons(nl.head + ml.head, zipAdd(nl, ml)) : nil();
}

// Exercise 3-23
export const zipWith = <A, B, C>(f: (a: A, b: B) => C, al: List<A>, bl: List<B>): List<C> => {
  return match(al)({
    'Cons': (h ,t) => match(bl)({
      'Cons': (h2, t2) => cons(f(h, h2), zipWith(f, al, bl)),
      'Nil': () => nil()
    }),
    'Nil': () => nil()
  }) 
  // al._tag === 'Cons' && bl._tag === 'Cons'
  //   ? cons(f(al.head, bl.head), zipWith(f, al, bl))
  //   : nil()
}

// TODO: Exercise 3-24
// export const hasSubsequence = <A>(sup: List<A>, sub: List<A>): boolean

// ---
export const fill = (n: number) => <A>(val: A): List<A> => {
  const iter =  (n: number, val: A, acc: List<A>): List<A> => {
    return n > 0 ? iter(n - 1, val, cons(val, acc)) : acc;
  }
  return iter(n, val, nil());
}
