import { flow } from "fp-ts/lib/function"
import * as O from "../../Part1. Introduction To Functional Programming/4. Handling Erros Without Exceptions/option"
import * as L from "../../Part1. Introduction To Functional Programming/3. Functional Data Structures/list"

export type Monoid<A> = {
  op: (a1: A, a2: A) => A
  zero: A
}

const stringMonoid: Monoid<string> = {
  op: (a1: string, a2: string) => a1 + a2,
  zero: ""
}

/**
 * @fp-ts version
 * import { getApplicativeMonoid } from "fp-ts/lib/Applicative"
 * import { Applicative } from "fp-ts/lib/Array"
 * const listMonoid = <A>(M: Monoid<A>) => getApplicativeMonoid(Applicative)(M)
 *
 * @see https://gcanti.github.io/fp-ts/guides/purescript.html#type-constraints
 * the constraint is implemented as an additional parameter
 *
 * @see 'getApplyMonoid'(deprecated) in https://github.com/gcanti/fp-ts/commit/402cc8a6e9265dce6443d957cc7a8f38cd4a233f
 */
const listMonoid = <A>(_: Monoid<A>): Monoid<A[]> => ({
  op: (a1, a2) => a1.concat(a2),
  zero: []
})

// Exercise 10-1
const intAddition: Monoid<number> = {
  op: (a1: number, a2: number) => a1 + a2,
  zero: 0
}

const intMultiplication: Monoid<number> = {
  op: (a1: number, a2: number) => a1 * a2,
  zero: 1
}

const booleanOr: Monoid<boolean> = {
  op: (a1: boolean, a2: boolean) => a1 || a2,
  zero: false
}
const booleanAnd: Monoid<boolean> = {
  op: (a1: boolean, a2: boolean) => a1 && a2,
  zero: true
}

// Exercise 10-2
/**
 * @fp-ts version
 * import { getApplicativeMonoid } from "fp-ts/lib/Applicative"
 * import { Applicative } from "fp-ts/lib/Option"
 * const optionMonoid = <A>(M: Monoid<A>) => getApplicativeMonoid(Applicative)(M)
 *
 * @fp-ts deprecated
 * @see https://dev.to/gcanti/getting-started-with-fp-ts-monoid-ja0
 * import { getApplyMonoid } from "fp-ts/lib/Option"
 * const optionMonoid = <A>(M: Monoid<A>) => getApplyMonoid(M)
 *
 * @see https://gcanti.github.io/fp-ts/guides/purescript.html#type-constraints
 * the constraint is implemented as an additional parameter
 *
 * @see 'getApplyMonoid'(deprecated) in https://github.com/gcanti/fp-ts/commit/402cc8a6e9265dce6443d957cc7a8f38cd4a233f
 */
const optionMonoid = <A>(_: Monoid<A>): Monoid<O.Option<A>> => ({
  op: (a1: O.Option<A>, a2: O.Option<A>) => O.orElse(a1, () => a2),
  zero: O.none()
})



// Exercise 10-3
const endoMonoid = <A>(_: Monoid<A>): Monoid<(a: A) => A> => ({
  op: (f: (a: A) => A, g: (a: A) => A) => flow(f, g),
  zero: (a: A) => a
})

// TODO: Exercise 10-4

// in ch 10.2
const concatenate = <A>(as: L.List<A>, m: Monoid<A>): A => L.foldLeft(as, m.zero)(m.op)

// Exercise 10-5
const foldMap = <A, B>(as: L.List<A>, m: Monoid<B>) => (f: (a: A) => B): B => L.foldLeft(as, m.zero)((b, a) => m.op(b, f(a)))

// TODO: Exercise 10-6

