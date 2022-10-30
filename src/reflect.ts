/* eslint-disable max-len */
import { Definition, ElementDefinition, EntityDefinition, LinkedModel } from "./types";
import { cwdRequireCDS, memorized } from "./utils";

const REP_REG = /[-_\.]/g;

type WithElements = { elements: { [key: string]: ElementDefinition } };

/**
 * ignore underscore and dot and uppercase char
 * 
 * @param n 
 * @returns 
 */
function normalizeIdentifier(n: string) { return n.replace(REP_REG, "").toLowerCase(); }

const findElement = memorized(function findElement(struct: WithElements, name: string): ElementDefinition | undefined {
  if (struct?.elements !== undefined) {
    const iName = normalizeIdentifier(name);
    for (const [elementName, elementDef] of Object.entries(struct.elements)) {
      if (normalizeIdentifier(elementName) === iName) {
        return elementDef;
      }
    }
  }
});

/**
 * find def by filter
 * 
 * @param kind 
 * @param name 
 * @param model the model, for multi-tenancy, the object should be different
 * @returns 
 */
const find = memorized(
  (
    kind: "entity" | "action" | "function" | "event" | "service",
    name: string,
    model?: LinkedModel
  ): Definition | undefined => {

    if (name.endsWith("_drafts")) {
      const def = find(kind, name.substring(0, name.length - 7), model);
      if (def !== undefined) {
        return def;
      }
    }

    const cds = cwdRequireCDS();
    model = model ?? cds.model;
    // TODO: if the model is plain CSN, convert it to LinkedCSN

    // if exact equal
    if (model.definitions[name] !== undefined && model.definitions[name].kind === kind) {
      return model.definitions[name];
    }

    const iName = normalizeIdentifier(name);
    const defs = Object.values(model.definitions).filter(def => def.kind === kind);

    // find bounded action/function
    if (kind === "action" || kind === "function") {
      const entities = Object.values(model.definitions).filter(def => def.kind === "entity") as Array<EntityDefinition>;
      for (const entity of Object.values(entities)) {
        const entityName = entity.name;
        const actions = Object.values(entity?.actions ?? []);
        for (const action of actions.filter(a => a.kind === kind)) {
          const actionName = `${entityName}.${action.name}`;
          if (iName === normalizeIdentifier(actionName)) {
            return action;
          }
        }
      }
    }


    // find with full namespace
    for (const def of defs) {
      if (iName === normalizeIdentifier(def.name)) {
        return def;
      }
    }

    // find without namespace
    for (const def of defs) {
      if (normalizeIdentifier(def.name).endsWith(iName)) {
        return def;
      }
    }

    // find bounded action/function without namespace
    if (kind === "action" || kind === "function") {
      const entities = Object.values(model.definitions).filter(def => def.kind === "entity") as Array<EntityDefinition>;
      for (const entity of Object.values(entities)) {
        const entityName = entity.name;
        const actions = Object.values(entity?.actions ?? []);
        for (const action of actions.filter(a => a.kind === kind)) {
          const actionName = `${entityName}.${action.name}`;
          if (normalizeIdentifier(actionName).endsWith(iName)) {
            return action;
          }
        }
      }
    }
  }, 3, 10240);

/**
 * fuzzy utils for cds reflection
 */
export const fuzzy = {
  /**
   * find entity in model
   * 
   * @param name 
   * @param model 
   * @returns 
   */
  findEntity(name: string, model?: LinkedModel): EntityDefinition { return find("entity", name, model) as EntityDefinition; },
  /**
   * find event in model
   * 
   * @param name 
   * @param model 
   * @returns 
   */
  findEvent(name: string, model?: LinkedModel) { return find("event", name, model); },
  /**
   * find action in model
   * @param name 
   * @param model 
   * @returns 
   */
  findAction(name: string, model?: LinkedModel) { return find("action", name, model); },
  /**
   * find function in model
   * @param name 
   * @param model 
   * @returns 
   */
  findFunction(name: string, model?: LinkedModel) { return find("function", name, model); },
  /**
   * find service in model
   * @param name 
   * @param model 
   * @returns 
   */
  findService(name: string, model?: LinkedModel) { return find("service", name, model); },
  /**
   * find entity in definition
   * 
   * @param entityDef 
   * @param name 
   * @returns 
   */
  findElement: findElement
};


