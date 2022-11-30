/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/indent */
import { builtin } from "./builtin";
import { expr } from "./cxn";

export type Kind = "aspect" | "context" | "service" | "entity" | "type" | "action" | "function" | "annotation" | "element"

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

export type BuiltInType = "cds.Binary"
  | "cds.Boolean"
  | "cds.String"
  | "cds.Integer"
  | "cds.UUID"
  | "cds.Decimal"
  | "cds.Date"
  | "cds.Time"
  | "cds.DateTime"
  | "cds.TimeStamp"
  | "cds.Binary"
  | "cds.LargeBinary"
  | "cds.LargeString";

/**
 * element definition type
 */
export interface ElementDefinition extends Definition {
  kind: "element";
  parent: EntityDefinition;
  key: boolean;
  isAssociation?: boolean;
  type: BuiltInType | string;
}

export interface ServiceDefinition extends Definition {
  kind: "service"
  path: string;
  ["@source"]: string
}

export interface Definition {
  kind: Kind;
  type: string;
  name: string;
  localized?: boolean;
  [annotationKey: string]: any;
}

export type CXN = expr;

export declare class CSN {

  $version: string;

  definitions: {
    [key: string]: Definition;
  };



  meta?: {
    creator?: string;
    flavor?: string;
  };

}

export { CQN } from "./cqn";

type FilterFunction = (def: Definition) => boolean;
type FilterValue = Kind | FilterFunction | builtin["classes"][keyof builtin["classes"]]

export declare class LinkedCSN extends CSN {
  
  kind: "type";

  exports(ns: string): any;

  entities(ns?: string): { [key: string]: EntityDefinition };

  events(ns?: string): { [key: string]: Definition };

  operations(ns?: string): { [key: string]: Definition };

  each(x?: FilterValue, defs?: typeof this.definitions): Iterator<Definition>;

  all(x?: FilterValue, defs?: typeof this.definitions): Iterator<Definition>;

  find(x: FilterValue, defs?: typeof this.definitions): Definition | undefined;

  foreach(x: FilterValue, visitor: (def: Definition) => void, defs?: typeof this.definitions): Definition | undefined;

  forall(x: FilterValue, visitor: (def: Definition) => void, defs?: typeof this.definitions): Definition | undefined;

  forall(visitor: (def: Definition) => void, defs?: typeof this.definitions): Definition | undefined;

  services: { [key: string]: ServiceDefinition };

}

export type LinkedModel = LinkedCSN
