declare class Any { }
declare class type extends Any { }
declare class context extends Any { }
declare class action extends Any { }
declare class array extends type { }
declare class aspect extends type { }
declare class struct extends aspect { }
declare class service extends context { }
declare class event extends aspect { }
declare class mixin { }
declare class entity extends struct { }
declare class Association extends type { }
declare class Composition extends Association { }
declare class scalar extends type { }
declare class CDSString extends scalar { }
declare class CDSNumber extends scalar { }
declare class CDSBoolean extends scalar { }
declare class CDSDate extends scalar { }

export interface builtin {

  types: {
    [key: string]: typeof Any;
  }
  classes: {
    any: typeof Any;
    type: typeof type;
    array: typeof array;
    aspect: typeof aspect;
    struct: typeof struct;
    context: typeof context;
    service: typeof service;
    action: typeof action;
    event: typeof event;
    mixin: typeof mixin;
    entity: typeof entity;
    Association: typeof Association;
    Composition: typeof Composition;
    scalar: typeof scalar;
    string: typeof CDSString;
    number: typeof CDSNumber;
    boolean: typeof CDSBoolean;
    date: typeof CDSDate;
  }
}