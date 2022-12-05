/* eslint-disable max-len */
export type Kind = "aspect" | "context" | "service" | "entity" | "type" | "action" | "function" | "annotation" | "element" | "action"

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
  name?: string;
  localized?: boolean;
  [annotationKey: string]: any;
}

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
