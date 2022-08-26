package fpinscala.exercises.errorhandling

import scala.{Option => _, Some => _, None => _, _}
import Option._

sealed trait Option[+A] { self =>
  // Listing4-2, exercises 4-1
  def map[B](f: A => B): Option[B] =
    self match {
      case None      => none
      case Some(get) => some(f(get))
    }

  def flatMap[B](f: A => Option[B]): Option[B] =
    map(f).getOrElse(none)

  def getOrElse[B >: A](default: => B): B =
    self match {
      case None      => default
      case Some(get) => get
    }

  def orElse[B >: A](ob: Option[B]): Option[B] =
    map(some).getOrElse(ob)

  def filter(f: A => Boolean): Option[A] =
    flatMap(a => if (f(a)) some(a) else none)
}


object Option {
  case object None extends Option[Nothing]
  final case class Some[+A](get: A) extends Option[A]

  def some[A](get: A): Option[A] = Some(get)
  def none[A]: Option[A] = None

  // exercises 4-2
  def variance(xs: Seq[Double]): Option[Double] =
    mean(xs).flatMap { m =>
      mean(xs.map { x =>
        math.pow(x - m, 2)
      })
    }

  def mean(xs: Seq[Double]): Option[Double] =
    if (xs.isEmpty) none
    else Some(xs.sum / xs.length)

  // exercises 4-3
  def map2[A, B, C](a: Option[A], b: Option[B])(f: (A, B) => C): Option[C] =
    a.flatMap { x =>
      b.map { y =>
        (f(x, y))
      }
    }

  // @see 74p
  def map22[A, B, C](a: Option[A], b: Option[B])(f: (A, B) => C): Option[C] =
    for {
      x <- a
      y <- b
    } yield f(x, y)

  // TODO: exercises 4-4
  def sequence[A](a: List[Option[A]]): Option[List[A]] = ???

  // TODO: exercises 4-5
  def traverse[A, B](a: List[A])(f: A => Option[B]): Option[List[B]] = ???
}
