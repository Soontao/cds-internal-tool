/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { AxiosInstance } from "axios";
import path from "path";
import process from "process";
import * as assert from "./assert";
import { LRUMap } from "./foundation";
import { CDS, Definition, Event, Request, Service } from "./types";
export { mustBeArray } from "./assert";



// >>>> check 

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
 * check object is a cds definition or not (from LinkedCSN)
 * @param obj 
 * @returns 
 */
export const isCDSDefinition = (obj: any) => {
  const cds = cwdRequireCDS();
  if (obj instanceof cds.builtin.classes.any) {
    return true;
  }
  return false;
};

/**
 * check object is a cds service or not
 * @param obj 
 * @returns 
 */
export const isCDSService = (obj: any): obj is Service => {
  return obj instanceof cwdRequireCDS().Service;
};

// <<< check


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
  const cds = cwdRequireCDS();
  const { axios } = cds.test(".").in(...path);
  axios.defaults.validateStatus = () => true;
  return axios;
};


/**
 * require for current work directory
 * 
 * @param parts module parts 
 * @returns 
 */
export function cwdRequire(...parts: Array<string>): any;
/**
 * require for current work directory
 * @param id module id
 */
export function cwdRequire(id: string): any;
export function cwdRequire(def: Definition | Service, relId: string): any;
export function cwdRequire(...args: any[]) {
  let [id] = args;
  if (isCDSDefinition(id) || isCDSService(id)) {
    id = path.join(getDefinitionBaseDir(id), ...args.slice(1));
  } else {
    if (args.length > 1) {
      id = path.join(...args);
    }
  }
  return require(require.resolve(id, { paths: [process.cwd()] }));
}


/**
 * require `@sap/cds` from current work space
 * 
 * @returns 
 */
export const cwdRequireCDS = (): CDS => require(require.resolve("@sap/cds", { paths: [process.cwd()] }));

/**
 * require module based on CAP nodejs runtime project root.
 * it will be useful the relative path module which defined in cds configurations maybe
 * 
 * @param mName module name
 * @returns 
 */
export const cdsProjectRequire = (mName: string) => require(path.join(cwdRequireCDS().options.project, mName));



/**
 * `hyper` memorized function, make it support multi parameters function
 * 
 * PLEASE only use it for **RESTRICTED** metadata instead of transaction data
 * 
 * @param func a function, but parameters could not be null/undefined
 * @param parametersNumber the number of parameters, to restrict the callee arguments
 * @param lruMapSize cache size for each key default is 1024
 * @returns memorized function
 */
export const memorized = <T extends (...args: Array<any>) => any>(
  func: T,
  parametersNumber?: number,
  lruMapSize = 1024
) => {

  let caches: LRUMap<any, any>;

  const memorizedFunc = (...args: Array<any>) => {

    if (parametersNumber === undefined) {
      parametersNumber = args.length;
    } else {
      assert.mustEqual(
        parametersNumber,
        args.length,
        "memoried function could not change the number of parameters after first invocation"
      );
    }

    const lastArg = last(args);

    if (caches === undefined) {
      caches = new LRUMap(lruMapSize);
    }

    let cache = caches;

    for (let idx = 0; idx < args.length - 1; idx++) {
      const arg = args[idx];
      if (!cache.has(arg)) {
        cache.set(arg, new LRUMap());
      }
      cache = cache.get(arg);
    }

    if (!cache.has(lastArg)) { cache.set(lastArg, func(...args)); }
    return cache.get(lastArg);
  };

  memorizedFunc.clear = () => {
    if (caches !== undefined) {
      caches = new LRUMap();
    }
  };

  Object.defineProperty(memorizedFunc, "caches", {
    get() { return caches; }
  });

  Object.defineProperty(memorizedFunc, "name", { value: func.name });

  return memorizedFunc as (T & { clear: () => void, caches: LRUMap<any, any> });
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
    const pathParts = cur.substring(prefix.length + 1).split(".");
    const lastPart: any = pathParts.pop();
    let targetObjectRef = pre;
    if (pathParts.length > 0) {
      // deep create target object path ref
      for (const pathPart of pathParts) {
        if (pre[pathPart] === undefined) { pre[pathPart] = {}; }
        targetObjectRef = pre[pathPart];
      }
    }
    targetObjectRef[lastPart] = obj[cur];
    return pre;
  }, base);

};


/**
 * return last item of a list
 * 
 * @param list 
 * @returns 
 */
export function last<T = any>(list: Array<T>): T | undefined {
  if (list instanceof Array && list.length >= 1) {
    return list[list.length - 1];
  }
}

/**
 * get the absolutely path of specific CDS definition
 * @param def 
 */
export function getDefinitionPath(def: Definition): string
export function getDefinitionPath(def: Service): string
export function getDefinitionPath(def: any): string {
  const cds = cwdRequireCDS();
  if (isCDSService(def)) { def = def.definition; }

  assert.mustNotNullOrUndefined(def);

  const base = cds.options.project;
  return path.join(base, def["$location"].file);
}

export function getDefinitionBaseDir(def: Definition): string
export function getDefinitionBaseDir(def: Service): string
export function getDefinitionBaseDir(def: any): string {
  return path.dirname(getDefinitionPath(def));
}
