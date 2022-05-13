import { EntityDefinition, LinkedCSN } from "./types";
import { last } from "./utils";

const REP_REG = /[-_\.]/g;

/**
 * ignore underscore and dot and uppercase char
 * 
 * @param n 
 * @returns 
 */
function normalizeIdentifier(n: string) { return n.replace(REP_REG, "").toLowerCase(); }

export const fuzzy = {
  findEntity(model: LinkedCSN, name: string) {
    const iName = normalizeIdentifier(name);
    const entities = Object.values(model.entities());
    // find with full namespace
    for (const entity of entities) {
      if (iName === normalizeIdentifier(entity.name)) {
        return entity;
      }
    }
    // find without namespace
    for (const entity of entities) {
      const entityNameParts = entity.name.split(".");
      if (iName === normalizeIdentifier(last(entityNameParts) as string)) {
        return entity;
      }
    }
  },
  findElement(def: EntityDefinition, name: string) {
    const iName = normalizeIdentifier(name);
    for (const elementName of Object.keys(def.elements)) {
      if (normalizeIdentifier(elementName) === iName) {
        return def.elements[elementName];
      }
    }
  }
};

export default fuzzy;



