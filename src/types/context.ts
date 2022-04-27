/* eslint-disable @typescript-eslint/ban-types */

import { User } from "./auth";
import { CQN, Definition } from "./reflect";

export declare class EventContext {
  id: string;

  user: User;

  tenant: string;

  locale: string;

  timestamp: Date;

  on(event: string, cb: Function): void
}

/**
 * cds event
 */
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
