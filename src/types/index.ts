/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/ban-types */

// TODO: minimal CAP abstract type definition

import type EventEmitter from "events";
import { User } from "./auth";
import { builtin } from "./builtin";
import { Env, LogLevel, Requires } from "./config";
import { connect } from "./connect";
import { Event, EventContext, Request } from "./context";
import { CXN, ref } from "./cxn";
import { Logger } from "./log";
import { QL } from "./ql";
import { CQN, CSN, LinkedCSN } from "./reflect";
import {
  ApplicationService, AuditLogService,
  BuiltInServices, DatabaseService, MessagingService, RemoteService, Service
} from "./service";
import { TestFacade } from "./test";
import { TransactionMix } from "./transaction";

export * from "./auth";
export * from "./context";
export * from "./csn";
export * from "./log";
export * from "./reflect";
export * from "./service";
export * from "./test";
export * from "./transaction";



export interface CDS extends Pick<Service, "run" | "read" | "create" | "update" | "delete" | "insert"> {

  /**
   * project root directory
   */
  root?: string;

  /**
   * @sap/cds home directory
   */
  home: string;
  builtin: builtin;
  version: string;
  env: Env;
  requires: Requires;
  app: import("express").Application;
  services: {
    [serviceName: string]: Service | undefined,
    [Symbol.iterator](): Iterator<Service>;
  } & Partial<BuiltInServices>;

  Event: typeof Event;
  Service: typeof Service;
  EventContext: typeof EventContext;
  ApplicationService: typeof ApplicationService;
  MessagingService: typeof MessagingService;
  AuditLogService: typeof AuditLogService;
  RemoteService: typeof RemoteService;
  User: typeof User;

  Request: typeof Request

  db: DatabaseService;

  once(event: "bootstrap", cb: (app: import("express").Application) => any): void;
  once(event: "served", cb: (services: Array<Service>) => any): void;
  once(event: "listening", cb: (info: { server: import("http").Server, url: string }) => any): void;

  on(event: "loaded", cb: (csn: LinkedCSN) => any): void;
  on(event: "serving", cb: (service: Service) => any): void;
  on(event: "connect", cb: (service: Service) => any): void;
  on(event: "subscribe", cb: (service: Service, event: string) => any): void;

  log: {
    (module: string, options?: { label: string }): Logger;
    format?: (id: string, level: LogLevel, ...args: Array<any>) => Array<any>;
    levels: {
      SILENT: 0,    // all log output switched off
      ERROR: 1,     // logs errors only
      WARN: 2,      // logs errors and warnings only
      INFO: 3,      // logs errors, warnings and general infos 
      DEBUG: 4,     // logs errors, warnings, info, and debug
      TRACE: 5,     // most detailed log level
      SILLY: 5,     // alias for TRACE
      VERBOSE: 5
    };
    Logger?: (label: string, level: LogLevel) => Logger;
  };

  error(msg: string, options?: any): Error;
  error(options: { message: string, code: any, [param: string]: string }): Error;

  /**
   * shortcut of `cds.log().debug`, if debug is not enabled, the result is undefined
   * 
   * @param module 
   */
  debug(module: string): Logger["debug"] | undefined;

  connect: connect;

  serve(service: string, options: any): any;

  model: LinkedCSN;

  reflect(csn: CSN): LinkedCSN;
  linked(csn: CSN): LinkedCSN;

  test(project: string): { in: (...path: Array<string>) => TestFacade };

  ql: QL;
  /**
   * Reference to the current root event or request, which acts as invocation context, providing access to the current tenant and user information, and also constitutes the transaction boundary for automatically managed transactions.
   */
  get context(): EventContext | undefined;
  /**
   * set cds context
   * 
   * NOTE: set `undefined` value to clear current context (avoid context inherit)
   * 
   */
  set context(ctx: { tenant?: string, user: User | string } | undefined);
  server: (options: any) => any;
  utils: {
    /**
     * generates a new v4 UUID
     */
    uuid: () => string
  };
  compile: Function & {
    for: {
      odata(csn: CSN, options?: any): any;
      drafts(csn: CSN, options?: any): any;
      sql(csn: CSN, options?: any): any;
      java(csn: CSN, options?: any): any;
      nodejs(csn: CSN, options?: any): LinkedCSN;
    }
    to: {
      json(csn: CSN): any;
      yaml(csn: CSN): any;
      edm(csn: CSN, options?: any): any;
      edmx(csn: CSN, options?: any): any;
      hdbtable(csn: CSN): any;
      hdbcds(csn: CSN): any;
      sql(csn: CSN, options?: any): any;
    }
  };
  parse: {
    cdl(cdl: string): CSN;
    cql(cql: string): CQN;
    xpr(cxl: string): CXN;
    ref(cxl: string): ref;
  };
  load(files: string, options?: any): Promise<CSN>;
  load(files: Array<string>, options?: any): Promise<CSN>;
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

  options: {
    "in-memory?": boolean;
    project: string;
    port: string;
    service: string;
    from: string;
  }
}

