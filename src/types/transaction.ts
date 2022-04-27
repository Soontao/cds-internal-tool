import { EventContext } from "./context";

export interface TransactionMix {
  context: EventContext;
  commit(res?: any): Promise<any>;
  rollback(err?: Error): Promise<Error>;
}
