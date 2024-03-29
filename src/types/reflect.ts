/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/indent */
import { builtin } from "./builtin";
import { ActionDefinition, AspectDefinition, AssociationDefinition, CSN, ElementDefinition, EntityDefinition, EventDefinition, FunctionDefinition, Kind, ServiceDefinition, TypeDefinition, VarDefinition } from "./csn";
import { expr } from "./cxn";

export { CQN } from "./cqn";
export { CSN };

export type Linked<T> = T & { name: string }

export type LinkedEntityDefinition = Linked<EntityDefinition> & {
  keys?: LinkedDefs<ElementDefinition>;
  actions?: LinkedDefs<ActionDefinition>;
  associations?: LinkedDefs<AssociationDefinition>;
  compositions?: LinkedDefs<AssociationDefinition>;
}

export type Defs<T> = { [defName: string]: T }
export type LinkedDefs<T> = { [defName: string]: Linked<T> }

export type CXN = expr;

export type VarLinkedDefinitions = LinkedEntityDefinition | Linked<ServiceDefinition> | Linked<ActionDefinition> | Linked<AspectDefinition> | Linked<TypeDefinition> | Linked<FunctionDefinition> | Linked<EventDefinition>;

type FilterFunction = (def: Linked<VarDefinition>) => boolean;
type FilterValue = Kind | FilterFunction | builtin["classes"][keyof builtin["classes"]]

export declare class LinkedCSN extends CSN {

  kind: "type";

  definitions: Defs<VarLinkedDefinitions>;

  /**
   * This is a getter property providing convenient and cached access to all service definitions in a model.
   */
  get services(): LinkedDefs<ServiceDefinition>;

  exports?(ns: string): any;

  entities(ns?: string): Defs<LinkedEntityDefinition>;

  events(ns?: string): LinkedDefs<EventDefinition>;

  operations(ns?: string): Defs<VarLinkedDefinitions>;

  each(x?: "entity", defs?: Defs<VarLinkedDefinitions>): IterableIterator<LinkedEntityDefinition>;

  each(x?: "service", defs?: Defs<VarLinkedDefinitions>): IterableIterator<Linked<ServiceDefinition>>;

  each(x?: FilterValue, defs?: Defs<VarLinkedDefinitions>): IterableIterator<VarLinkedDefinitions>;

  all(x?: FilterValue, defs?: Defs<VarLinkedDefinitions>): Array<VarLinkedDefinitions>;

  find(x: FilterValue, defs?: Defs<VarLinkedDefinitions>): VarLinkedDefinitions | undefined;

  foreach(x: FilterValue, visitor: (def: VarLinkedDefinitions) => void, defs?: Defs<VarLinkedDefinitions>): void;

  forall(x: FilterValue, visitor: (def: VarLinkedDefinitions) => void, defs?: Defs<VarLinkedDefinitions>): void;

  forall(visitor: (def: VarLinkedDefinitions) => void, defs?: Defs<VarLinkedDefinitions>): void;


}

export type LinkedModel = LinkedCSN
