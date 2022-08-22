package fpinscala.exercises.datastructures

sealed trait Tree[+A]
case class Leaf[A](value: A) extends Tree[A]
case class Branch[A](left: Tree[A], right: Tree[A]) extends Tree[A]

object Tree {
  // exercises 3-25
  def size[A](t: Tree[A]): Int =
    t match {
      case Leaf(_)             => 1
      case Branch(left, right) => size(left) + size(right)
    }

  // exercises 3-26
  def maximum(t: Tree[Int]): Int =
    t match {
      case Leaf(value)         => value
      case Branch(left, right) => maximum(left) max maximum(right)
    }

  // exercises 3-27
  def depth[A](t: Tree[A]): Int =
    t match {
      case Leaf(_)             => 0
      case Branch(left, right) => 1 + (depth(left) max depth(right))
    }

  // exercises 3-28
  def map[A, B](t: Tree[A])(f: A => B): Tree[B] =
    t match {
      case Leaf(value)         => Leaf(f(value))
      case Branch(left, right) => Branch(map(left)(f), map(right)(f))
    }

  // TODO: exercises 3-29
  // @see https://github.com/fpinscala/fpinscala/blob/da183734af0ebbc1c0ae8fa4bd9e8ec5acbd1216/answers/src/main/scala/fpinscala/datastructures/Tree.scala#L40
  def fold[A, B](t: Tree[A])(f: A => B)(g: (B, B) => B): B =
    t match {
      case Leaf(value)         => f(value)
      case Branch(left, right) => g(fold(left)(f)(g), fold(right)(f)(g))
    }

  def size2[A](t: Tree[A]): Int =
    fold(t)(_ => 1)(_ + _)

  def maximum2(t: Tree[Int]): Int = {
    def id[A](a: A): A = a

    fold(t)(id)(_ max _)
  }

  def depth2[A](t: Tree[A]): Int =
    fold(t)(_ => 0)((d1, d2) => 1 + (d1 max d2))

  def map2[A, B](t: Tree[A])(f: A => B): Tree[B] =
    fold(t)(a => Leaf(f(a)): Tree[B])(Branch(_, _))
}
