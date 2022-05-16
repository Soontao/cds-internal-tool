/* eslint-disable @typescript-eslint/no-empty-function */
import { assert } from "../src";


describe("Assert Test Suite", () => {

  it("should support mustBeFunction", () => {
    expect(() => assert.mustBeFunction(() => { })).toBeTruthy();
    expect(() => assert.mustBeFunction(async () => { })).toBeTruthy();
    expect(() => assert.mustBeFunction(function () { })).toBeTruthy();
    expect(() => assert.mustBeFunction(async function () { })).toBeTruthy();

    expect(() => assert.mustBeFunction(undefined)).toThrow();
    expect(() => assert.mustBeFunction("")).toThrow();
    expect(() => assert.mustBeFunction(Symbol("any"))).toThrow();
    expect(() => assert.mustBeFunction(new Date())).toThrow();
  });

});
