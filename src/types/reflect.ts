/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/indent */
import { builtin } from "./builtin";
import { ActionDefinition, AspectDefinition, AssociationDefinition, CSN, Definition, EntityDefinition, EventDefinition, FunctionDefinition, Kind, ServiceDefinition, TypeDefinition, VarDefinition } from "./csn";
import { expr } from "./cxn";

export { CQN } from "./cqn";
export { CSN };

export type Linked<T extends Definition> = T & { name: string }

export type LinkedEntityDefinition = Linked<EntityDefinition> & {
  actions?: { [key: string]: Linked<ActionDefinition> };
  associations?: { [elementName: string]: Linked<AssociationDefinition> };
  compositions?: { [elementName: string]: Linked<AssociationDefinition> };
}

export type CXN = expr;

export type VarLinkedDefinitions = LinkedEntityDefinition | Linked<ServiceDefinition> | Linked<ActionDefinition> | Linked<AspectDefinition> | Linked<TypeDefinition> | Linked<FunctionDefinition> | Linked<EventDefinition>;

type FilterFunction = (def: Linked<VarDefinition>) => boolean;
type FilterValue = Kind | FilterFunction | builtin["classes"][keyof builtin["classes"]]

export declare class LinkedCSN extends CSN {

  kind: "type";

  definitions: {
    [key: string]: VarLinkedDefinitions;
  };

  exports(ns: string): any;

  entities(ns?: string): { [key: string]: LinkedEntityDefinition };

  events(ns?: string): { [key: string]: Linked<Definition> };

  operations(ns?: string): { [key: string]: Linked<Definition> };

  each(x?: FilterValue, defs?: typeof this.definitions): Iterator<Linked<Definition>>;

  all(x?: FilterValue, defs?: typeof this.definitions): Iterator<Linked<Definition>>;

  find(x: FilterValue, defs?: typeof this.definitions): Linked<Definition> | undefined;

  foreach(x: FilterValue, visitor: (def: Linked<Definition>) => void, defs?: typeof this.definitions): Linked<Definition> | undefined;

  forall(x: FilterValue, visitor: (def: Linked<Definition>) => void, defs?: typeof this.definitions): Linked<Definition> | undefined;

  forall(visitor: (def: Linked<Definition>) => void, defs?: typeof this.definitions): Linked<Definition> | undefined;

  services: { [key: string]: Linked<ServiceDefinition> };

}

export type LinkedModel = LinkedCSN
