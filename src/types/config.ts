export type Env = Config & {
  /**
   * safe get
   * 
   * @param prop prop name 
   */
  get(prop: string): any;
}

export interface Config {
  _context?: string;
  _home?: string;
  _sources?: string[];
  _profiles?: Array<string>;
  requires?: Requires;
  schemas?: Schemas;
  features?: Features;
  log?: Log;
  folders?: Folders;
  i18n?: I18N;
  odata?: Odata;
  sql?: SQL;
  hana?: Hana;
  build?: Build;
  mtx?: Mtx;
  cdsc?: any;
  query?: Query;
  profiles?: string[];
  [other: string]: any;
}


export interface Build {
  target?: string;
}

export interface Features {
  schema_evolution?: boolean;
  folders?: string;
  lean_draft?: boolean;
  cls?: boolean;
  live_reload?: boolean;
  fiori_preview?: boolean;
  fiori_routes?: boolean;
  in_memory_db?: boolean;
  test_data?: boolean;
  test_mocks?: boolean;
  with_mocks?: boolean;
  mocked_bindings?: boolean;
  skip_unused?: boolean;
  deploy_data_onconflict?: string;
  one_model?: boolean;
  localized?: boolean;
  assert_integrity?: boolean;
  cds_tx_protection?: boolean;
  cds_tx_inheritance?: boolean;
  [other: string]: boolean | string | undefined;
}

export interface Folders {
  db?: string;
  srv?: string;
  app?: string;
}

export interface Hana {
  "deploy-format"?: string;
  journal?: Journal;
}

export interface Journal {
  "change-mode"?: string;
}

export interface I18N {
  file?: string;
  folders?: string[];
  for_sqlite?: string[];
  for_sql?: string[];
  languages?: string;
  default_language?: string;
  fallback_bundle?: string;
  preserved_locales?: string[];
}

export interface Log {
  levels?: Levels;
  service?: boolean;
  kibana_custom_fields?: KibanaCustomFields;
}

export interface KibanaCustomFields {
  query?: number;
  target?: number;
  details?: number;
}

export type LogLevel = "silent" | "error" | "warn" | "info" | "debug" | "trace" | "silly" | "verbose";

export interface Levels {
  compile?: LogLevel;
  cli?: LogLevel;
  deploy?: LogLevel;
  serve?: LogLevel;
  server?: LogLevel;
  db?: LogLevel;
  sqlite?: LogLevel;
  mysql?: LogLevel;
  hana?: LogLevel;
  cds?: LogLevel;
  pool?: LogLevel;
  remote?: LogLevel;
  "audit-log"?: LogLevel;
  odata?: LogLevel;
  rest?: LogLevel;
  graphql?: LogLevel;
  messaging?: LogLevel;
  app?: LogLevel;
}

export interface Mtx {
  api?: API;
  domain?: string;
}

export interface API {
  model?: boolean;
  provisioning?: boolean;
  metadata?: boolean;
  diagnose?: boolean;
}

export interface Odata {
  flavors?: Flavors;
  version?: string;
}

export interface Flavors {
  v2?: V2;
  v4?: V2;
  w4?: W4;
  x4?: W4;
}

export interface V2 {
  version?: string;
}

export interface W4 {
  version?: string;
  containment?: boolean;
  structs?: boolean;
  refs?: boolean;
  xrefs?: boolean;
}

export interface Query {
  limit?: Limit;
}

export interface Limit {
  max?: number;
}

/**
 * List CDS dependencies to databases and services within the requires section.
 */
export interface Requires {
  auth?: AuthUnion;
  /**
   * Configure if/how the DeploymentService handles subscribe, unsubscribe, and upgrade events
   * for single tenants and single apps/micro-services.
   */
  "cds.xt.DeploymentService"?: CdsXtDeploymentService;
  /**
   * Configure if/how the ExtensibilityService allows to add and activate tenant-specific
   * extensions at runtime.
   */
  "cds.xt.ExtensibilityService"?: CdsXtExtensibilityService;
  /**
   * Configure if/how the ModelProviderService serves model variants that may include
   * tenant-specific extensions and/or feature-toggled aspects.
   */
  "cds.xt.ModelProviderService"?: CdsXtModelProviderServiceUnion;
  /**
   * De-/Activate the facade for the DeploymentService to adapt to the API expected by SAP
   * BTP’s SaaS Provisioning Service, hence providing out-of-the-box integration.
   */
  "cds.xt.SaasProvisioningService"?: boolean;
  db?: DBUnion;
  /**
   * Shortcut to enable extensibility.
   */
  extensibility?: boolean;
  /**
   * Shortcut to enable multitenancy.
   */
  multitenancy?: boolean;
  /**
   * Shortcut to enable feature toggles.
   */
  toggles?: boolean;
}

export type AuthUnion = AuthObject | string;

/**
* Use custom authentication settings.
*/
export interface AuthObject {
  /**
   * You can explicitly configure credentials, but this is overruled by VCAP_SERVICES if a
   * matching entry is found therein.
   */
  credentials?: AuthCredentials;
  /**
   * Define the kind of strategy.
   */
  kind?: string;
  users?: Users;
}

/**
* You can explicitly configure credentials, but this is overruled by VCAP_SERVICES if a
* matching entry is found therein.
*/
export interface AuthCredentials {
  database?: string;
}

/**
* Configure if/how the DeploymentService handles subscribe, unsubscribe, and upgrade events
* for single tenants and single apps/micro-services.
*/
export type CdsXtDeploymentService = boolean | CdsXtDeploymentServiceEnum;

/**
* 'in-sidecar' preset provides defaults for usage in sidecars.
* 'from-sidecar' preset is a shortcut for '{ kind: rest }'.
*/
export enum CdsXtDeploymentServiceEnum {
  FromSidecar = "from-sidecar",
  InSidecar = "in-sidecar",
}

/**
* Configure if/how the ExtensibilityService allows to add and activate tenant-specific
* extensions at runtime.
*/
export type CdsXtExtensibilityService = boolean | CdsXtExtensibilityServiceClass;

/**
* Extension restrictions
*/
export interface CdsXtExtensibilityServiceClass {
  /**
   * Field names must start with one of these strings.
   */
  "element-prefix"?: string[];
  /**
   * Restrictions for model entities, types, etc.
   */
  "extension-allowlist"?: ExtensionAllowlist[];
  /**
   * Namespaces must not start with these strings.
   */
  "namespace-blocklist"?: string[];
}

export interface ExtensionAllowlist {
  /**
   * Restriction applies to these namespaces.
   */
  for?: string[];
  /**
   * Type of definition
   */
  kind?: Kind;
  /**
   * Number of entities to be added at most
   */
  "new-entities"?: number;
  /**
   * Number of fields to be added at most.
   */
  "new-fields"?: number;
}

/**
* Type of definition
*/
export enum Kind {
  Action = "action",
  Annotation = "annotation",
  Context = "context",
  Entity = "entity",
  Function = "function",
  Service = "service",
  Type = "type",
}

/**
* Configure if/how the ModelProviderService serves model variants that may include
* tenant-specific extensions and/or feature-toggled aspects.
*/
export type CdsXtModelProviderServiceUnion = boolean | CdsXtDeploymentServiceEnum | CdsXtModelProviderServiceObject;

/**
* Configuration options
*/
export interface CdsXtModelProviderServiceObject {
  /**
   * A directory name, absolute or relative to the package.json's location, specifying the
   * location to search for models and resources to be served by the model provider services.
   * Default is undefined, for embedded usage of model provider. In case of a sidecar, it
   * refers to the main app's model; usually '../..' during development, and '_main' in
   * production.
   */
  root?: string;
}

export type DBUnion = DBObject | string;

/**
 * Define the list of folders containing language files. Defaults are '_i18n/', 'i18n/', and
 * 'assets/i18n/'. First valid entry wins.
 *
 * Define the assigned model. Interpreted like Node.js 'requires' logic.
 */
export type Model = string[] | string;

/**
* Use custom database-specific settings.
*/
export interface DBObject {
  /**
   * You can explicitly configure credentials, but this is overruled by VCAP_SERVICES if a
   * matching entry is found therein.
   */
  credentials?: DBCredentials;
  /**
   * Define the kind of dependency.
   */
  kind?: string;
  /**
   * Define the assigned model. Interpreted like Node.js 'requires' logic.
   */
  model?: Model;
  /**
   * Optional: Used to select an entry in VCAP_SERVICES.
   */
  vcap?: Vcap;
  [other: string]: any;
}

/**
* You can explicitly configure credentials, but this is overruled by VCAP_SERVICES if a
* matching entry is found therein.
*/
export interface DBCredentials {
  database?: string;
  [other: string]: any;
}

/**
* Optional: Used to select an entry in VCAP_SERVICES.
*/
export interface Vcap {
  name?: string;
}


export interface Tenants {
  [id: string]: { features?: Array<string>; }
}

export interface Users {
  [id: string]: User;
}

export interface User {
  tenant?: string;
  roles?: string[];
  features?: any[];
}

export interface Schemas {
  "cds-rc.json"?: string;
  "cds-package.json"?: string;
}

export interface SQL {
  names?: string;
  dialect?: string;
}
