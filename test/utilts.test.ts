/* eslint-disable @typescript-eslint/ban-ts-comment */

import { utils } from "../src/utils";


describe("Utils Test Suite", () => {

  it('should support "get"', async () => {
    const o1 = { a: [{ b: 1 }] };
    expect(utils.object.get(o1, "a.0.b")).toBe(1);
    expect(utils.object.get(o1, "a")).toBe(o1.a);
    // @ts-ignore
    expect(utils.object.get(o1, undefined)).toBe(o1);
    expect(utils.object.get(o1, "a.1.b")).toBeUndefined();
    expect(utils.object.get({ a: [null] }, "a.0.b")).toBeUndefined();
    expect(utils.object.get({ a: [null] }, "a.0")).toBeNull();
    expect(utils.object.get(o1, "a.0.b.a")).toBeUndefined();
    expect(utils.object.get(o1, "a.0.b.toFixed")).toBe(Number.prototype.toFixed);

  });

  it('should support method "mustBeArray"', () => {
    expect(utils.assert.mustBeArray(null)).toStrictEqual([]);
    expect(utils.assert.mustBeArray(undefined)).toStrictEqual([]);
    expect(utils.assert.mustBeArray({ a: 123 })).toStrictEqual([{ a: 123 }]);
    expect(utils.assert.mustBeArray([{ a: 1 }, { b: 1 }])).toStrictEqual([{ a: 1 }, { b: 1 }]);

  });
  it('should support method "memorized"', () => {

    const k1 = {};
    const k2 = "k2";
    const f1 = jest.fn().mockReturnValue(1);
    const f2 = jest.fn().mockReturnValue(2);

    const mf1 = utils.perf.memorized(f1);
    const mf2 = utils.perf.memorized(f2);

    expect(mf1(k1)).toBe(1);
    expect(mf1(k1)).toBe(1);
    expect(mf1(k1)).toBe(1);
    expect(mf1(k1)).toBe(1);
    expect(f1).toBeCalledTimes(1);

    expect(mf2(k2)).toBe(2);
    expect(mf2(k2)).toBe(2);
    expect(mf2(k2)).toBe(2);
    expect(mf2(k2)).toBe(2);
    expect(f2).toBeCalledTimes(1);

    expect(() => mf1(k2)).toThrow();


  });

});
