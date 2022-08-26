package fpinscala.exercises.errorhandling

import scala.{Option => _, Either => _, _}

sealed trait Option[+A] { self =>
  // Listing4-2, exercises 4-1
  def map[B](f: A => B): Option[B] =
    self match {
      case None      => None
      case Some(get) => Some(f(get))
    }

  def flatMap[B](f: A => Option[B]): Option[B] =
    map(f).getOrElse(None)

  def getOrElse[B >: A](default: => B): B =
    self match {
      case None      => default
      case Some(get) => get
    }

  def orElse[B >: A](ob: Option[B]): Option[B] =
    map(Some(_)).getOrElse(ob)

  def filter(f: A => Boolean): Option[A] =
    flatMap(a => if (f(a)) Some(a) else None)
}

case object None extends Option[Nothing]
case class Some[+A](get: A) extends Option[A]

object Option {
  // exercises 4-2
  def variance(xs: Seq[Double]): Option[Double] =
    mean(xs).flatMap { m =>
      mean(xs.map { x =>
        math.pow(x - m, 2)
      })
    }

  def mean(xs: Seq[Double]): Option[Double] =
    if (xs.isEmpty) None
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
