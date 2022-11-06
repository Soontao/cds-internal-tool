
type LogFunction = (message?: any, ...optionalParams: any[]) => void;

export interface Logger {
  trace: LogFunction;
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
  log: LogFunction;

  _trace: boolean
  _debug: boolean
  _info: boolean
  _warn: boolean
  _error: boolean
}
