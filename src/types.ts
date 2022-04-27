/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/ban-types */
import type { AxiosInstance } from "axios";
import type EventEmitter from "events";
import type { Readable } from "stream";

// TODO: minimal CAP abstract type definition

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

type LogFunction = (...messages: Array<any>) => void

export interface Logger {
  trace: LogFunction;
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
}

export declare class User { }

export declare class EventContext {
  id: string;

  user: User;

  tenant: string;

  locale: string;

  timestamp: Date;

  on(event: string, cb: Function): void
}

export declare class Event<DATA = any> extends EventContext {
  event: string;

  data: DATA;

  headers: import("http").IncomingHttpHeaders;

}

type RequestMessage = string | object | Error

interface RequestMessageParam {
  code?: number;
  status?: number;
  statusCode?: number;
  message: RequestMessage;
  target?: string;
  args?: Array<any>;
}

export declare class Request<DATA = any> extends Event<DATA> {
  _: {
    req: import("express").Request;
    res: import("express").Response;
  };

  method: string;

  target: Definition;

  /**
   * Captures the full cannibalized path information of incoming requests with navigation. '
   * If requests without navigation, req.path is identical to req.target.name (or req.entity, which is a shortcut for that).
   */
  path: string;

  entity: string;

  params: Iterable<any>;

  query: CQN;

  reply(results: any): void;

  reject(msg: string, target?: any, args?: Array<any>): void

  reject(code: number, msg: string, target?: any, args?: Array<any>): void

  notify(param: RequestMessageParam): void;

  notify(msg: string, target?: any, args?: Array<any>): void;

  notify(code: null, msg: string, target?: any, args?: Array<any>): void;

  info(param: RequestMessageParam): void;

  info(msg: string, target?: any, args?: Array<any>): void;

  info(code: null, msg: string, target?: any, args?: Array<any>): void;

  warn(param: RequestMessageParam): void;

  warn(msg: string, target?: any, args?: Array<any>): void;

  warn(code: null, msg: string, target?: any, args?: Array<any>): void;

  error(param: RequestMessageParam): void;

  error(msg: string, target?: any, args?: Array<any>): void;

  error(code: null, msg: string, target?: any, args?: Array<any>): void;

  /**
   * 
   * Use this asynchronous method to calculate the difference between the data on the database and the passed data (defaults to req.data, if not passed).
   * **This will trigger database requests.**
   * 
   * @param data 
   */
  diff(data?: any): Promise<any>
}

export interface TransactionMix {
  context: EventContext;
  commit(res?: any): Promise<any>;
  rollback(err?: Error): Promise<Error>;
}


/**
 * cds service
 */
export declare class Service {
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

  definition: Definition;

  namespace: string;

  /**
   * The init() method acts like a parameter-less constructor. 
   * Ensure to call await super.init() as in the previous example, to have the base class’s handlers added.
   */
  init(): Promise<any>

  // >>> metadata

  entities(namespace?: string): { [entityName: string]: EntityDefinition };

  events(namespace?: string): { [eventName: string]: Definition };

  operations(namespace?: string): { [operationName: string]: Definition };

  /**
   * Use srv.prepend in order to register handlers, which shall be executed before already registered handlers. In particular, this can be used to override handlers from reused services as in cap/samples/bookstore/srv/mashup.js:
   * For example, the following would register a handler for inserting Orders that runs instead of the default handlers of the connected database service.
   * 
   * @see [srv.prepend](https://cap.cloud.sap/docs/node.js/services#srv-prepend)
   * @param cb 
   */
  prepend(cb: (srv: this) => void): void;

  emit(payload: { event: string, data?: any, headers?: any }): void;

  emit(event: string, data?: any, headers?: any): void;

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

  read(entity: Definition | string, key?: any, projection?: any): CQN;

  insert(data: any): { into: (entity: Definition | string) => CQN }

  create(entity: Definition | string, key?: any): CQN;

  update(entity: Definition | string, key?: any): CQN;

  delete(entity: Definition | string, key?: any): CQN;

  // >>> stream

  stream(cqn: CQN): Promise<Readable>;

  stream(column: string): { from: (entity: Definition | string) => { where: (filter: any) => Readable } };

  foreach<ITEM_TYPE = any>(entity: Definition | string, args: Array<any>, cb: (each: ITEM_TYPE) => void): Promise<void>

  // >>> register handlers

  before(cb: Function): void;

  before(event: Events, cb: Function): void;

  before(event: Events, entity: Entities, cb: Function): void;

  on(cb: Function): void;

  on(event: Events, cb: Function): void;

  on(event: Events, entity: Entities, cb: Function): void;

  after(cb: Function): void;

  after(event: Events, cb: Function): void;

  after(event: Events, entity: Entities, cb: Function): void;

  /**
   * Registers a generic handler that automatically rejects incoming request with a standard error message. 
   * You can specify multiple events and entities.
   * @param event 
   * @param entity 
   */
  reject(event: Events, entity: Entities): void;
}

export type Events = string | Array<Event>

export type Entities = string | Definition | Array<Entities>

/**
 * cds application service
 */
export declare class ApplicationService extends Service {
  begin(): this;
}
/**
 * cds database service
 */
export declare class DatabaseService extends Service { }



type Methods = "get" | "post" | "patch" | "delete" | "put";

export interface TestFacade extends Pick<AxiosInstance, Methods> {
  axios: AxiosInstance
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

export interface CDS extends Pick<Service, "run" | "read" | "create" | "update" | "delete" | "insert"> {
  version: string;
  home: string;
  env: any;
  requires: any;
  app: import("express").Application;
  services: { [serviceName: string]: Service };


  Event: typeof Event;
  Service: typeof Service;
  ApplicationService: typeof ApplicationService;
  Request: typeof Request

  db: DatabaseService;

  once(event: "bootstrap", cb: (app: import("express").Application) => any): void;
  once(event: "served", cb: (services: Array<Service>) => any): void;
  once(event: "listening", cb: (info: { server: import("http").Server, url: string }) => any): void;

  on(event: "loaded", cb: (csn: LinkedCSN) => any): void;
  on(event: "serving", cb: (service: Service) => any): void;
  on(event: "connect", cb: (service: Service) => any): void;
  on(event: "subscribe", cb: (service: Service, event: string) => any): void;


  log(module: string): Logger;

  connect: {
    to: (...args: Array<any>) => Promise<Service>;
  };

  serve(service: string, options: any): any;

  model: LinkedCSN;

  reflect(csn: CSN): LinkedCSN;

  test(project: string): { in: (...path: Array<string>) => TestFacade };

  ql: {
    SELECT: any;
    INSERT: any;
    UPDATE: any;
    DELETE: any;
  };
  /**
   * Reference to the current root event or request, which acts as invocation context, providing access to the current tenant and user information, and also constitutes the transaction boundary for automatically managed transactions.
   */
  context: EventContext;
  server: (options: any) => any;
  utils: {
    /**
     * generates a new v4 UUID
     */
    uuid: () => string
  };
  compile: Function & {
    for: {
      odata(csn: any, options: any): any;
    }
    to: {
      json(csn: CSN): any;
      yaml(csn: CSN): any;
      edm(csn: CSN, options: any): any;
      edmx(csn: CSN, options: any): any;
      hdbtable(csn: CSN): any;
      hdbcds(csn: CSN): any;
      sql(csn: CSN, options: any): any;
    }
  };
  parse: {
    cdl(cdl: string): CSN;
    cql(cql: string): CQN;
    xpr(cxl: string): CXN;
    ref(cxl: string): any;
  };
  load(files: string): CSN;
  load(files: Array<string>): CSN;
  /**
   * @see [cds.resolve](https://pages.github.tools.sap/cap/docs/node.js/cds-compile#cds-resolve)
   * @param paths 
   */
  resolve(paths: Array<string>): Array<string>;

  tx: DatabaseService["tx"];

  /**
   * Runs the given function as detached continuation in a specified event context (not inheriting from the current one). 
   * Options every or after allow to run the function repeatedly or deferred. 
   * @param context 
   * @param cb 
   */
  spawn(
    context: Partial<EventContext> & { every?: number, after?: number },
    cb: (tx: TransactionMix) => Promise<any>
  ): EventEmitter;
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
