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

// Exercise 3-25
export const size = <A>(tree: Tree<A>): number => {
  switch(tree._tag) {
    case 'Leaf': return 1;
    case 'Branch': return 1 + size(tree.left) + size(tree.right);
  }
}

// Exercise 3-26
export const maximum = (tree: Tree<number>): number => {
  switch(tree._tag) {
    case 'Leaf': return tree.value
    case 'Branch': return Math.max(maximum(tree.right), maximum(tree.left))
  }
}

// Exercise 3-27
export const depth = <A>(tree: Tree<A>): number => {
  switch(tree._tag) {
    case 'Leaf': return 1
    case 'Branch': return 1 + depth(tree.right) + depth(tree.left)
  }
}

// Exercise 3-28
export const map = <A, B>(f: (a: A) => B) => (tree: Tree<A>): Tree<B> => {
  switch(tree._tag) {
    case 'Leaf': return leaf(f(tree.value))
    case 'Branch': return branch(map(f)(tree.left), map(f)(tree.right))
  }
}

// TODO: Exercise 3-29

