import {Injectable} from "@angular/core";
import {combineLatestWith, Observable} from 'rxjs';
import {DataService} from "./data.service";
import {ConfigurationService} from "./configuration.service";
import {IProduct} from "../models/product.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl: string = '/api/products';

  constructor(
    private service: DataService,
    private configurationService: ConfigurationService
  ) {
  }


  getProduct(id: number): Observable<IProduct> {
    let url = this.productUrl;
    url += `/${id}`;
    const products$ = this.service.get(url)
    const brand$ = this.service.get(url + "/brand")
    return products$.pipe(
      combineLatestWith(brand$),
      map((pair) => {
        const [product, brand] = pair;
        product.brand = brand
        return product;
      })
    )
  }

}
