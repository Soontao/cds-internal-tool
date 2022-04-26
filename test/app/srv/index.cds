using {cuid} from '@sap/cds/common';


service IndexService {

  entity People : cuid {
    Name : String(255);
    Age  : Integer;
  }

}
