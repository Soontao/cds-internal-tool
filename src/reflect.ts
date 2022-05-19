/* eslint-disable max-len */
import { EntityDefinition, LinkedModel } from "./types";
import { cwdRequireCDS, memorized } from "./utils";

const REP_REG = /[-_\.]/g;

/**
 * ignore underscore and dot and uppercase char
 * 
 * @param n 
 * @returns 
 */
function normalizeIdentifier(n: string) { return n.replace(REP_REG, "").toLowerCase(); }

const find = memorized.hyper((
  kind: "entity" | "action" | "function" | "event" | "service",
  name: string,
  model?: LinkedModel
) => {
  model = model ?? cwdRequireCDS().model;

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
}, 3);

/**
 * fuzzy utils for cds reflection
 */
export const fuzzy = {
  findEntity(name: string, model?: LinkedModel): EntityDefinition { return find("entity", name, model) as EntityDefinition; },
  findEvent(name: string, model?: LinkedModel) { return find("event", name, model); },
  findAction(name: string, model?: LinkedModel) { return find("action", name, model); },
  findFunction(name: string, model?: LinkedModel) { return find("function", name, model); },
  findService(name: string, model?: LinkedModel) { return find("service", name, model); },
  findElement(def: EntityDefinition, name: string) {
    const iName = normalizeIdentifier(name);
    for (const elementName of Object.keys(def.elements)) {
      if (normalizeIdentifier(elementName) === iName) {
        return def.elements[elementName];
      }
    }
  }
};



