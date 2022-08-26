package fpinscala.exercises.datastructures

import scala.annotation.tailrec

sealed trait List[+A]

object List {
  case object Nil extends List[Nothing]
  final case class Cons[+A](head: A, tail: List[A]) extends List[A]
  def sum(ints: List[Int]): Int =
    ints match {
      case Nil              => 0
      case Cons(head, tail) => head + sum(tail)
    }

  def product(ds: List[Double]): Double =
    ds match {
      case Nil              => 1
      case Cons(head, tail) => head * product(tail)
    }

  def apply[A](as: A*): List[A] =
    if (as.isEmpty) Nil
    else Cons(as.head, apply(as.tail: _*))

  // exercises 3-2
  def tail[A](l: List[A]): List[A] =
    l match {
      case Nil           => Nil // or sys.error("empty list error")
      case Cons(_, tail) => tail
    }

  // exercises 3-3
  def setHead[A](n: A, l: List[A]): List[A] =
    l match {
      case Nil              => Nil // or sys.error("empty list error")
      case Cons(head, tail) => Cons(n, tail)
    }

  // exercises 3-4
  @tailrec
  def drop[A](l: List[A], n: Int): List[A] =
    l match {
      case Nil           => Nil
      case Cons(_, tail) => if (n <= 0) l else drop(tail, n - 1)
    }

  // exercises 3-5
  @tailrec
  def dropWhile[A](l: List[A], f: A => Boolean): List[A] =
    l match {
      case Nil              => Nil
      case Cons(head, tail) => if (f(head)) dropWhile(tail, f) else l
    }

  def append[A](a1: List[A], a2: List[A]): List[A] =
    a1 match {
      case Nil              => a2
      case Cons(head, tail) => Cons(head, append(tail, a2))
    }

  // exercises 3-6
  def init[A](l: List[A]): List[A] =
    l match {
      case Nil              => Nil // or sys.error("empty list error")
      case Cons(_, Nil)     => Nil
      case Cons(head, tail) => Cons(head, init(tail))
    }

  // Listing 3-2 (in 49p)
  def foldRight[A, B](as: List[A], z: B)(f: (A, B) => B): B =
    as match {
      case Nil              => z
      case Cons(head, tail) => f(head, foldRight(tail, z)(f))
    }

  def sum2(ns: List[Int]): Int =
    foldRight(ns, 0)((x, y) => x + y)

  def product2(ns: List[Double]): Double =
    foldRight(ns, 1.0)(_ * _)

  //
  /**
   * exercises 3-7
   *
   * Q1: foldRight 로 구현된 product2 가 0.0을 만났을 때 즉시 재귀를 멈추고 0.0 을 돌려줄까?
   * A1: 0.0 만났을 때의 처리가 없고 재귀가 멈추는 조건이 오로지 `Nil` 인 경우이기 때문에 멈추지않고 끝가지 진행함.
   *
   * Q2: foldRight 를 긴 목록으로 호출했을 때 어떤 평가 단축이 어떤 식으로 일어나는지 고찰하시오.
   * A2:
   * 1 * (2 * (3 * (4 * 5)))
   * => 1 * (2 * (3 * 20))
   * => 1 * (2 * 60)
   * => 1 * (120)
   * => 120
   */

  /**
   * exercises 3-8
   *
   * Q1: `foldRight(List(1,2,3), Nil:List[Int])(Cons(_,_))` 처럼 `Nil` 과 `Cons` 자체를
   *     `foldRight`에 전달하면 어떤 일이 발생할까?
   * A1: 결과는 `Cons(1, Cons(2, Cons(3, Nil)))`
   *
   * Q2: 이로부터, `foldRight`와 자료 생성자들 사이의 관계에 관해 어떤 점을 알 수 있는가?
   * A2: `List` 의 생성자가 동작하는 방식과 동일한 방식으로 동작한다. `foldRight` 는 자료구조의 형태를 유지한다.
   */

  // exercises 3-9
  def length[A](as: List[A]): Int =
    foldRight(as, 0)((_, acc) => acc + 1)

  // exercises 3-10
  @tailrec
  def foldLeft[A, B](as: List[A], z: B)(f: (B, A) => B): B =
    as match {
      case Nil              => z
      case Cons(head, tail) => foldLeft(tail, f(z, head))(f)
    }

  // exercises 3-11
  def sum3(ints: List[Int]): Int =
    foldLeft(ints, 0)(_ + _)

  def product3(ds: List[Double]): Double =
    foldLeft(ds, 1.0)(_ * _)

  // exercises 3-12
  def reverse[A](l: List[A]): List[A] =
    foldLeft(l, Nil: List[A])((tail, head) => Cons(head, tail))

  // TODO: exercises 3-13

  // exercises 3-14
  def append2[A](a1: List[A], a2: List[A]): List[A] =
    foldRight(a1, a2)((a, acc) => Cons(a, acc))

  // exercises 3-15
  def flat[A](ll: List[List[A]]): List[A] =
    foldRight(ll, Nil: List[A])(append)

  // exercises 3-16
  def addOne(l: List[Int]): List[Int] =
    foldRight(l, Nil: List[Int])((a, acc) => Cons(a + 1, acc))

  // exercises 3-17
  def doubleToString(l: List[Double]): List[String] =
    foldRight(l, Nil: List[String])((a, acc) => Cons(a.toString, acc))

  // exercises 3-18
  def map[A, B](as: List[A])(f: A => B): List[B] =
    foldRight(as, Nil: List[B])((a, acc) => Cons(f(a), acc))

  // exercises 3-19
  def filter[A](as: List[A])(f: A => Boolean): List[A] =
    foldRight(as, Nil: List[A])((a, acc) =>
      if (f(a)) Cons(a, acc)
      else acc
    )

  // exercises 3-20
  def flatMap[A, B](as: List[A])(f: A => List[B]): List[B] =
    flat(map(as)(f))

  // exercises 3-21
  def filter2[A](as: List[A])(f: A => Boolean): List[A] =
    flatMap(as)(a => if (f(a)) Cons(a, Nil) else Nil)

  // exercises 3-22
  def zipAdd(a1: List[Int], a2: List[Int]): List[Int] =
    (a1, a2) match {
      case (Nil, _)                     => Nil
      case (_, Nil)                     => Nil
      case (Cons(h1, t1), Cons(h2, t2)) => Cons(h1 + h2, zipAdd(t1, t2))
    }

  // exercises 3-23
  def zipWith[A, B, C](a: List[A], b: List[B])(f: (A, B) => C): List[C] =
    (a, b) match {
      case (Nil, _)                     => Nil
      case (_, Nil)                     => Nil
      case (Cons(h1, t1), Cons(h2, t2)) => Cons(f(h1, h2), zipWith(t1, t2)(f))
    }

  // TODO: exercises 3-24
}
