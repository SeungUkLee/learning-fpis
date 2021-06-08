import * as fc from 'fast-check';
import { fib } from '../2-1-fibonacci-number';

test('"fib(n + 2)" Equals to "fib(n + 1) + fib(n)"', () => {
  fc.assert(
    fc.property(fc.nat({ max: 1000 }), data => {
      expect(fib(data + 2)).toEqual(fib(data + 1) + fib(data))
    }), { numRuns: 3 }
  )
});

