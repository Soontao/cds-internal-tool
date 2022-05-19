import { expr } from "./cxn";

export interface AssociationDefinition extends Definition {
  target: string;
  _target: EntityDefinition;
  is2one: boolean;
  is2many: boolean;
}

/**
 * entity definition type
 */
export interface EntityDefinition extends Definition {
  kind: "entity";
  /**
   * aspects
   */
  includes: Array<string>;
  actions: { [key: string]: Definition };
  associations?: { [elementName: string]: AssociationDefinition };
  compositions?: { [elementName: string]: AssociationDefinition };
  elements: { [elementName: string]: ElementDefinition };
  keys: { [elementName: string]: ElementDefinition };
}

/**
 * element definition type
 */
export interface ElementDefinition extends Definition {

  kind: "element";
  parent: EntityDefinition;
  key: boolean;
  isAssociation?: boolean;
}

export interface ServiceDefinition extends Definition {
  kind: "service"
  path: string;
  ["@source"]: string
}

export interface Definition {
  kind: string;
  type: string;
  name: string;
  localized?: boolean;
  [annotationKey: string]: any;
}

export type CXN = expr;

export type CSN = any;

export { CQN } from "./cqn";

export declare class LinkedCSN {

  $version: string;

  definitions: {
    [key: string]: Definition;
  };

  kind: "type";

  meta?: {
    creator?: string;
    flavor?: string;
  };
  
  exports(ns: string): any;

  entities(ns?: string): { [key: string]: EntityDefinition };

}

export type LinkedModel = LinkedCSN
