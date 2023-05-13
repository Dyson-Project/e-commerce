import { DataService } from '../shared/services/data.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { Injectable } from '@angular/core';
import { ICatalog } from '../shared/models/catalog.model';
import { ObjectUnsubscribedError, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SecurityService } from '../shared/services/security.service';
import { StorageService } from '../shared/services/storage.service';
import { IProduct } from '../shared/models/product.model';
import { IBrand } from '../shared/models/brand.model';
import { ICategory } from '../shared/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductListService {
  private productUrl: string = '';
  private brandUrl: string= '';
  private categoryUrl: string = ''
  constructor(
    private service: DataService,
    private configurationService: ConfigurationService,
    private securityService: SecurityService,
    private storageService: StorageService
  ) {
    if (this.configurationService.isReady) {
      this.productUrl = this.configurationService.serverSettings.purchaseUrl + '/api/products';
      this.brandUrl = this.configurationService.serverSettings.purchaseUrl + '/api/brands';
      this.categoryUrl = this.configurationService.serverSettings.purchaseUrl + '/api/categories';
    } else {
      this.configurationService.settingLoaded$.subscribe(x => {
        this.productUrl = this.configurationService.serverSettings.purchaseUrl + '/api/products';
      this.brandUrl = this.configurationService.serverSettings.purchaseUrl + '/api/brands';
      this.categoryUrl = this.configurationService.serverSettings.purchaseUrl + '/api/categories';
      });
    }

  }
  getBrands():Observable<IBrand[]>{
    let url = this.brandUrl;
    return this.service.get(url).pipe<IBrand[]>(tap((res:any)=>{
      return res;
    }))
  }

  getCategories():Observable<ICategory[]>{
    let url = this.categoryUrl;
    return this.service.get(url).pipe<ICategory[]>(tap((res:any)=>{
      return res;
    }))
  }
  
  getCatalog(params?: { [param: string]: any }): Observable<ICatalog<IProduct>> {
    let url = this.productUrl;
    if (params && Object.values(params).some(value => value)) {
      url += '?';
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          url += `${key}=${value}&`;
        }
      }
      url = url.substring(0, url.lastIndexOf('&'));
    }
    return this.service.get(url).pipe<ICatalog<IProduct>>(tap((response: any) => {
      return response;
    }));
  }

  deleteProduct(product: IProduct):Observable<any>{
    let url = `${this.productUrl}/${product.id}`;
    return this.service.put(url, product);
  }

}