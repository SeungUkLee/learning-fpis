import * as fc from 'fast-check';

test('if isSorted(as, ordered) is ture, forall i,j . ordered(i, j) === ordered(as[i], as[j]) (0<= i, j <= length(as))', () => {
  // let arr = fc.array(fc.integer())
  // let len = arr.length
  // let i, j = fc.nat({ max: arr.length })
  // fc.assert(
  //   fc.property(fc.array(fc.integer()), data => {})
  // )
});

test('if isSorted(as, ordered) is false, exist i,j . ordered(i, j) !== ordered(as[i], as[j]) (0<= i, j <= length(as))', () => {
  // fc.assert(
  //   fc.property(fc.nat({ max: 10000000 }), data => {
  //     expect(fib(data + 2)).toEqual(fib(data + 1) + fib(data))
  //   }), { numRuns: 3 }
  // )
});

