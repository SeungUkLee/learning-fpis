import * as L from "../3. Functional Data Structures/list";

// Exercises 6-10
export type State<S, A> = (s: S) => [A, S];

export const unit = <S, A>(a :A): State<S, A> => {
  return (s) => [a, s];
};

export const map = <S, A>(st: State<S, A>) => <B>(f: (a: A) => B): State<S, B> =>
  flatMap(st)((a) => unit(f(a)));

export const map2 = <S, A, B>(st1: State<S, A>, st2: State<S, B>) => <C>(f: (a: A, b: B) => C): State<S, C> =>
  flatMap(st1)((a) => map(st2)((b) => f(a, b)))

export const flatMap = <S, A>(st: State<S, A>) => <B>(f: (a: A) => State<S, B>): State<S, B> => {
  return (s) => {
    const [a, s1] = st(s);
    return f(a)(s1)
  }
};

export const sequence = <S, A>(lst: L.List<State<S, A>>): State<S, L.List<A>> => 
  traverse(lst)(id);

const id = <A>(x: A): A => x;

export const traverse = <A>(l: L.List<A>) => <S, B>(f: (a: A) => State<S, B>): State<S, L.List<B>> =>
  L.foldRight(l, unit(L.nil()) as State<S, L.List<B>>)((a, acc) =>
    map2(f(a), acc)(L.cons)
  );

// in 114p
export const modify = <S>(f: (s: S) => S): State<S, void> =>
  flatMap(get<S>())((s) => set(f(s)));

export const get = <S>(): State<S, S> => {
  return (s) => [s, s]
};

export const set = <S>(s: S): State<S, void> => {
  return (_) => [undefined, s]
}

