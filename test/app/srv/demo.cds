namespace test.app.srv;

using {cuid} from '@sap/cds/common';

type Struct1 {
  v1 : String(255);
  v2 : Decimal;
}

type Struct2 {
  s1 : Struct1;
  s2 : String(255);
}

service MyService {

  entity Foo : cuid {
    name      : String(255);
    age       : Integer;
    age_new   : Integer;
    heightNew : Integer;
    height_2  : Integer;
    s2        : Struct2;
  } actions {
    action   add(v1 : Integer)      returns array of String(255);
    function query(p : String(255)) returns array of Foo;
  }

  action addFoo(id : UUID, v1 : Integer) returns Foo;

  event sub {
    v : String(255)
  }
}
