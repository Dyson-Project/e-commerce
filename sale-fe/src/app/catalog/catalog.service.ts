import { DataService } from '../shared/services/data.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { Observable } from 'rxjs';
import { ICatalog } from '../shared/models/catalog.model';
import { IProduct } from '../shared/models/product.model';
import { Injectable } from "@angular/core";
import { tap } from 'rxjs/operators';
import { ICategory } from '../shared/models/category.model';
import { IBrand } from '../shared/models/brand.model';

@Injectable()
export class CatalogService{
  private catalogUrl: string='';
  private categoryUrl: string='';
  private brandUrl: string='';

  constructor(
    private service: DataService,
    private configurationService: ConfigurationService
  ){
    if(this.configurationService.isReady){
      this.catalogUrl = this.configurationService.serverSettings.purchaseUrl + '/api/products/catalog';
      this.categoryUrl = this.configurationService.serverSettings.purchaseUrl + '/api/categories';
      this.brandUrl = this.configurationService.serverSettings.purchaseUrl + '/api/brands';
    }else {
    this.configurationService.settingLoaded$.subscribe(x => {
      this.catalogUrl = this.configurationService.serverSettings.purchaseUrl + '/api/products/catalog';
      this.categoryUrl = this.configurationService.serverSettings.purchaseUrl + '/api/categories';
      this.brandUrl = this.configurationService.serverSettings.purchaseUrl + '/api/brands';
    });
    }
  }
  
  getCatalog(params?: { [param: string]: any }): Observable<ICatalog<IProduct>> {
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
    return this.service.get(url).pipe<ICatalog<IProduct>>(tap((response: any) => {
      console.log(url, response);
      return response;
    }));
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
}