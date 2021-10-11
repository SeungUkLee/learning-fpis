import { URIS, Kind } from 'fp-ts/lib/HKT';
import { Parsers } from './parser';

export type JSON =
  | JNull
  | JNumber
  | JString
  | JBool
  | JArray
  | JObject

class JNull {
  readonly _tag = 'JNull'
}

class JNumber {
  constructor(readonly get: number) {}
}

class JString {
  constructor(readonly get: string) {}
}

class JBool {
  constructor(readonly get: boolean) {}
}

class JArray {
  constructor(readonly get: JSON[]) {}
}

class JObject {
  constructor(readonly get: Map<String, JSON>) {}
}

const jsonParser = <Parser extends URIS>(p: Parsers<Error, Parser>) => {

}

