import {DataService} from '../shared/services/data.service';
import {ConfigurationService} from '../shared/services/configuration.service';
import {Observable} from 'rxjs';
import {Injectable} from "@angular/core";
import {map} from 'rxjs/operators';
import {ICategory} from '../shared/models/category.model';
import {IBrand} from '../shared/models/brand.model';
import {IProduct} from "../shared/models/product.model";
import {IPage} from "../shared/models/catalog.model";

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private catalogUrl: string = '';
  private categoryUrl: string = '';
  private brandUrl: string = '';

  constructor(
    private service: DataService,
    private configurationService: ConfigurationService
  ) {
    this.configurationService.settingLoaded$.subscribe(settings => {
      this.catalogUrl = '/api/products/search/catalog';
      this.categoryUrl = '/api/categories';
      this.brandUrl = '/api/brands';
    });
  }

  getCatalog(params?: { [param: string]: any }): Observable<IPage<IProduct>> {
    let url = this.catalogUrl;
    if (params && Object.values(params).some(value => value)) {
      url += '?';
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          url += `${key}=${value}&`;
        }
      }
      url = url.substring(0, url.lastIndexOf('&'));
    }
    return this.service.get(url)
      .pipe(map((response: any): IPage<IProduct> => {
        console.log(url, response);
        return {
          data: response._embedded.products,
          size: response.page.size,
          number: response.page.number,
          totalElements: response.page.totalElements,
          totalPages: response.page.totalPages
        }
      }));
  }

  getBrands(): Observable<IBrand[]> {
    return this.service.get(this.brandUrl).pipe<IBrand[]>(map((res: any) => {
      return res._embedded.brands
    }))
  }

  getCategories(): Observable<ICategory[]> {
    return this.service.get(this.categoryUrl).pipe<ICategory[]>(map((res: any) => {
      return res._embedded.categories
    }))
  }
}
