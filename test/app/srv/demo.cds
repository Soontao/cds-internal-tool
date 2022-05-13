namespace test.app.srv;

using {cuid} from '@sap/cds/common';


service MyService {

  entity Foo : cuid {
    name      : String(255);
    age       : Integer;
    age_new   : Integer;
    heightNew : Integer;
    height_2  : Integer;
  } actions {
    action   add(v1 : Integer)      returns array of String(255);
    function query(p : String(255)) returns array of Foo;
  }

  action addFoo(id : UUID, v1 : Integer) returns Foo;

  event sub {
    v : String(255)
  }
}
