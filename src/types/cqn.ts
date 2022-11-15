import { expr, ref, xpr, _xpr } from "./cxn";

/**
 * CDS Query Notation
 */
export type CQN = {
  SELECT?: SELECT,
  INSERT?: INSERT,
  UPDATE?: UPDATE,
  DELETE?: DELETE,
  CREATE?: CREATE,
  DROP?: DROP,
}

export type Query = Partial<SELECT & INSERT & UPDATE & DELETE & CREATE & DROP>

export type ParsedExpr = expr & { _: string }

export type SELECT = {
  SELECT: {
    distinct?: true
    one?: boolean
    from: source
    columns?: column_expr[]
    excluding?: string[]
    where?: predicate
    having?: predicate
    groupBy?: expr[]
    orderBy?: ordering_term[]
    limit?: { rows: number, offset: number }
  }
}

export type INSERT = {
  INSERT: {
    into: name
    entries: any[]
    columns: string[]
    values: any[]
    rows: any[]
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
  }
}

export type DROP = {
  DROP: {
    entity: name
  }
}

type name = string
type source = (ref | SELECT) & { as?: name, join?: name, on?: xpr }
export type column_expr = expr & { as?: name, cast?: any, expand?: column_expr[], inline?: column_expr[] }
export type predicate = _xpr
type ordering_term = expr & { asc?: true, desc?: true }


