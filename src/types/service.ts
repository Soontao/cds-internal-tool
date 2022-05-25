/* eslint-disable @typescript-eslint/ban-types */
import { Readable } from "stream";
import { EventContext, Request } from "./context";
import { QueryObject } from "./ql";
import { CQN, Definition, EntityDefinition, LinkedCSN, ServiceDefinition } from "./reflect";
import { TransactionMix } from "./transaction";

export type EventHook = "before" | "on" | "after"


export type EventNames = EventName | EventName[]
export type EventName = (CRUD | TX | HTTP | DRAFT | AnyEvent)
export type CRUD = "CREATE" | "READ" | "UPDATE" | "DELETE"
export type DRAFT = "NEW" | "EDIT" | "PATCH" | "SAVE"
export type HTTP = "GET" | "PUT" | "POST" | "PATCH" | "DELETE"
export type TX = "COMMIT" | "ROLLBACK"
export type AnyEvent = "*"

export type NextFunction<T = any> = () => Promise<T>;

export type OnEventHandler = <T = any>(req: Request<T>, next: NextFunction<T>) => Promise<any> | any
export type BeforeEventHandler = <T = any>(req: Request<T>) => Promise<any> | any
export type AfterEventHandler = <T = any>(data: T, req: Request<T>) => Promise<any> | any


type DefinitionContext<T extends Definition> = { [entityName: string]: T } & Iterable<T>;
type DefinitionProperty<T extends Definition> = DefinitionContext<T> & ((namespace?: string) => DefinitionContext<T>)

/**
 * cds service
 */
export declare class Service {

  kind: string;

  options: any;

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

  get(entityOrPath: Definition | string, data: any): Promise<any>;

  post(entityOrPath: Definition | string, data: any): Promise<any>;

  delete(entityOrPath: Definition | string, data: any): Promise<any>;

  patch(entityOrPath: Definition | string, data: any): Promise<any>;

  put(entityOrPath: Definition | string, data: any): Promise<any>;

  // >>> transaction

  tx(cb?: (tx: this & TransactionMix) => Promise<any>): this & TransactionMix;

  tx(context: Partial<EventContext>, cb?: (tx: this & TransactionMix) => Promise<any>): this & TransactionMix;


  // >>> query API

  run(query: CQN): Promise<any>;

  run(query: QueryObject): Promise<any>;

  run(query: any): Promise<any>;

  read(entity: Definition | string, key?: any, projection?: any): CQN;

  insert(data: any): { into: (entity: Definition | string) => CQN }

  create(entity: Definition | string, key?: any): CQN;

  update(entity: Definition | string, key?: any): CQN;

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  delete(entity: Definition | string, key?: any): CQN;

  // >>> stream

  stream(cqn: CQN): Promise<Readable>;

  stream(column: string): { from: (entity: Definition | string) => { where: (filter: any) => Readable } };

  foreach<ITEM_TYPE = any>(entity: Definition | string, args: Array<any>, cb: (each: ITEM_TYPE) => void): Promise<void>

  // >>> register handlers

  before(event: EventNames, handler: BeforeEventHandler): void;

  before(event: EventNames, entity: Entities, handler: BeforeEventHandler): void;

  on(event: EventNames, handler: OnEventHandler): void;

  on(event: EventNames, entity: Entities, handler: OnEventHandler): void;

  after(event: EventNames, handler: AfterEventHandler): void;

  after(event: EventNames, entity: Entities, handler: AfterEventHandler): void;

  /**
   * Registers a generic handler that automatically rejects incoming request with a standard error message. 
   * You can specify multiple events and entities.
   * @param event 
   * @param entity 
   */
  reject(event: EventNames, entity: Entities): void;
}


export type Entities = string | Definition | Array<Entities>

/**
 * cds application service
 */
export declare class ApplicationService extends Service {
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
