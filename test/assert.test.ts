/* eslint-disable @typescript-eslint/no-empty-function */
import { assert, cwdRequireCDS, setupTest } from "../src";
import { mustBeCDSDefinition } from "../src/assert";


describe("Assert Test Suite", () => {

  setupTest(__dirname, "./app");
  const cds = cwdRequireCDS();

  it("should support mustBeFunction", () => {
    expect(assert.mustBeFunction(() => { })).toBeTruthy();
    expect(assert.mustBeFunction(async () => { })).toBeTruthy();
    expect(assert.mustBeFunction(function () { })).toBeTruthy();
    expect(assert.mustBeFunction(async function () { })).toBeTruthy();

    expect(() => assert.mustBeFunction(undefined)).toThrow();
    expect(() => assert.mustBeFunction("")).toThrow();
    expect(() => assert.mustBeFunction(Symbol("any"))).toThrow();
    expect(() => assert.mustBeFunction(new Date())).toThrow();
  });

  it("should support mustBeDefinition", () => {
    const entityDef = cds.model.entities()["test.app.srv.MyService.Foo"];
    expect(entityDef).not.toBeUndefined();
    expect(mustBeCDSDefinition(entityDef)).toBeTruthy();
    
    expect(() => mustBeCDSDefinition({})).toThrow();
  });

});
