import { BuiltInServices, Service } from "./service";

type ConnectOptions = {
  kind?: string,
  impl?: any,
  model?: any,
  credentials?: any,
}

export interface connect {
  to<S extends keyof BuiltInServices>(service: S, options?: ConnectOptions): Promise<BuiltInServices[S]>
  to<T extends Service = Service>(service: string, options?: ConnectOptions): Promise<T>
}
