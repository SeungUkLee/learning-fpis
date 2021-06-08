export function isSorted<A>(
  as: A[],
  ordered: (a: A, b: A) => boolean
): boolean {
  const end = as.length - 1;
  const go = (i: number): boolean =>
    i >= end ? true : ordered(as[i], as[i + 1]) && go(i + 1);

  return go(0);
}
