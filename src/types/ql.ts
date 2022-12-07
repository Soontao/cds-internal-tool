/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import * as CQN from "./cqn";
import { Definition as RawDef } from "./csn";
import { expr, Operator } from "./cxn";
import { Linked } from "./reflect";

type Definition = RawDef | Linked<RawDef>;

/** 
 * Query Object with fluent API
 */
export type QueryObject = SELECT | INSERT | UPDATE | DELETE | CREATE | DROP;

export declare class PromiseLike {
  then(_resolved: (x: any) => any, _rejected: (e: Error) => any): any
}

interface Constructable<T> {
  new(...args: any[]): T
}

export declare class QL {

  SELECT: typeof SELECT & ((...columns: string[]) => SELECT<any>) & ((columns: string[]) => SELECT<any>);

  INSERT: typeof INSERT & ((...entries: object[]) => INSERT<any>) & ((entries: object[]) => INSERT<any>);

  UPDATE: typeof UPDATE & typeof UPDATE.entity;

  DELETE: typeof DELETE;

  CREATE: typeof CREATE;

  DROP: typeof DROP;

}

export declare class SELECT<T = any> extends PromiseLike {

  static one: SELECT_one & { from: SELECT_one };

  static distinct: typeof SELECT;

  static from: SELECT_from;

  from(entity: Definition | string, primaryKey?: number | string | object, projection?: (e: any) => void): this

  byKey(primaryKey?: number | string | object): this

  columns(projection: (e: T) => void): this

  columns(...col: string[]): this

  where(predicate: object): this

  where(...expr: any[]): this

  and(predicate: object): this

  and(...expr: any[]): this

  having(...expr: string[]): this

  having(predicate: object): this

  groupBy(...expr: string[]): this

  orderBy(...expr: string[]): this

  fullJoin(other: string, as?: string): SELECT_join<T>;

  leftJoin(other: string, as?: string): SELECT_join<T>;

  rightJoin(other: string, as?: string): SELECT_join<T>;

  innerJoin(other: string, as?: string): SELECT_join<T>;

  join(other: string, as?: string, kind?: "inner" | "full" | "left" | "right"): SELECT_join<T>;

  limit(rows: number, offset?: number): this;

  /**
   * locks the selected rows in the current transaction
   * thereby preventing concurrent updates by other parallel transactions
   * until the transaction is committed or rolled back
   * 
   * using a shared lock allows all transactions to read the locked record
   */
  forShareLock(options?: { wait: number }): this;

  /**
   * Exclusively locks the selected rows for subsequent updates in the current transaction, thereby preventing concurrent updates by other parallel transactions.
   * 
   * @param options 
   */
  forUpdate(options?: { wait: number }): this

  SELECT: CQN.SELECT;

}

type SELECT_one =
  ((entity: Definition | string, primaryKey?: number | string | object, projection?: (e: any) => void) => SELECT<any>)
  & (<T> (entity: T[], projection?: (e: T) => void) => SELECT<T> & Promise<T>)
  & (<T> (entity: T[], primaryKey: number | string | object, projection?: (e: T) => void) => SELECT<T> & Promise<T>)
  & (<T> (entity: { new(): T }, projection?: (e: T) => void) => SELECT<T> & Promise<T>)
  & (<T> (entity: { new(): T }, primaryKey: number | string | object, projection?: (e: T) => void) => SELECT<T> & Promise<T>)


type SELECT_from =
  ((entity: Definition | string, primaryKey?: number | string | object, projection?: (e: any) => void) => SELECT<any>)
  & (<T> (entity: T[], projection?: (e: T) => void) => SELECT<T> & Promise<T[]>)
  & (<T> (entity: T[], primaryKey: number | string | object, projection?: (e: T) => void) => SELECT<T> & Promise<T>)
  & (<T> (entity: { new(): T }, projection?: (e: T) => void) => SELECT<T> & Promise<T[]>)
  & (<T> (entity: { new(): T }, primaryKey: number | string | object, projection?: (e: T) => void) => SELECT<T> & Promise<T>)


interface SELECT_join<T = any> extends SELECT<T> {
  on(...expr: Array<expr | Operator>): SELECT<T>;
}


export declare class INSERT<T = any> extends PromiseLike {
  static into(entity: Definition | string, entries?: object | object[]): INSERT<any>

  static into<T>(entity: Constructable<T>, entries?: object | object[]): INSERT<T>

  static into<T>(entity: T, entries?: T | object | object[]): INSERT<T>

  into(entity: Definition | string): this

  as(select: SELECT): this

  data(block: (e: T) => void): this

  entries(...entries: object[]): this

  columns(...col: string[]): this

  values(...val: any[]): this

  rows(...row: any[]): this

  INSERT: CQN.INSERT;
}

export declare class DELETE<T = any> extends PromiseLike {
  static from(entity: Definition | string, primaryKey?: number | string | object): DELETE<any>

  byKey(primaryKey?: number | string | object): this

  where(predicate: object): this

  where(...expr: any[]): this

  and(predicate: object): this

  and(...expr: any[]): this

  DELETE: CQN.DELETE;
}

export declare class UPDATE<T = any> extends PromiseLike {
  static entity(entity: Definition | string, primaryKey?: number | string | object): UPDATE<any>

  static entity<T>(entity: Constructable<T>, primaryKey?: number | string | object): UPDATE<T>

  static entity<T>(entity: T, primaryKey?: number | string | object): UPDATE<T>

  byKey(primaryKey?: number | string | object): this

  // with (block: (e:T)=>void) : this
  // set (block: (e:T)=>void) : this
  set(data: object): this

  with(data: object): this

  where(predicate: object): this

  where(...expr: any[]): this

  and(predicate: object): this

  and(...expr: any[]): this

  UPDATE: CQN.UPDATE;
}

export declare class CREATE<T = any> extends PromiseLike {
  static entity(entity: Definition | string): CREATE<any>

  CREATE: CQN.CREATE;
}

export declare class DROP<T = any> extends PromiseLike {
  static entity(entity: Definition | string): DROP<any>

  DROP: CQN.DROP;
}
