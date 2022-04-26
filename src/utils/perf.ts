/**
 * utils for memorized (sync) **ONE-parameter** function
 * 
 * @param func a function which only have one parameter
 * @returns 
 */
export const memorized = <T extends (arg0: any) => any>(func: T): T => {
  let cache: WeakMap<Parameters<T>[0], ReturnType<T>>;

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
  } as any;
};
