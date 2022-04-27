/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { AxiosInstance } from "axios";
import process from "process";
import { CDS, Event, Request } from "./types";

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
 * assume the obj is a cds Request, so that could use it safely
 * 
 * @param obj 
 * @returns 
 */
export function isCDSRequest(obj: any): obj is Request {
  const cds = cwdRequireCDS();
  return obj instanceof cds.Request;
}

export function isCDSEvent(obj: any): obj is Event {
  const cds = cwdRequireCDS();
  return obj instanceof cds.Event;
}


/**
 * return null if strings are `null`/`undefined`
 * 
 * @param args 
 * @returns 
 */
export function defaultStringOrNull(...args: Array<null | undefined>): null;
export function defaultStringOrNull(...args: Array<any>): string;
export function defaultStringOrNull(...args: Array<any>) {
  for (const arg of args) {
    if (arg !== undefined && arg !== null) {
      return String(arg);
    }
  }
  return null;
}


/**
 * setup test and return an axios instance
 * 
 * the instance will not throw error when status is not 2xx
 * 
 * @param path 
 * @returns axios instance
 */
export const setupTest = (...path: Array<string>): AxiosInstance => {
  const cds = require("@sap/cds") as CDS;
  const { axios } = cds.test(".").in(...path);
  axios.defaults.validateStatus = () => true;
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
 * require `@sap/cds` from current work space
 * 
 * @returns 
 */
export const cwdRequireCDS = (): CDS => cwdRequire("@sap/cds");


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

/**
 * utils for deep annotation
 * 
 * @param obj 
 * @param prefix 
 * @returns 
 */
export const groupByKeyPrefix = (obj: any, prefix: string) => {
  if (obj === undefined || obj === null) {
    return {};
  }
  const keys = Object.keys(obj);
  const base = prefix in obj ? (obj[prefix] ?? {}) : {};
  const potentialMergedKeys = keys.filter(objectKey => objectKey.startsWith(prefix) && objectKey !== prefix);

  if (typeof base !== "object") {
    // if base is number or string
    if (potentialMergedKeys.length > 0) {
      cwdRequireCDS()
        .log("cds-internal-tool")
        .warn(
          "group obj",
          obj?.name ?? obj,
          "has a property full match the prefix",
          prefix,
          "but type is not object, ignore other properties",
          potentialMergedKeys
        );
    }
    return base;
  }
  return potentialMergedKeys.reduce((pre: any, cur: string) => {
    pre[cur.substring(prefix.length + 1)] = obj[cur];
    return pre;
  }, base);

};
