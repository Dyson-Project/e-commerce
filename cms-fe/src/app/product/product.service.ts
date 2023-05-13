import { DataService } from '../shared/services/data.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { SecurityService } from '../shared/services/security.service';
import { StorageService } from '../shared/services/storage.service';
import { Observable } from 'rxjs';
import { IBrand } from '../shared/models/brand.model';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { ICategory } from '../shared/models/category.model';
import { IProduct } from '../shared/models/product.model';
import { promise } from 'protractor';
import { ISku } from '../shared/models/sku.model';
import { IImage } from '../shared/models/image.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl:string = '';
  private skuUrl: string = '';
  private imageUrl: string = '';
  private brandUrl: string= '';
  private categoryUrl: string = '';
  constructor(
    private service: DataService,
    private configurationService: ConfigurationService,
    private securityService: SecurityService,
    private storageService: StorageService
  ) {
    //TODO TrueService !!!
    if(this.configurationService.isReady){
      this.productUrl = this.configurationService.serverSettings.purchaseUrl + '/api/products';
      this.skuUrl = this.configurationService.serverSettings.purchaseUrl + '/api/skus';
      this.imageUrl = this.configurationService.serverSettings.purchaseUrl + '/api/images';
      this.brandUrl = this.configurationService.serverSettings.purchaseUrl + '/api/brands';
      this.categoryUrl = this.configurationService.serverSettings.purchaseUrl + '/api/categories';
    } else {
    this.configurationService.settingLoaded$.subscribe(x=>{
      this.productUrl = this.configurationService.serverSettings.purchaseUrl + '/api/products'
      this.skuUrl = this.configurationService.serverSettings.purchaseUrl + '/api/skus';
      this.imageUrl = this.configurationService.serverSettings.purchaseUrl + '/api/images';
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

  getProduct(productId):Observable<IProduct>{
    let url = this.productUrl + '/' + productId;
    return this.service.get(url).pipe<IProduct>(
      map((res:any) => res.data)
      )
  }

  getSku(skuId:number):Observable<ISku>{
    let url = this.skuUrl + '/' + skuId;
    return this.service.get(url).pipe<ISku>(map((res:any) => res.data));
  }
  // fetchFile(url:string):Observable<Blob>{
  //   return this.service.getFile(url);
  // }

  createProduct(product:IProduct):Observable<any>{
    let url = this.productUrl;
    return this.service.post(url,product);
  }

  createSku(sku:ISku):Observable<any>{
    let url = this.skuUrl;
    return this.service.post(url, sku);
  }

  createImage(image:IImage):Observable<any>{
    let url = this.imageUrl;
    return this.service.post(url, image);
  }

  modifyProduct(product:IProduct):Observable<any>{
    let url = `${this.productUrl}/${product.id}`;
    return this.service.put(url, product);
  }

  modifySku(sku: ISku):Observable<any>{
    let url = `${this.skuUrl}/${sku.id}`;
    return this.service.put(url, sku);
  }

  deleteSku(skuId: number){
    let url = this.skuUrl + '/' + skuId;
    return this.service.delete(url).subscribe();
  }

  deleteImage(imageId:number){
    let url = this.imageUrl + '/' + imageId;
    return this.service.delete(url).subscribe();
  }
}