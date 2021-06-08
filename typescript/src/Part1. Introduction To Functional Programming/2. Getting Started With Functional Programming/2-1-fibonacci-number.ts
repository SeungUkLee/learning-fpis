// Fibonacci number
import { Recursion, makeDelay, makeReturn, runRec } from './trampoline';

export function fibTrampoline(n: number): number {
  const fibR = (n: number, prev: number, cur: number): Recursion<number> => 
    n <= 0 ? makeReturn(prev) : makeDelay(() => fibR(n - 1, cur, prev + cur))
  
  return runRec(fibR(n, 0, 1));
}
 
export function fib(n: number): number {
  const go = (n: number, prev: number, cur: number): number => 
    n <= 0 ? prev : go(n - 1, cur, prev + cur)
  
  return go(n, 0, 1);
}

