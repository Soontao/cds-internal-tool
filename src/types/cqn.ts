import { expr, ref, xpr, _xpr } from "./cxn";

/**
 * CDS Query Notation
 */
export type CQN = Query

export type Query = Partial<SELECT & INSERT & UPDATE & DELETE & CREATE & DROP>

export type ParsedExpr = expr & { _: string }

export type SELECT = {
  SELECT: {
    distinct?: boolean
    one?: boolean
    from: source
    columns?: column_expr[]
    excluding?: string[]
    where?: predicate
    having?: predicate
    groupBy?: expr[]
    orderBy?: ordering_term[]
    limit?: { rows: number, offset: number }
    search?: _xpr;
    forUpdate?: { wait: number }
    forShareLock?: { wait: number }
    count?: boolean
  }
}

export type INSERT = {
  INSERT: {
    into: name
    columns: string[]
    values: any[]
    rows: any[]
    entries: any[]
    as?: SELECT;
  }
}


export type UPSERT = {
  UPSERT: {
    into: name
    columns: string[]
    values: any[]
    rows: any[]
    entries: any[]
    as?: SELECT;
  }
}


export type UPDATE = {
  UPDATE: {
    entity: name
    data: { [key: string]: expr }
    where?: predicate
  }
}

export type DELETE = {
  DELETE: {
    from: name
    where?: predicate
  }
}

export type CREATE = {
  CREATE: {
    entity: name
    as?: SELECT
  }
}

export type DROP = {
  DROP: {
    table?: ref
    view?: ref
    entity?: ref
  }
}

type name = string | ref
type source = (ref | SELECT) & { as?: name, join?: name, on?: xpr }
type ordering_term = expr & { asc?: true, desc?: true }

export type column_expr = expr & { as?: name, cast?: any, expand?: column_expr[], inline?: column_expr[] }
export type predicate = _xpr
