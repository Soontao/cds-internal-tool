import type { AxiosInstance } from "axios";

type Methods = "get" | "post" | "patch" | "delete" | "put";

export interface TestFacade extends Pick<AxiosInstance, Methods> {
  axios: AxiosInstance
}
