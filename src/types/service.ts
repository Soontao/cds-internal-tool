/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-types */
import { Readable } from "stream";
import { EventContext, Request } from "./context";
import { QueryObject } from "./ql";
import { CQN, CSN, Definition, EntityDefinition, LinkedCSN, ServiceDefinition } from "./reflect";
import { TransactionMix } from "./transaction";

export type EventHook = "before" | "on" | "after"

export type ExtendedEventNames<T> = EventName | T | (EventName | T)[]
export type EventNames = EventName | EventName[]
export type EventName = (CRUD | TX | HTTP | DRAFT | AnyEvent)
export type CRUD = "CREATE" | "READ" | "UPDATE" | "DELETE"
export type DRAFT = "NEW" | "EDIT" | "PATCH" | "SAVE"
export type HTTP = "GET" | "PUT" | "POST" | "PATCH" | "DELETE"
export type TX = "COMMIT" | "ROLLBACK"
export type AnyEvent = "*"

export type NextFunction<T = any> = () => Promise<T>;

export type OnEventHandler<THIS> = <T = any>(this: THIS, req: Request<T>, next: NextFunction<T>) => Promise<any> | any
export type BeforeEventHandler<THIS> = <T = any>(this: THIS, req: Request<T>) => Promise<any> | any
export type AfterEventHandler<THIS> = <T = any>(this: THIS, data: T, req: Request<T>) => Promise<any> | any


type DefinitionContext<T extends Definition> = { [entityName: string]: T } & Iterable<T>;
type DefinitionProperty<T extends Definition> = DefinitionContext<T> & ((namespace?: string) => DefinitionContext<T>)

export interface ServiceImplFunc {
  (this: Service, srv: Service): any
}

export interface DefaultServiceOptions {
  kind: String
  impl: String | ServiceImplFunc
}

/**
 * cds service
 */
export declare class Service<E = any, O = DefaultServiceOptions> {

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

  definition: ServiceDefinition;

  namespace: string;

  /**
   * The init() method acts like a parameter-less constructor. 
   * Ensure to call await super.init() as in the previous example, to have the base class’s handlers added.
   */
  init(): Promise<any>

  // >>> metadata

  entities: DefinitionProperty<EntityDefinition>;

  events: DefinitionProperty<Definition>;

  operations: DefinitionProperty<Definition>;

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

  run(query: CQN): Promise<any>;

  run(query: QueryObject): Promise<any>;

  run(query: string): Promise<any>;

  run(query: any): Promise<any>;

  read(entity: Definition | string, key?: any, projection?: any): QueryObject;

  insert(data: any): { into: (entity: Definition | string) => QueryObject }

  create(entity: Definition | string, key?: any): QueryObject;

  update(entity: Definition | string, key?: any): QueryObject;

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  delete(entity: Definition | string, key?: any): QueryObject;

  // >>> stream

  stream(cqn: CQN): Promise<Readable>;

  stream(column: string): { from: (entity: Definition | string) => { where: (filter: any) => Readable } };

  foreach<ITEM_TYPE = any>(entityOrQuery: Definition | string | QueryObject, cb: (each: ITEM_TYPE) => void): Promise<void>

  foreach<ITEM_TYPE = any>(entityOrQuery: Definition | string | QueryObject, args: Array<any>, cb: (each: ITEM_TYPE) => void): Promise<void>


  // >>> register handlers

  before(event: ExtendedEventNames<E>, handler: BeforeEventHandler<this>): void;

  before(event: ExtendedEventNames<E>, entity: Entities, handler: BeforeEventHandler<this>): void;

  on(event: ExtendedEventNames<E>, handler: OnEventHandler<this>): void;

  on(event: ExtendedEventNames<E>, entity: Entities, handler: OnEventHandler<this>): void;

  after(event: ExtendedEventNames<E>, handler: AfterEventHandler<this>): void;

  after(event: ExtendedEventNames<E>, entity: Entities, handler: AfterEventHandler<this>): void;

  /**
   * Registers a generic handler that automatically rejects incoming request with a standard error message. 
   * You can specify multiple events and entities.
   * 
   * @param event 
   * @param entity 
   */
  reject(event: ExtendedEventNames<E>, entity: Entities): void;
}


export type Entities = string | Definition | Array<Entities>

/**
 * cds application service
 */
export declare class ApplicationService<E = any, O = any> extends Service<E, O> {
  kind: "app-service";

  begin(): this;
}

/**
 * cds database service
 */
export declare class DatabaseService extends Service { }

export declare class RemoteService extends Service { }

export declare class OutboxService extends Service { }

export declare class AuditLogService extends OutboxService { }

export declare class MessagingService extends OutboxService { }

export declare class cds_xt_ModelProviderService extends ApplicationService<"getCsn" | "getEdmx" | "isExtended" | "getExtensions" | "getResources"> { }
export declare class cds_xt_ExtensibilityService extends ApplicationService<"add" | "promote" | "base" | "push"> { }
export declare class cds_xt_DeploymentService extends ApplicationService<"subscribe" | "upgrade" | "unsubscribe"|"deploy"|"upgrade"| "extend"> { }
export declare class cds_xt_SaasProvisioningService extends ApplicationService<"upgrade"> { }

export interface BuiltInServices {
  db: DatabaseService,
  "cds.xt.SaasProvisioningService": cds_xt_SaasProvisioningService,
  "cds.xt.DeploymentService": cds_xt_DeploymentService,
  "cds.xt.ExtensibilityService": cds_xt_ExtensibilityService,
  "cds.xt.ModelProviderService": cds_xt_ModelProviderService,
  "messaging": MessagingService,
  "audit-log-service": AuditLogService,
}
