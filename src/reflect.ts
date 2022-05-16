import { EntityDefinition } from "./types";
import { cwdRequireCDS } from "./utils";

const REP_REG = /[-_\.]/g;

/**
 * ignore underscore and dot and uppercase char
 * 
 * @param n 
 * @returns 
 */
function normalizeIdentifier(n: string) { return n.replace(REP_REG, "").toLowerCase(); }

function find(type: "entity" | "action" | "function" | "event" | "service", name: string) {
  const { model } = cwdRequireCDS();
  const iName = normalizeIdentifier(name);
  const defs = Object.values(model.definitions).filter(def => def.kind === type);

  // find bounded action/function
  if (type === "action" || type === "function") {
    const entities = Object.values(model.definitions).filter(def => def.kind === "entity") as Array<EntityDefinition>;
    for (const entity of Object.values(entities)) {
      const entityName = entity.name;
      const actions = Object.values(entity?.actions ?? []);
      for (const action of actions.filter(a => a.kind === type)) {
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
  if (type === "action" || type === "function") {
    const entities = Object.values(model.definitions).filter(def => def.kind === "entity") as Array<EntityDefinition>;
    for (const entity of Object.values(entities)) {
      const entityName = entity.name;
      const actions = Object.values(entity?.actions ?? []);
      for (const action of actions.filter(a => a.kind === type)) {
        const actionName = `${entityName}.${action.name}`;
        if (normalizeIdentifier(actionName).endsWith(iName)) {
          return action;
        }
      }
    }
  }

}

/**
 * fuzzy utils for cds reflection
 */
export const fuzzy = {
  findEntity(name: string): EntityDefinition { return find("entity", name) as EntityDefinition; },
  findEvent(name: string) { return find("event", name); },
  findAction(name: string) { return find("action", name); },
  findFunction(name: string) { return find("function", name); },
  findService(name: string) { return find("service", name); },
  findElement(def: EntityDefinition, name: string) {
    const iName = normalizeIdentifier(name);
    for (const elementName of Object.keys(def.elements)) {
      if (normalizeIdentifier(elementName) === iName) {
        return def.elements[elementName];
      }
    }
  }
};



