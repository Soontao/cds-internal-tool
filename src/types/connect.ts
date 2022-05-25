import { AuditLogService, DatabaseService, MessagingService, Service } from "./service";

export interface connect {
  to(service: "db", options?: any): Promise<DatabaseService>
  to(service: "messaging", options?: any): Promise<MessagingService>
  to(service: "audit-log-service", options?: any): Promise<AuditLogService>
  to(service: string, options?: any): Promise<Service>
}
