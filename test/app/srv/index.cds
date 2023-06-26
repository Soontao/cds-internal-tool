using {cuid} from '@sap/cds/common';
using from './demo';


@path: '/index'
service IndexService {

  entity People : cuid {
    Name : String(255);
    Age  : Integer;
  }

  @odata.draft.enabled: true
  entity Person : cuid {
    Name : String(255);
    Age  : Integer;
  }

}
