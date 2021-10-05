import * as O from "../../Part1. Introduction To Functional Programming/4. Handling Erros Without Exceptions/option";
import * as S from "../../Part1. Introduction To Functional Programming/5. Strictness And Laziness/stream";
import * as G from "./gen";
import { RNG } from "../../Part1. Introduction To Functional Programming/6. Purely Functional State/rand";


// Exercises 8-1
// 1. 빈 리스트의 합은 0 이다.
// 2. 교환 법칙, sum(l) == sum(l.reverse)
// 3. 겷합 법칙, sum(List(a, b, c, d)) == sum(List(a, b)) + sum(List(c, d))
// 3. 1 ~ n 까지의 합은 n * (n + 1) / 2 와 같다
// 4. sum(List.fill(n)(x)) == n * x


// Exercises 8-2
// 1. 리스트의 요소가 하나만 있는 경우 최댓값은 해당 요소와 같다
// 2. 최댓값은 리스트의 요소여야한다
// 3. 최댓값은 리스트의 모든 요소보다 크거나 같다
// 4. 빈리스트인 경우 None 을 반환하거나 error 를 throw 해야한다


type FailedCase = string;
type SuccessCount = number;
type TestCases = number;

// Listing 8.2 (in 169p)
interface Result {
  isFalsified: boolean
}

class Passed implements Result {
  readonly isFalsified = false
}

class Falsified implements Result {
  readonly isFalsified = true;
  constructor(readonly failure: FailedCase, readonly success: SuccessCount) {}
}

export type Prop = (t: [TestCases, RNG]) => Result;

// Listing 8.3 (in 170p)
export const forAll = <A>(as: G.Gen<A>) => (f: (a: A) => boolean): Prop => {
  return ([n, rng]) => 
    O.getOrElse(
      S.find(
        S.map(
          S.take(
            S.zip(
              randomStream(as)(rng),
              S.from(0)
            ), n)) (([a, i]) => {
              try {
                return f(a) ? new Passed() : new Falsified(`${a}`, i)
              } catch(e) {
                const error = e as Error;
                return new Falsified(buildMsg(`${a}`, error), i)
              }
            }))((_) => _.isFalsified), () => new Passed())}

const randomStream = <A>(g: G.Gen<A>) => (rng: RNG): S.Stream<A> =>
  S.unfold(rng, (rng) => O.some(g(rng)))


const buildMsg = <A>(s: A, e: Error): string =>
  `test case: ${s}\n` +
  `generated an exceptions: ${e.message}\n` +
  `stack trace: ${e.stack}`

