/* eslint-disable max-len */
import path from "path";
import { fuzzy } from "../src";
import { cdsProjectRequire, cwdRequire, cwdRequireCDS, getDefinitionBaseDir, getDefinitionPath, setupTest } from "../src/utils";



describe("CDS setupTest Suite", () => {

  const axios = setupTest(__dirname, "./app");
  const cds = cwdRequireCDS();

  it("should support get odata metadata", async () => {
    const response = await axios.get("/index/$metadata");
    expect(response.status).toBe(200);
    expect(response.data).toMatch(/People/);
  });

  it("should not throw error when data not existed", async () => {
    const response = await axios.get("/index/People(220247c7-4b29-4c2c-b28f-2321fc57ba7e)");
    expect(response.status).toBe(404);
  });


  it("should support require module by cds project", () => {
    const v = cdsProjectRequire("./srv/whatever");
    expect(v).toBe(1);
  });

  it("should support fuzzy find entity", () => {
    const { model } = cwdRequireCDS();
    const { Foo: FooDef } = model.entities("test.app.srv.MyService");
    const MyService = model.definitions["test.app.srv.MyService"];
    expect(MyService).not.toBeUndefined();

    const SubEvtDef = model.definitions["test.app.srv.MyService.sub"];

    expect(FooDef).not.toBeUndefined();
    expect(fuzzy.findEntity("Foo")).toBe(FooDef);
    expect(fuzzy.findEntity("testAppSrvMyServiceFoo")).toBe(FooDef);
    expect(fuzzy.findEvent("Sub")).toBe(SubEvtDef);

    expect(fuzzy.findElement(FooDef, "Age")).toBe(FooDef.elements["age"]);
    expect(fuzzy.findElement(FooDef, "a_ge")).toBe(FooDef.elements["age"]);
    expect(fuzzy.findElement(FooDef, "ageNew")).toBe(FooDef.elements["age_new"]);
    expect(fuzzy.findElement(FooDef, "height2")).toBe(FooDef.elements["height_2"]);

    expect(fuzzy.findService("my_service")).toBe(MyService);

  });

  it("should support fuzzy find action", () => {
    const { model } = cwdRequireCDS();
    const { Foo: FooDef } = model.entities("test.app.srv.MyService");
    expect(fuzzy.findAction("Add")).toBe(FooDef.actions.add);
    expect(fuzzy.findAction("testAppSrvMyServiceFooAdd")).toBe(FooDef.actions.add);
    expect(fuzzy.findFunction("Add")).toBeUndefined();
  });

  it("should support get definition location (service)", () => {
    expect(getDefinitionPath(cds.services["test.app.srv.MyService"].definition))
      .toBe(path.join(cds.options.project, "srv/demo.cds"));
    expect(getDefinitionPath(cds.services["test.app.srv.MyService"]))
      .toBe(path.join(cds.options.project, "srv/demo.cds"));
  });

  it("should support get definition location (entity)", () => {
    expect(getDefinitionPath(cds.services["test.app.srv.MyService"].entities["Foo"]))
      .toBe(path.join(cds.options.project, "srv/demo.cds"));
  });



  it("should support get definition location (operations)", () => {
    expect(getDefinitionPath(cds.services["test.app.srv.MyService"].operations["addFoo"]))
      .toBe(path.join(cds.options.project, "srv/demo.cds"));
  });

  it("should support get definition dir (operations)", () => {
    expect(getDefinitionBaseDir(cds.services["test.app.srv.MyService"].operations["addFoo"]))
      .toBe(path.join(cds.options.project, "srv"));
  });

  it("should support cwdRequire for target definition", () => {
    const v = cwdRequire(getDefinitionBaseDir(cds.services["test.app.srv.MyService"]), "whatever.js");
    expect(v).toBe(1);
  });

  it("should support cwdRequire with target definition shortcut", () => {
    const v = cwdRequire(cds.services["test.app.srv.MyService"], "whatever.js");
    expect(v).toBe(1);
  });


});
