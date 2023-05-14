import {Injectable} from "@angular/core";
import {DataService} from '../shared/services/data.service';
import {ConfigurationService} from '../shared/services/configuration.service';
import {Observable} from 'rxjs';
import {IProduct} from "../shared/models/product.model";
import {map} from "rxjs/operators";

@Injectable()
export class ProductDetailService {
  private productUrl!: string;

  constructor(
    private service: DataService,
    private configurationService: ConfigurationService
  ) {
    configurationService.settingLoaded$.subscribe(settings => {
      this.productUrl = settings.purchaseUrl + '/api/products';
    })
  }


  getProduct(id: number): Observable<IProduct> {
    let url = this.productUrl;
    url += `/${id}`;
    return this.service.get(url).pipe<IProduct>(map((response: any) => {
      console.log('res' , response);
      return response.data;
    }));
  }
}
