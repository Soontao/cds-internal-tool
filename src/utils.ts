/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { AxiosInstance } from "axios";
import process from "process";
import { CDS } from "./types";

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


/**
 * return null if strings are `null`/`undefined`
 * 
 * @param args 
 * @returns 
 */
export const defaultStringOrNull = (...args: Array<any>) => {
  for (const arg of args) {
    if (arg !== undefined && arg !== null) {
      return String(arg);
    }
  }
  return null;
};


export const setupTest = (...path: Array<string>): AxiosInstance => {
  const cds = require("@sap/cds") as CDS;
  const { axios } = cds.test(".").in(...path);
  return axios;
};


/**
 * require for current work directory
 * 
 * @param id 
 * @returns 
 */
export const cwdRequire = (id: string) => require(require.resolve(id, { paths: [process.cwd()] }));


/**
 * utils for memorized (sync) **ONE-parameter** function
 * 
 * @param func a function which only have one parameter
 * @returns 
 */
export const memorized = <T extends (arg0: any) => any>(func: T): T => {
  let cache: WeakMap<any, any>;

  // @ts-ignore
  return function (arg0: any) {
    if (cache === undefined) {
      if (typeof arg0 === "object") {
        cache = new WeakMap();
      } else {
        cache = new Map();
      }
    }
    if (!cache.has(arg0)) {
      cache.set(arg0, func(arg0));
    }
    return cache.get(arg0);
  };
};

/**
 * very simple safe `get` function
 * 
 * @param object 
 * @param path 
 * @returns 
 */

export const get = (object: any, path: string) => {
  if (path?.length > 0) {
    for (const part of path.split(".")) {
      if (object?.[part] !== undefined) {
        object = object[part];
      } else {
        return undefined;
      }
    }
  }
  return object;
};
