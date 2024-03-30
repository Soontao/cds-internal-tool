/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-types */
import type { Readable } from "stream";
import { EventContext, Request } from "./context";
import { CSN, Definition, EntityDefinition, EventDefinition, ServiceDefinition } from "./csn";
import { QueryObject } from "./ql";
import { CQN, Linked, LinkedCSN, LinkedEntityDefinition, VarLinkedDefinitions } from "./reflect";
import { TransactionMix } from "./transaction";

export type EventHook = "before" | "on" | "after"

export type EventNames<T = EventName> = T | T[]
/**
 * event with extended event
 */
export type ExtendEventName<T> = EventName | T
/**
 * standard events
 */
export type EventName = (CRUD | TX | HTTP | DRAFT | AnyEvent)
export type CRUD = "CREATE" | "READ" | "UPDATE" | "DELETE"
export type DRAFT = "NEW" | "EDIT" | "PATCH" | "SAVE"
export type HTTP = "GET" | "PUT" | "POST" | "PATCH" | "DELETE"
export type TX = "COMMIT" | "ROLLBACK"
export type AnyEvent = "*"

export type NextFunction<T = any> = () => Promise<T>;

export interface OnEventHandler<THIS, DATA_TYPE, RETURN_TYPE> {
  (this: THIS, req: Request<DATA_TYPE>, next: NextFunction<any>): Promise<RETURN_TYPE | any | void> | any | void
}
export interface BeforeEventHandler<THIS, DATA_TYPE> {
  (this: THIS, req: Request<DATA_TYPE>): Promise<any | void> | any | void;
}
export interface AfterEventHandler<THIS, DATA_TYPE> {
  (this: THIS, data: DATA_TYPE, req: Request<any>): Promise<DATA_TYPE | any | void> | any | void;
}

type DefinitionContext<T extends Definition> = { [entityName: string]: T } & Iterable<T>;
type DefinitionProperty<T extends Definition> = DefinitionContext<T> & ((namespace?: string) => DefinitionContext<T>)

export interface ServiceImplFunc {
  (this: Service, srv: Service): any
}

export interface DefaultServiceOptions {
  kind: String
  impl: String | ServiceImplFunc
}

export type DefaultMixinMethod = (...args: any[]) => Promise<any>

export type MixinMethods<E extends string | number | symbol, M = DefaultMixinMethod> = {
  [key in E]: M
}

/**
 * service with wrapped functions
 */
export type MixedService<E extends string | number | symbol, S extends Service> = S & MixinMethods<E>

/**
 * cds service
 */
export declare class Service<E = EventName, O = DefaultServiceOptions> {

  constructor(
    name?: String,
    model?: CSN,
    options?: O
  )

  kind: string;

  options: O;

  /**
   * The service’s name, that means, the definition’s name for services constructed with cds.serve, or the name of required services as passed to cds.connect.
   */
  name: string;

  /**
   * The linked model from which this service’s definition was loaded.
   * This is === cds.model by default, that is, unless you created services yourself with cds.serve, specifying alternative models to load and construct new services from.
   */
  model: LinkedCSN;

  get definition(): Linked<ServiceDefinition>;

  get namespace(): string;

  /**
   * The init() method acts like a parameter-less constructor. 
   * Ensure to call await super.init() as in the previous example, to have the base class’s handlers added.
   */
  init(): Promise<any>

  // >>> metadata

  get entities(): DefinitionProperty<LinkedEntityDefinition>;

  get events(): DefinitionProperty<Linked<EventDefinition>>;

  get operations(): DefinitionProperty<VarLinkedDefinitions>;

  /**
   * Use srv.prepend in order to register handlers, which shall be executed before already registered handlers. In particular, this can be used to override handlers from reused services as in cap/samples/bookstore/srv/mashup.js:
   * For example, the following would register a handler for inserting Orders that runs instead of the default handlers of the connected database service.
   * 
   * @see [srv.prepend](https://cap.cloud.sap/docs/node.js/services#srv-prepend)
   * @param cb 
   */
  prepend(cb: (srv: this) => void): void;

  emit(payload: { event: string, data?: any, headers?: any }): Promise<this>;

  emit(event: string, data?: any, headers?: any): Promise<this>;

  // >>> rest operations

  send(method: string, path: string, data?: any, headers?: any): Promise<any>;

  send(
    param: {
      method?: string,
      path?: string,
      query?: QueryObject,
      event?: string,
      data?: any,
      headers?: any
    }
  ): Promise<any>;

  get(entityOrPath: Definition | string, data: any): Promise<any>;

  post(entityOrPath: Definition | string, data: any): Promise<any>;

  delete(entityOrPath: Definition | string, data: any): Promise<any>;

  patch(entityOrPath: Definition | string, data: any): Promise<any>;

  put(entityOrPath: Definition | string, data: any): Promise<any>;

  // >>> transaction

  tx<T = any>(cb?: (tx: this & TransactionMix) => Promise<T>): this & TransactionMix & Promise<T>;

  tx<T = any>(
    context: Partial<EventContext>,
    cb?: (tx: this & TransactionMix) => Promise<T>
  ): this & TransactionMix & Promise<T>;

  // >>> query API

  run(query: CQN | QueryObject | string | Array<CQN | QueryObject | string>): Promise<any>;

  run(query: any): Promise<any>;

  read(entity: EntityDefinition | string, key?: any, projection?: any): QueryObject;

  insert(data: any): { into: (entity: EntityDefinition | string) => QueryObject }

  create(entity: EntityDefinition | string, key?: any): QueryObject;

  update(entity: EntityDefinition | string, key?: any): QueryObject;

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  delete(entity: EntityDefinition | string, key?: any): QueryObject;

  // >>> stream

  stream(cqn: CQN): Promise<Readable>;

  stream(column: string): { from: (entity: EntityDefinition | string) => { where: (filter: any) => Readable } };

  foreach<ITEM_TYPE = any>(entityOrQuery: EntityDefinition | string | QueryObject | CQN, cb: (each: ITEM_TYPE) => void): Promise<void>

  foreach<ITEM_TYPE = any>(entityOrQuery: EntityDefinition | string | QueryObject | CQN, args: Array<any>, cb: (each: ITEM_TYPE) => void): Promise<void>


  // >>> register handlers

  before<DATA_TYPE = any>(event: EventNames<E>, handler: BeforeEventHandler<this, DATA_TYPE>): void;

  before<DATA_TYPE = any>(event: EventNames<E>, entity: Entities, handler: BeforeEventHandler<this, DATA_TYPE>): void;

  on<DATA_TYPE = any, RETURN_TYPE = any>(event: EventNames<E>, handler: OnEventHandler<this, DATA_TYPE, RETURN_TYPE>): void;

  on<DATA_TYPE = any, RETURN_TYPE = any>(event: EventNames<E>, entity: Entities, handler: OnEventHandler<this, DATA_TYPE, RETURN_TYPE>): void;

  after<DATA_TYPE = any>(event: EventNames<E>, handler: AfterEventHandler<this, DATA_TYPE>): void;

  after<DATA_TYPE = any>(event: EventNames<E>, entity: Entities, handler: AfterEventHandler<this, DATA_TYPE>): void;

  /**
   * Registers a generic handler that automatically rejects incoming request with a standard error message. 
   * You can specify multiple events and entities.
   * 
   * @param event 
   * @param entity 
   */
  reject(event: EventNames<E>, entity: Entities): void;
}


export type Entities = string | Definition | Array<Entities>

/**
 * cds application service
 */
export declare class ApplicationService<E = any, O = any> extends Service<E, O> {

  kind: "app-service";

  with(serviceImpl: any): any

  impl(serviceImpl: any): any

}

/**
 * cds database service
 */
export declare class DatabaseService extends Service {

  begin(): Promise<this>;

  commit(): Promise<void>

  rollback(): Promise<void>

  stream(query: any): any

}

export declare class RemoteService extends Service { }

export declare class OutboxService extends Service { }

export declare class AuditLogService extends OutboxService { }

export declare class MessagingService extends OutboxService { }

export type ModelProviderServiceEvents = ExtendEventName<"getCsn" | "getEdmx" | "isExtended" | "getExtensions" | "getResources">
export declare class cds_xt_ModelProviderService extends ApplicationService<ModelProviderServiceEvents> { }

export type ExtensibilityServiceEvents = ExtendEventName<"add" | "promote" | "base" | "push">
export declare class cds_xt_ExtensibilityService extends ApplicationService<ExtensibilityServiceEvents> { }

export type DeploymentServiceEvents = ExtendEventName<"subscribe" | "upgrade" | "unsubscribe" | "deploy" | "upgrade" | "extend" | "getTables" | "getColumns" | "getTenants" | "getContainers">
export declare class cds_xt_DeploymentService extends ApplicationService<DeploymentServiceEvents> { }

export type SaasProvisioningServiceEvents = ExtendEventName<"upgrade">
export declare class cds_xt_SaasProvisioningService extends ApplicationService<SaasProvisioningServiceEvents> { }

export interface BuiltInServices {
  db: DatabaseService,
  "cds.xt.SaasProvisioningService": MixedService<Exclude<SaasProvisioningServiceEvents, EventName>, cds_xt_SaasProvisioningService>,
  "cds.xt.DeploymentService": MixedService<Exclude<DeploymentServiceEvents, EventName>, cds_xt_DeploymentService>,
  "cds.xt.ExtensibilityService": MixedService<Exclude<ExtensibilityServiceEvents, EventName>, cds_xt_ExtensibilityService>,
  "cds.xt.ModelProviderService": MixedService<Exclude<ModelProviderServiceEvents, EventName>, cds_xt_ModelProviderService>,
  "messaging": MessagingService,
  "audit-log-service": AuditLogService,
}

