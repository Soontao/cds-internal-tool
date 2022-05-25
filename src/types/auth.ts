/* eslint-disable camelcase */
export declare class User {
  id: string;

  get _roles(): any;

  get attr(): any;

  is(role: string): boolean;

  valueOf(): string;

  static Anonymous: typeof Anonymous;

  static Privileged: typeof Privileged;

}


export declare class Anonymous extends User {
  _is_anonymous: true;
}

export declare class Privileged extends User {
  _is_privileged: true;
}

