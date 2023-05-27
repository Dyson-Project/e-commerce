import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'prependHost'
})
export class PrependHostPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let newString = `https://localhost:5001/${value}`;
    return newString;
  }

}
