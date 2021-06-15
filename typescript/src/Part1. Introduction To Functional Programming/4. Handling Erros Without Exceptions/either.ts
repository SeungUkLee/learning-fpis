import { foldRight, List, nil, cons } from '../3. Functional Data Structures/list';

class Left<E> {
  readonly _tag = "Left"
  constructor(readonly value: E) {}
}

class Right<A> {
  readonly _tag = "Right"
  constructor(readonly value: A) {}
}

export type Either<E, A> = Left<E> | Right<A>
// export const left = <E>(e: E): Either<E, never> => new Left(e);
export const left = <E = never, A = never>(e: E): Either<E, A> => new Left(e);
export const right = <A>(v: A): Either<never, A> => new Right(v);

// Exercise 4-6
export const map = <E, A>(either: Either<E, A>) => <B>(f: (a: A) => B): Either<E, B> => {
  switch(either._tag) {
    case 'Left': return left(either.value);
    case 'Right': return right(f(either.value));
  }
};

export const flatMap = <E, A>(either: Either<E, A>) => <B>(f: (a: A) => Either<E, B>): Either<E, B> => {
  switch(either._tag) {
    case 'Left': return left(either.value);
    case 'Right': return f(either.value);
  }
};

export const orElse = <E, A>(either: Either<E, A>, b: () => Either<E, A>): Either<E, A> => {
  switch(either._tag) {
    case 'Left': return b();
    case 'Right': return right(either.value);
  }
};

export const map2 = <E, A, B>(ea: Either<E, A>, eb: Either<E, B>) => <C>(f: (a: A, b: B) => C): Either<E, C> => 
  flatMap(ea)(a => map(eb)(b => f(a, b)))

const id = <A>(x: A): A => x;
export const sequence = <E, A>(es: List<Either<E, A>>): Either<E, List<A>> => traverse(es)(id);

export const traverse = <A>(as: List<A>) => <E, B>(f: (a: A) => Either<E, B>): Either<E, List<B>> =>
  foldRight(as, right(nil()) as Either<E, List<B>>)((a, acc) => map2(f(a), acc)(cons));

// Exercise 4-8 & Listing 4-4
class Name {
  readonly _tag = "Name"
  constructor(readonly value: string) {}
}

class Age {
  readonly _tag = "Age"
  constructor(readonly value: number) {}
}

class Person {
  readonly _tag = "Person"
  constructor(readonly name: Name, readonly age: Age) {}
}

export const mkName = (name: string): Either<string, Name> => {
  if (name === "" || name === null) return left("Name is empty.");
  else return right(new Name(name))
}

export const mkAge = (age: number): Either<string, Age> => {
  if (age < 0) return left("Age is out of range");
  else return right(new Age(age))
}

export const mkPerson = (name: string, age: number): Either<string, Person> =>
  map2(mkName(name), mkAge(age))((name, age) => new Person(name ,age))

// 실패를 나타내는 data constructor 에 error list 를 가지는 data type 을 만들면 된다.
// @see https://github.com/fpinscala/fpinscala/blob/first-edition/answerkey/errorhandling/08.answer.scala
// TODO: flatMap 은 오류를 누적할 수 없다. 왜?
class Errors<A> {
  readonly _tag = "Errors"
  constructor(readonly errors: A[]) {}
}

class Success<B> {
  readonly _tag = "Success"
  constructor(readonly value: B) {}
}

export type Partial<A, B> = Errors<A> | Success<B>

export const errors = <E>(errors: E[]): Partial<E, never> => new Errors(errors);
export const success = <A>(a: A): Partial<never, A> => new Success(a);

