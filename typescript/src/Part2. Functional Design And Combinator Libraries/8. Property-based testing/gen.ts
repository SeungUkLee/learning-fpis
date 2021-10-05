import * as L from "../../Part1. Introduction To Functional Programming/3. Functional Data Structures/list";
import * as ST from "../../Part1. Introduction To Functional Programming/6. Purely Functional State/state";
import { RNG, nonNegativeInt double } from "../../Part1. Introduction To Functional Programming/6. Purely Functional State/rand";

export type Gen<A> = ST.State<RNG, A>;

// Exercises 8-4
export const choose = (start: number, stopExclusive: number): Gen<number> =>
  ST.map(nonNegativeInt)((n) => start + n % (stopExclusive - start))


// Exercises 8-5
export const unit = <A>(a: () => A): Gen<A> =>
  ST.unit(a());

export const bool: Gen<boolean> = (rng) => {
  const a = rng.nextInt();
  return [a[0] % 2 === 0, a[1]];
};

export const listOfN = (n: number) => <A>(ga: Gen<A>): Gen<L.List<A>> =>
  ST.sequence(L.fill(n)(ga));


// Exercises 8-6
export const flatMap = <A>(ga: Gen<A>) => <B>(f: (a: A) => Gen<B>): Gen<B> =>
  ST.flatMap(ga)((a) => f(a))


export const listOfN2 = (size: Gen<number>) => <A>(ga: Gen<A>): Gen<L.List<A>> =>
  flatMap(size)((n) => listOfN(n)(ga))


// Exercises 8-7
export const union = <A>(g1: Gen<A>, g2: Gen<A>): Gen<A> =>
  flatMap(bool)((a) => a ? g1 : g2)


// Exercises 8-8
export const weighted = <A>(g1: [Gen<A>, number], g2: [Gen<A>, number]): Gen<A> => {
  const a = Math.abs((g1[1]));
  const b = Math.abs((g2[1]));
  const c = a / (a + b);

  return flatMap(double)((d) => d < c ? g1[0] : g2[0]);
}
