import { AuditLogService, DatabaseService, MessagingService, Service } from "./service";

type ConnectOptions = {
  kind?: string,
  impl?: any,
  model?: any,
  credentials?: any,
}

export interface connect {
  to(service: "db", options?: ConnectOptions): Promise<DatabaseService>
  to(service: "messaging", options?: ConnectOptions): Promise<MessagingService>
  to(service: "audit-log-service", options?: ConnectOptions): Promise<AuditLogService>
  to<T extends Service = Service>(service: string, options?: ConnectOptions): Promise<T>
}
