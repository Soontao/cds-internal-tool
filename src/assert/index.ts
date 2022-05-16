import { AssertionError } from "assert";

export function mustBeFunction(f: any): f is (...any: Array<any>) => any {
  if (typeof f === "function") {
    return true;
  }
  throw new AssertionError({ message: "function required", actual: typeof f, expected: "function" });
}


