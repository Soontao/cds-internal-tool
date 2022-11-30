/* eslint-disable camelcase */
export declare class User {

  constructor(_: any);

  id: string;

  get attr(): any;

  /**
   * @deprecated
   */
  get tenant(): string;

  /**
   * @deprecated
   */
  get locale(): string

  is(role: string): boolean;

  valueOf(): string;

  static Anonymous: typeof Anonymous;

  static Privileged: typeof Privileged;

  static anonymous: Anonymous;

  static privileged: Anonymous;

  static default: Anonymous;


}


export declare class Anonymous extends User {
  _is_anonymous: true;
}

export declare class Privileged extends User {
  _is_privileged: true;
}

