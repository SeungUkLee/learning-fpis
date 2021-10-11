// import * as E from "../../Part1. Introduction To Functional Programming/4. Handling Erros Without Exceptions/either";
import * as L from "../../Part1. Introduction To Functional Programming/3. Functional Data Structures/list";
import * as E from 'fp-ts/lib/Either';
import { URIS, Kind } from 'fp-ts/lib/HKT';


export interface Parsers<ParseError, Parser extends URIS> {
  readonly run: <A>(p: Kind<Parser, A>) => (input: string) => E.Either<ParseError, A>

  readonly string: typeof string
  readonly regex: typeof regex
  readonly slice: typeof slice
  readonly succeed: typeof succeed
  readonly flatMap: typeof flatMap
  readonly or: typeof or
}

// Primitives
declare const string: <Parser extends URIS>(s: string) => Kind<Parser, string>
declare const slice: <A, Parser extends URIS>(p: Kind<Parser, A>) => Kind<Parser, string>
declare const or: <A, Parser extends URIS>(p1: Kind<Parser, A>, p2: Kind<Parser, A>) => Kind<Parser, A>
declare const flatMap: <A, Parser extends URIS>(p: Kind<Parser, A>) => <B>(f: (a: A) => Kind<Parser, B>) => Kind<Parser, B>
declare const succeed: <A, Parser extends URIS>(a: A) => Kind<Parser, A>
declare const regex: <Parser extends URIS>(r: RegExp) => Kind<Parser, string>


// Exercises 9-1
const _map2 = <A, B, Parser extends URIS>(p1: Kind<Parser, A>, p2: Kind<Parser, B>) => <C>(f: (e: [A, B]) => C): Kind<Parser, C> =>
  map(product(p1, p2))(f)

export const many1 = <A, Parser extends URIS>(p: Kind<Parser, A>): Kind<Parser, L.List<A>> =>
  map2(p, many(p))(([a, b]) => L.cons(a, b))

const asb = <Parser extends URIS>() => {
  // 0개 이상의 'a'들 다음에 하나 이상의 'b'들이 오는 문자열에 대한 파서 (in 198p)
  const as = map(slice(many(string<Parser>('a'))))((s) => s.length)
  const b = map(slice(many1(string<Parser>('b'))))((s) => s.length)

  return product(as, b);
}

// Exercises 9-2
// NOTE: Hard...
// associative, (a ** b) ** c = a ** (b ** c)

// Exercises 9-3
export const _many = <A, Parser extends URIS>(p: Kind<Parser, A>): Kind<Parser, L.List<A>> =>
  or(map2(p, many(p))(([x, y]) => L.cons(x, y)), succeed(L.nil() as L.List<A>))


// Exercises 9-4
export const listOfN = <A, Parser extends URIS>(n: number, p: Kind<Parser, A>): Kind<Parser, L.List<A>> => {
  if (n <= 0) {
    return succeed(L.nil() as L.List<A>)
  } else {
    return map2(p, listOfN(n - 1, p))(([a, b]) => L.cons(a, b))
  }
}
 

// Exercises 9-5
const lazy = <A, Parser extends URIS>(p: () => Kind<Parser, A>): Kind<Parser, A> => p()

export const many = <A, Parser extends URIS>(p: Kind<Parser, A>): Kind<Parser, L.List<A>> =>
  or(map2(p, lazy(() => many(p)))(([x, y]) => L.cons(x, y)), succeed(L.nil() as L.List<A>))


// Exercises 9-7
export const product = <A, B, Parser extends URIS>(p: Kind<Parser, A>, p2: Kind<Parser, B>): Kind<Parser, [A, B]> =>
  flatMap(p)((a) => map(p2)((b) => [a, b] as [A, B]))

export const map2 = <A, B, Parser extends URIS>(p: Kind<Parser, A>, p2: Kind<Parser, B>) => <C>(f: (e: [A, B]) => C): Kind<Parser, C> =>
  flatMap(p)((a) => map(p2)((b) => f([a, b])))


// Exercises 9-8
export const map = <A, Parser extends URIS>(p: Kind<Parser, A>) => <B>(f: (a: A) => B): Kind<Parser, B> =>
  flatMap(p)((a) => succeed(f(a)))

