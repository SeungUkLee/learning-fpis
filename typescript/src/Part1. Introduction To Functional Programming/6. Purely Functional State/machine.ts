import * as L from "../3. Functional Data Structures/list"
import * as ST from "./state"

// Exercises 6-11
type Input =
  | Coin
  | Turn

class Coin {
  readonly _tag = "Coin"
}

class Turn {
  readonly _tag = "Turn"
}

// data constructors
const coin = ():Input => ({ _tag: "Coin" })
const turn = ():Input => ({ _tag: "Turn" })

export type Machine =
  | UnlockedState
  | LockedState
  | EmptyState

class UnlockedState {
  readonly _tag = "UnlockedState"
  constructor(readonly candies: number, readonly coins: number) {}
}

class LockedState {
  readonly _tag = "LockedState"
  constructor(readonly candies: number, readonly coins: number) {}
}

class EmptyState {
  readonly _tag = "EmptyState"
  constructor(readonly candies: 0, readonly coins: number) {}
}

// data constructor
export const unlockedState = (candies: number, coins: number): Machine => {
  return { _tag: "UnlockedState", candies, coins }
}
export const lockedState = (candies: number, coins: number): Machine => ({ _tag: "LockedState", candies, coins })
export const emptyState = (coins: number): Machine => ({ _tag: "EmptyState", candies: 0, coins })

// unlocked on creation
export const createMachine = (candies: number, coins: number): Machine => ({ _tag: "UnlockedState", candies, coins })

export const insertCoin = (m: Machine): Machine => {
  switch(m._tag) {
    case 'LockedState': {
      const { coins, candies } = m;
      return unlockedState(candies, coins + 1)
    }
    case 'UnlockedState': {
      return m
    }
    case 'EmptyState': {
      return m
    }
  }
};

export const turnHandle = (m: Machine): Machine => {
  switch(m._tag) {
    case 'LockedState': {
      return m
    }
    case 'UnlockedState': {
      const { coins, candies } = m;
      return candies > 0 ? lockedState(candies - 1, coins) : emptyState(coins)
    }
    case 'EmptyState': {
      return m
    }
  }
}

type CoinsAndCandies = [number, number];
const coinsAndCandies = (coins: number, candies: number): CoinsAndCandies => [coins, candies];

export const simulateMachine = (inputs: L.List<Input>): ST.State<Machine, CoinsAndCandies> => {
  const action = (input: Input) => (machine: Machine): Machine => {
    switch(input._tag) {
      case 'Coin': {
        return insertCoin(machine)
      }
      case 'Turn': {
        return turnHandle(machine)
      }
    }
  }

  const actions = L.map(inputs)((input) => ST.modify(action(input))) 

  return ST.flatMap(
    ST.sequence(actions)
  )((_) => ST.map(ST.get<Machine>())((m) => coinsAndCandies(m.coins, m.candies)))
}

