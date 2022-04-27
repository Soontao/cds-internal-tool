/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/ban-types */

// TODO: minimal CAP abstract type definition

import type EventEmitter from "events";
import { Event, EventContext, Request } from "./context";
import { Logger } from "./log";
import { CQN, CSN, CXN, LinkedCSN } from "./reflect";
import { ApplicationService, DatabaseService, Service } from "./service";
import { TestFacade } from "./test";
import { TransactionMix } from "./transaction";


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

export * from "./auth";
export * from "./context";
export * from "./log";
export * from "./reflect";
export * from "./service";
export * from "./test";
export * from "./transaction";

