import { AssertionError } from "assert";
import { Definition } from "../types";
import { isCDSDefinition } from "../utils";

export function mustBeArray<T extends Array<any>>(obj: T): T;
export function mustBeArray(obj: null): [];
export function mustBeArray(obj: undefined): [];
export function mustBeArray<T extends object>(obj: T): [T];
export function mustBeArray(obj: any): Array<any> {
  if (obj instanceof Array) {
    return obj;
  }
  if (obj === undefined || obj === null) {
    return [];
  }
  return [obj];
}

export function mustBeFunction(f: any): f is (...any: Array<any>) => any {
  if (typeof f === "function") {
    return true;
  }
  throw new AssertionError({ message: "function required", actual: typeof f, expected: "function" });
}

export function mustNotNullOrUndefined(v: any): boolean {
  if (v === undefined || v === null) {
    throw new AssertionError({ message: "not null/undefined value required", actual: v, expected: "any other value" });
  }
  return true;
}

export function mustBeCDSDefinition(v: any): v is Definition {
  if (isCDSDefinition(v)) {
    return true;
  }
  throw new AssertionError({ message: "CDS definition object required", actual: v, expected: "<CSN Definition>" });
}
