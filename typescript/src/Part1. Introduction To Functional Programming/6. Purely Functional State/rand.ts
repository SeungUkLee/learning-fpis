import { absurd } from "fp-ts/lib/function";
import * as L from "../3. Functional Data Structures/list";

type Int = number;
type Double = number;

export interface RNG {
  nextInt(): [Int, RNG]
};

class SimpleRNG implements RNG {
  constructor(readonly seed: bigint) { }

  nextInt(): [Int, RNG] {
    const newSeed = (this.seed * 0x5DEECE66Dn + 0xBn) & 0xFFFFFFFFFFFFn;
    const nextRNG = new SimpleRNG(newSeed);
    const n = Number(newSeed >> 16n)

    return [n, nextRNG];
  }
};


// Exercises 6-1
export const nonNegativeInt = (rng: RNG): [Int, RNG] => {
  const [n, r] = rng.nextInt();

  return [ n > 0 ? n : - (n + 1), r ];
};

// Exercises 6-2
export const double = (rng: RNG): [Double, RNG] => {
  const [n, r] = rng.nextInt();
  const maxValue = Number.MAX_SAFE_INTEGER;

  return [n / maxValue + 1, r];
}

// Exercises 6-3
const intDouble = (rng: RNG): [[Int, Double], RNG] => {
  const [n, r1] = rng.nextInt();
  const [d, r2] = double(r1);

  return [[n, d], r2];
};

const doubleInt = (rng: RNG): [[Double, Int], RNG] => {
  const [[n, d], r] = intDouble(rng);
  
  return [[d, n], r];
};

const double3 = (rng: RNG): [[Double, Double, Double], RNG] => {
  const [d1, r1] = double(rng);
  const [d2, r2] = double(r1);
  const [d3, r3] = double(r2);

  return [[d1, d2, d3], r3];
};

// Exercises 6-4
const ints = (count: Int) => (rng: RNG): [L.List<Int>, RNG] => {
  const iter = (count: Int, r: RNG, acc: L.List<Int>): [L.List<Int>, RNG] => {
    if (count === 0) {
      return [acc, r];
    } else {
      const [n, r2] = r.nextInt();
      return iter(count - 1, r2, L.cons(n, acc))
    }
  }

  return iter(count, rng, L.nil());
}

// in 106p ~ 107p

type Rand<A> = (rng: RNG) => [A, RNG];

const int: Rand<Int> = (rng: RNG) => rng.nextInt();

const unit = <A>(a: A): Rand<A> => {
  return (rng) => [a, rng];
};

const map = <A>(s: Rand<A>) => <B>(f: (a: A) => B): Rand<B> => {
  return (rng) => {
    const [a, rng2] = s(rng);
    return [f(a), rng2];
  };
};

const nonNegativeEven : Rand<Int> = map(nonNegativeInt)((i) => i - i % 2);

// Exercises 6-5
const double2: Rand<Double> = map(nonNegativeInt)((n) => n / Number.MAX_SAFE_INTEGER + 1);

// Exercises 6-6
const map2 = <A, B>(ra: Rand<A>, rb: Rand<B>) => <C>(f: (a: A, b: B) => C): Rand<C> => {
  return (rng) => {
    const [a, r1] = ra(rng);
    const [b, r2] = rb(r1);
    return [f(a, b), r2];
  }
}

// in 108p
const both = <A, B>(ra: Rand<A>, rb: Rand<B>): Rand<[A, B]> =>
  map2(ra, rb)((a, b) => [a, b]);

const randIntDouble: Rand<[Int, Double]> = both(int, double);
const randDoubleInt: Rand<[Double, Int]> = both(double, int);

// Exercises 6-7
// NOTE: Hard...
const sequence = <A>(lr: L.List<Rand<A>>): Rand<L.List<A>> => {
  const id = <A>(a: A) => a;
  return traverse(lr)(id)
}

const apply = <A>(ra: Rand<A>) => <B>(rf: Rand<(a: A) => B>): Rand<B> => {
  return (rng) => {
    const [f, r1] = rf(rng)
    const [a, r2] = ra(r1)
    return [f(a), r2]
  }
}

// @see https://fsharpforfunandprofit.com/posts/elevated-world-4/#the-traverse--mapm-function
const traverse = <A>(l: L.List<A>) => <B>(f: (a: A) => Rand<B>): Rand<L.List<B>> => {
  switch(l._tag) {
    case 'Nil': {
      return unit(L.nil());
    }
    case 'Cons': {
      const { head, tail } = l;
      return apply(traverse(tail)(f))(apply(f(head))(unit(L.consC)))
    }
    default: return absurd(l)
  }
}

// use foldRight
const traverse2 = <A>(l: L.List<A>) => <B>(f: (a: A) => Rand<B>): Rand<L.List<B>> =>
  L.foldRight(l, unit(L.nil()) as Rand<L.List<B>>)((a, acc) => map2(f(a), acc)(L.cons))

 
const ints2 = (count: Int): Rand<L.List<Int>>=>
  sequence(L.fill(count)(int))


// Exercises 6-8
const flatMap = <A>(f: Rand<A>) => <B>(g: (a: A) => Rand<B>): Rand<B> => {
  return (rng) => {
    const [a, r] = f(rng);
    return g(a)(r)
  }
}

const nonNegativeLessThan = (n: Int): Rand<Int> =>
  flatMap(nonNegativeInt)((i) => {
    const mod = i % n;
    return (i + (n - 1) - mod >= 0) ? unit(mod) : nonNegativeLessThan(n);
  })


// Exercises 6-9
const map3 = <A>(s: Rand<A>) => <B>(f: (a: A) => B): Rand<B> =>
  flatMap(s)((a) => unit(f(a)))


const map4 = <A, B>(ra: Rand<A>, rb: Rand<B>) => <C>(f: (a: A, b: B) => C): Rand<C> =>
  flatMap(ra)((a) => map(rb)((b) => f(a, b)))


// in 111p ~ 112p
const rollDie: Rand<Int> = nonNegativeLessThan(6);
const sr = new SimpleRNG(5n);
const zero = rollDie(sr)[0];
const rollDie2: Rand<Int> = map(nonNegativeLessThan(6))((n) => n + 1)

type State<S, A> = (s: S) => [A, S];
type Rand2<A> = State<RNG, A>;

