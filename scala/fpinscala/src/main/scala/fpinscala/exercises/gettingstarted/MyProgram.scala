package fpinscala.exercises.gettingstarted

import scala.annotation.tailrec

object MyProgram {
  // exercises 2-1
  def fib(n: Int): Int = {
    @tailrec
    def iter(n: Int, acc: Int): Int =
      if (n <= 0) acc
      else iter(n - 1, n * acc)

    iter(n, 1)
  }

  // exercises 2-2
  def isSorted[A](as: Array[A], ordered: (A, A) => Boolean): Boolean = {
    val end = as.length - 1
    @tailrec
    def iter(n: Int): Boolean = {
      if (n >= end) true
      else if (ordered(as(n), as(n + 1))) false
      else iter(n + 1)
    }
    iter(0)
  }

  // exercises 2-3
  def curry[A, B, C](f: (A, B) => C): A => (B => C) =
    a => b => f(a, b)

  // exercises 2-4
  def uncurry[A, B, C](f: A => B => C): (A, B) => C =
    (a, b) => f(a)(b)

  // exercises 2-5
  def compose[A, B, C](f: B => C, g: A => B): A => C =
    a => f(g(a))
}
