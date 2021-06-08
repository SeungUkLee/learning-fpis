export function curry<A, B, C>(
  f: (a: A, b: B) => C
): (a: A) => (b: B) => C {
  return (a: A) =>(b: B) => f(a, b)
}

