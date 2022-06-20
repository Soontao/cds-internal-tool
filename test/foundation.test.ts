import { LRUMap } from "../src/foundation";

describe("foundation Test Suite", () => {
  
  it("should support LRU Map", () => {

    const cache = new LRUMap(3);

    [1, 2, 3, 4, 5].forEach((v) => cache.set(v, `v:${v}`));

    expect(Array.from(cache.keys())).toHaveLength(3);
    expect(Array.from(cache.entries())).toHaveLength(3);

    expect(cache.get(2)).toBeUndefined();
    expect(cache.get(3)).toBe("v:3"); // refresh key
    cache.set(6, "v:6");
    expect(cache.get(4)).toBeUndefined();
    expect(cache.get(3)).toBe("v:3");
    expect(cache.get(6)).toBe("v:6");
    cache.clear();
    expect(cache.size).toBe(0);


  });

});
