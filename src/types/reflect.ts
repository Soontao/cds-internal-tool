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
  associations?: { [elementName: string]: AssociationDefinition };
  compositions?: { [elementName: string]: AssociationDefinition };
  elements: { [elementName: string]: ElementDefinition };
  keys: { [elementName: string]: ElementDefinition };
}

/**
 * element definition type
 */
export interface ElementDefinition extends Definition {
  parent: EntityDefinition;
  key: boolean;
  isAssociation?: boolean;
}

export interface Definition {
  kind: string;
  type: string;
  name: string;
  localized?: boolean;
  [annotationKey: string]: any;
}

export type CXN = any;

export type CSN = any;

/**
 * CQN query type
 */
export type CQN = {
  SELECT: any,
  INSERT: any,
  UPDATE: any,
  DELETE: any,
}

export interface LinkedCSN {

  $version: string;
  definitions: {
    [key: string]: Definition;
  };
  exports: (ns: string) => any;
  kind: "type";
  meta?: {
    creator?: string;
    flavor?: string;
  };
}
