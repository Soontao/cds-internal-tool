import { expr } from "./cxn";

/* eslint-disable max-len */
export type Kind = "aspect" | "context" | "service" | "entity" | "type" | "action" | "function" | "annotation" | "element" | "action" | "function" | "event"

interface Elements {
  elements: {
    [element: string]: ElementDefinition;
  };
}

interface ActionOrFunction {
  params?: {
    [paramName: string]: {
      type: BuiltInType
    }
  },
  returns?: {
    type: BuiltInType
  }
}

export interface EventDefinition extends Definition, Elements {
  kind: "event";
  elements: {
    [element: string]: ElementDefinition;
  };
}

export interface TypeDefinition extends Definition {
  kind: "type";
  type: BuiltInType;
  length?: number;
  precision?: number,
  scale?: number,
  default?: expr;
  target?: string;
  keys?: Array<expr>;
}

export interface AspectDefinition extends Definition, Elements {
  kind: "aspect";
}

export interface ActionDefinition extends Definition, ActionOrFunction {
  kind: "action",
}

export interface FunctionDefinition extends Definition, ActionOrFunction {
  kind: "function",
}

export interface AssociationDefinition extends ElementDefinition {
  type: "cds.Association",
  target: string;
  cardinality?: {
    max: string
  },
  on?: Array<expr>;
  keys?: Array<expr>
}

/**
 * entity definition type
 */
export interface EntityDefinition extends Definition, Elements {
  kind: "entity";
  /**
   * aspects
   */
  includes: Array<string>;
  projection?: {
    from: {
      ref: Array<string>,
    }
  }

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
| "cds.LargeString"
| "cds.Association";


/**
 * element definition type
 */
export interface ElementDefinition extends Definition {
  kind: "element";
  parent: EntityDefinition;
  key: boolean;
  type: BuiltInType;
  isAssociation?: boolean;
}

export interface ServiceDefinition extends Definition {
  kind: "service";
  path: string;
  "@source"?: string;
  "@requires"?: any;
}

export interface Definition {
  kind: Kind;
  name?: string;
  localized?: boolean;
  [annotationKey: string]: any;
}

export type VarDefinition = ServiceDefinition | ActionDefinition | FunctionDefinition | AspectDefinition | TypeDefinition | EntityDefinition | EventDefinition

export declare class CSN {

  $version: string;

  definitions: {
    [key: string]: VarDefinition;
  };

  meta?: {
    creator?: string;
    flavor?: string;
  };

}
