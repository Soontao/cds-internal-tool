/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { CDS, cwdRequire } from "../src";
import * as utils from "../src/utils";

describe("Utils Test Suite", () => {

  it("should support alias export", async () => {
    expect(cwdRequire).toBe(utils.cwdRequire);
  });

  it('should support "cwdRequire" function', () => {
    const process = cwdRequire("process");
    expect(process).not.toBeUndefined();
  });

  it('should support "get"', async () => {
    const o1 = { a: [{ b: 1 }] };
    expect(utils.get(o1, "a.0.b")).toBe(1);
    expect(utils.get(o1, "a")).toBe(o1.a);
    // @ts-ignore
    expect(utils.get(o1, undefined)).toBe(o1);
    expect(utils.get(o1, "a.1.b")).toBeUndefined();
    expect(utils.get({ a: [null] }, "a.0.b")).toBeUndefined();
    expect(utils.get({ a: [null] }, "a.0")).toBeNull();
    expect(utils.get(o1, "a.0.b.a")).toBeUndefined();
    expect(utils.get(o1, "a.0.b.toFixed")).toBe(Number.prototype.toFixed);

  });

  it('should support function "defaultStringOrNull"', () => {

    expect(utils.defaultStringOrNull(null, undefined)).toBeNull();
    expect(utils.defaultStringOrNull(null, undefined, "a")).toBe("a");
    expect(utils.defaultStringOrNull(null, undefined, 1)).toBe("1");

  });

  it('should support method "mustBeArray"', () => {
    expect(utils.mustBeArray(null)).toStrictEqual([]);
    expect(utils.mustBeArray(undefined)).toStrictEqual([]);
    expect(utils.mustBeArray({ a: 123 })).toStrictEqual([{ a: 123 }]);
    expect(utils.mustBeArray([{ a: 1 }, { b: 1 }])).toStrictEqual([{ a: 1 }, { b: 1 }]);

  });
  it('should support method "memorized"', () => {

    const k1 = {};
    const k2 = "k2";
    const f1 = jest.fn().mockReturnValue(1);
    const f2 = jest.fn().mockReturnValue(2);

    const mf1 = utils.memorized(f1);
    const mf2 = utils.memorized(f2);

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

  it('should support multi parameters "hyperMemorized"', () => {
    const k1 = {};
    const k2 = "k2";
    const f1 = jest.fn().mockReturnValue(1);
    const f2 = jest.fn().mockReturnValue(2);

    const mf1 = utils.memorized(f1);
    const mf2 = utils.memorized(f2);

    expect(mf1(k1, k2)).toBe(1);
    expect(mf1(k1, k2)).toBe(1);
    expect(mf1(k1, k2)).toBe(1);
    expect(mf1(k1, k2)).toBe(1);
    expect(f1).toBeCalledTimes(1);

    expect(mf2(k2, k1)).toBe(2);
    expect(mf2(k2, k1)).toBe(2);
    expect(mf2(k2, k1)).toBe(2);
    expect(mf2(k2, k1)).toBe(2);
    expect(f2).toBeCalledTimes(1);

    expect(() => mf1(k2)).toThrow();
    expect(() => mf1(null)).toThrow();
    expect(() => mf1()).toThrow();
  });

  it("should support group object by key prefix", () => {
    expect(utils.groupByKeyPrefix(null, "")).toStrictEqual({});
    expect(utils.groupByKeyPrefix(undefined, "")).toStrictEqual({});

    const object = {
      "@cds.rate.limit.duration": 10,
      "@cds.rate.limit.points": 20,
      "@cds.rate.limit.keyParts": ["tenant", "remote_ip"],
    };
    const result = utils.groupByKeyPrefix(object, "@cds.rate.limit");

    expect(result).toStrictEqual({
      duration: 10,
      points: 20,
      keyParts: ["tenant", "remote_ip"],
    });

    const object2 = {
      "@cds.rate.limit": {
        duration: 10,
        points: 20,
        keyParts: ["tenant", "remote_ip"],
      }
    };
    const result2 = utils.groupByKeyPrefix(object2, "@cds.rate.limit");

    expect(result2).toStrictEqual({
      duration: 10,
      points: 20,
      keyParts: ["tenant", "remote_ip"],
    });



    const object3 = {
      "@cds.rate.limit": {
        duration: 10,
        points: 20,
      },
      "@cds.rate.limit.keyParts": ["tenant"],
    };
    const result3 = utils.groupByKeyPrefix(object3, "@cds.rate.limit");

    expect(result3).toStrictEqual({
      duration: 10,
      points: 20,
      keyParts: ["tenant"],
    });

  });



  it("should support groupByString key", () => {
    const object3 = {
      "@cds.rate.limit": "v1",
      "@cds.rate.limit.keyParts": ["tenant"],
    };
    const result3 = utils.groupByKeyPrefix(object3, "@cds.rate.limit");
    const v = "v1";
    expect(result3).toStrictEqual(v);
  });

  it("should support groupByKey deep key", () => {
    expect(
      utils.groupByKeyPrefix(
        {
          "@a.b.c.e.f": 1,
          "@a.b.c.f.c": [2, 3],
          "@a.b.c": { w: 3, c: 2 }
        },
        "@a.b.c"
      )
    )
      .toStrictEqual({
        w: 3,
        c: 2,
        e: { f: 1 },
        f: { c: [2, 3] }
      });

    expect(
      utils.groupByKeyPrefix(
        {
          "@a.b.c.e.f": 1,
          "@a.b.c.f": [2, 3],
          "@a.b.c": { w: 3, c: 2 }
        },
        "@a.b.c"
      )
    )
      .toStrictEqual({
        w: 3,
        c: 2,
        e: { f: 1 },
        f: [2, 3]
      });
  });

  it("should support isRequest", () => {
    const cds = utils.cwdRequireCDS();
    expect(utils.isCDSRequest(new cds.Request())).toBeTruthy();
    expect(utils.isCDSRequest(new cds.Event())).toBeFalsy();
  });


  it("should support iSEvent", () => {
    const cds: CDS = cwdRequire("@sap/cds");
    expect(utils.isCDSEvent(new cds.Request())).toBeTruthy();
    expect(utils.isCDSEvent(new cds.Event())).toBeTruthy();
  });

  it("should support last", () => {
    expect(utils.last([1])).toBe(1);
    expect(utils.last([])).toBeUndefined();
    expect(utils.last({})).toBeUndefined();
  });

});
