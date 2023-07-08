import { Pipe, PipeTransform } from '@angular/core';
import {environment} from "../../../environments/environment";

@Pipe({
  name: 'prependHost'
})
export class PrependHostPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let newString = `${environment.API_HOST}/${value}`;
    return newString;
  }

}
