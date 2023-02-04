/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/ban-types */

import { User } from "./auth";
import { VarDefinition } from "./csn";
import { QueryObject } from "./ql";
import { CQN } from "./reflect";

export declare class EventContext {

  static for(_: any): EventContext;

  constructor(_?: any);

  /**
   * A unique string used for request correlation.
   */
  id: string;

  user: User;

  /**
   * A unique string identifying the current tenant, or undefined if not run in multitenancy mode. In case of multitenancy operation, this string is used for tenant isolation, for example as keys in the database connection pools.
   */
  tenant: string;

  locale: string;

  get timestamp(): Date;

  on(event: "succeeded" | "failed" | "done", cb: Function): void

  before(event: "commit", cb: Function): void

}

/**
 * cds event
 */
export declare class Event<DATA = any> extends EventContext {

  event: string;

  data: DATA;

  headers: import("http").IncomingHttpHeaders;

}

export declare class Request<DATA = any> extends Event<DATA> {
  _: {
    req: import("express").Request;
    res: import("express").Response;
  };

  method: string;

  target?: VarDefinition;

  /**
   * Captures the full cannibalized path information of incoming requests with navigation. '
   * If requests without navigation, req.path is identical to req.target.name (or req.entity, which is a shortcut for that).
   */
  path: string;

  entity: string;

  params: Iterable<any>;

  query: QueryObject | CQN | string | Array<QueryObject>;

  reply(results: any): void

  notify(code: number, msg: string, target?: string, args?: {}): Error

  info(code: number, msg: string, target?: string, args?: {}): Error

  warn(code: number, msg: string, target?: string, args?: {}): Error

  error(code: number, msg: string, target?: string, args?: {}): Error

  reject(code: number, msg: string, target?: string, args?: {}): Error

  notify(msg: string, target?: string, args?: {}): Error

  info(msg: string, target?: string, args?: {}): Error

  warn(msg: string, target?: string, args?: {}): Error

  error(msg: string, target?: string, args?: {}): Error

  reject(msg: string, target?: string, args?: {}): Error

  notify(msg: { code?: number | string, msg: string, target?: string, args?: {} }): Error

  info(msg: { code?: number | string, msg: string, target?: string, args?: {} }): Error

  warn(msg: { code?: number | string, msg: string, target?: string, args?: {} }): Error

  error(msg: { code?: number | string, msg: string, target?: string, args?: {} }): Error

  reject(msg: { code?: number | string, msg: string, target?: string, args?: {} }): Error

  /**
   * 
   * Use this asynchronous method to calculate the difference between the data on the database and the passed data (defaults to req.data, if not passed).
   * **This will trigger database requests.**
   * 
   * @param data 
   */
  diff(data?: any): Promise<any>

}
