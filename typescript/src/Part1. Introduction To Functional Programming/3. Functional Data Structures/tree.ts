import { absurd } from "fp-ts/lib/function"

// 57p
class Leaf<A> {
  readonly _tag = "Leaf"
  constructor(readonly value: A) { }
}

class Branch<A> {
  readonly _tag = "Branch"
  constructor(readonly left: Tree<A>, readonly right: Tree<A>) { }
}

export type Tree<A> = Leaf<A> | Branch<A>

export const leaf = <A>(value: A): Tree<A> => new Leaf(value)
export const branch = <A>(left: Tree<A>, right: Tree<A>): Tree<A> =>
  new Branch(left, right)

interface Match<A, B> {
  Leaf: (v: A) => B,
  Branch: (l: Tree<A>, r: Tree<A>) => B
}

export const match = <A>(tree: Tree<A>) => <B>(m: Match<A, B>): B => {
  switch (tree._tag) {
    case 'Leaf':
      return m.Leaf(tree.value)
    case 'Branch':
      return m.Branch(tree.left, tree.right)
    default:
      return absurd(tree)
  }
}

// Exercise 3-25
export const size = <A>(tree: Tree<A>): number => {
  return match(tree)({
    'Branch': (l, r) => 1 + size(l) + size(r),
    'Leaf': () => 1
  })
}

// Exercise 3-26
export const maximum = (tree: Tree<number>): number => {
  return match(tree)({
    'Branch': (l, r) => Math.max(maximum(r), maximum(l)),
    'Leaf': (v) => v
  })
}

// Exercise 3-27
export const depth = <A>(tree: Tree<A>): number => {
  return match(tree)({
    'Branch': (l, r) => 1 + depth(r) + depth(l),
    'Leaf': () => 1
  })
}

// Exercise 3-28
export const map = <A, B>(f: (a: A) => B) => (tree: Tree<A>): Tree<B> => {
  return match(tree)({
    'Branch': (l, r) => branch(map(f)(l), map(f)(r)),
    'Leaf': (v) => leaf(f(v))
  })
}

// TODO: Exercise 3-29
