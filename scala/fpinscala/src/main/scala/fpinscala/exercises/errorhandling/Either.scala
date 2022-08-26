package fpinscala.exercises.errorhandling

import scala.{Option => _, Either => _, _}

sealed trait Either[+E, +A] { self =>
  // exercises 4-6
  def map[B](f: A => B): Either[E, B] =
    self match {
      case Left(value)  => Left(value)
      case Right(value) => Right(f(value))
    }

  def flatMap[EE >: E, B](f: A => Either[EE, B]): Either[EE, B] =
    self match {
      case Left(value)  => Left(value)
      case Right(value) => f(value)
    }

  def orElse[EE >: E, B >: A](b: => Either[EE, B]): Either[EE, B] =
    self match {
      case Left(_)      => b
      case Right(value) => Right(value)
    }

  def map2[EE >: E, B, C](ei: Either[EE, B])(f: (A, B) => C): Either[EE, C] =
    for {
      a <- self
      b <- ei
    } yield f(a, b)

  def map22[EE >: E, B, C](ei: Either[EE, B])(f: (A, B) => C): Either[EE, C] =
    self.flatMap { a =>
      ei.map { b =>
        f(a, b)
      }
    }

}

case class Left[+E](value: E) extends Either[E, Nothing]
case class Right[+A](value: A) extends Either[Nothing, A]

object Either {
  // TODO: exercises 4-7
  def sequence[E, A](es: List[Either[E, A]]): Either[E, List[A]] =
    ???

  def traverse[E, A, B](as: List[A])(f: A => Either[E, B]): Either[E, List[B]] =
    ???

  // exercises 4-8
  /**
   * 실패를 나타내는 Data constructor 에 error list 를 가지는 data type 을 만들면 된다.
   * @see https://github.com/fpinscala/fpinscala/blob/da183734af0ebbc1c0ae8fa4bd9e8ec5acbd1216/answerkey/errorhandling/08.answer.scala#L1
   * TODO: 왜 flatMap 은 오류를 누적할 수 없을까?
   */
}
