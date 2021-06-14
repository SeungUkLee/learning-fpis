class Nil {
  readonly _tag = "Nil"
}

class Cons<A> {
  readonly _tag = "Cons"
  constructor (readonly head: A, readonly tail: List<A>) {}
}

export type List<A> = Cons<A> | Nil;

export function cons<A>(head: A, tail: List<A>): List<A> {
  return new Cons(head, tail);
}

export function nil(): List<never> {
  return new Nil()
}

// TODO: default absurd
export function sum(ints: List<number>): number {
  switch(ints._tag) {
    case 'Nil': return 0
    case 'Cons': return ints.head + sum(ints.tail)
  }
}

export function product(ds: List<number>): number {
  switch(ds._tag) {
    case 'Nil': return 0
    case 'Cons': {
      return ds.head === 0.0 ? 0.0 : ds.head * product(ds.tail);
    }
  }
}

// Exercise 3-2
export function tail<A>(as: List<A>): List<A> {
  switch(as._tag) {
    case 'Nil': return nil();
    case 'Cons': return as.tail;
  }
}

// Exercise 3-3
export function setHead<A>(val: A, as: List<A>): List<A> {
  switch(as._tag) {
    case 'Nil': return cons(val, nil())
    case 'Cons': return cons(val, as.tail)
  }
}

// Exercise 3-4
export function drop<A>(l: List<A>, n: number): List<A> {
  switch(l._tag) {
    case 'Nil': return nil()
    case 'Cons': return n <= 0 ? l : drop(l.tail, n - 1)
  }
}

// Exercise 3-5
export function dropWhile<A>(l: List<A>, f: (a: A) => boolean): List<A> {
  switch(l._tag) {
    case 'Nil': return l
    case 'Cons': return f(l.head) ? dropWhile(l.tail, f) : l 
  }
}

// 46p
export function append<A>(a1: List<A>, a2: List<A>): List<A> {
  switch(a1._tag) {
    case 'Nil': return a2
    case 'Cons': return cons(a1.head, append(a1.tail, a2))
  }
}


// Exercise 3-6
export function init<A>(l: List<A>): List<A> {
  switch(l._tag) {
    case 'Nil': return nil()
    case 'Cons': return l.tail._tag === 'Nil' ? nil() : cons(l.head, init(l.tail))
  }
}

// Listing 3.2 in 49p 
// 하나의 값으로 collapsing(축약)되려면 반드시 리스트 끝까지 traversal(순회)해야됨
export const foldRight = <A, B>(
  as: List<A>,
  z: B
) => (f: (a: A, b: B) => B): B => {
  switch(as._tag) {
    case 'Nil': return z
    case 'Cons': return f(as.head, foldRight(as.tail, z)(f))
  }
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
  switch(as._tag) {
    case 'Nil': return z
    case 'Cons': return foldLeft(as.tail, f(z, as.head))(f)
  }
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
export const map = <A, B>(al: List<A>) => (f: (a: A) => B): List<B> =>
  foldRight(al, nil() as List<B>)((a, acc) => cons(f(a), acc))

// export const map2 = <A, B>(f: (a: A) => B) => (al: List<A>): List<B> =>
//   foldRight(al, makeNil() as List<B>)((a, acc) => makeCons(f(a), acc))

// Exercise 3-19
export const filter = <A>(al: List<A>) => (f: (a: A) => boolean): List<A> =>
  foldRight(al, nil() as List<A>)((a, acc) => f(a) ? cons(a, acc) : acc)

// TODO: Exercise 3-20
export const flatMap = <A, B>(al: List<A>) => (f: (a: A) => List<B>): List<B> => {
//  const res = flatten(map(al)(f));
//  const res2 = flatten(map2(al)(f));
//  const res3 = flatten(map3(al)(f));
  return flatten(map(al)(f) as List<List<B>>)
}

// const map2 = <A>(al: List<A>) => <B>(f: (a: A) => B): List<B> =>
//   foldRight(al, makeNil() as List<B>)((a, acc) => makeCons(f(a), acc))
// 
// function map3<A>(al: List<A>) {
//   return <B>(f: (a: A) => B): List<B> =>
//     foldRight(al, makeNil() as List<B>)((a, acc) => makeCons(f(a), acc))
// }

// Exercise 3-21
export const filter2 = <A>(al: List<A>) => (f: (a: A) => boolean): List<A> =>
  (flatMap(al)((a) => f(a) ? cons(a, nil()) : nil())) as List<A>

// Exercise 3-22
export const zipAdd = (nl: List<number>, ml: List<number>): List<number> => {
//   switch(nl._tag && ml._tag) {
//     case 'Nil': return makeNil()
//     case 'Cons': return makeCons(nl.head + ml.head, zipAdd(nl, ml))
//   }
  return nl._tag === 'Cons' && ml._tag === 'Cons' ? cons(nl.head + ml.head, zipAdd(nl, ml)) : nil();
}

// Exercise 3-23
export const zipWith = <A, B, C>(f: (a: A, b: B) => C, al: List<A>, bl: List<B>): List<C> =>
  al._tag === 'Cons' && bl._tag === 'Cons'
    ? cons(f(al.head, bl.head), zipWith(f, al, bl))
    : nil()

// TODO: Exercise 3-24
// export const hasSubsequence = <A>(sup: List<A>, sub: List<A>): boolean


