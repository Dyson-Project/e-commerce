import { ICategory } from '../shared/models/category.model';
import { ICatalog } from '../shared/models/catalog.model';
import { IPager } from '../shared/models/pager.model';
import { Subscription, throwError, Observable, of } from 'rxjs';
import { CatalogService } from './catalog.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { SecurityService } from '../shared/services/security.service';
import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { IProduct } from '../shared/models/product.model';
import { ISku } from '../shared/models/sku.model';
import { CartWrapperService } from '../shared/services/cart.wrapper.service';
import { IBrand } from '../shared/models/brand.model';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { EProductStatus } from '../shared/models/productStatus.const';
import numberOnly from '../shared/util/validate';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  numberOnly:Function = numberOnly;
  brands!: IBrand[];
  categories!: ICategory[];
  categorySelected: number;
  brandSelected: string;
  catalog: ICatalog<IProduct>;
  paginationInfo: IPager;
  authenticated: boolean = false;
  authSubscription: Subscription;
  errorRecieved: boolean;
  currentQuery = {
    pageIndex: 0,
    pageSize: 10,
    status: EProductStatus.Active,
    productName: null,
    brandId: null,
    categoryId: null,
    minPrice: null,
    maxPrice: null
  };
  //Fontawesome
  constructor(
    private service: CatalogService,
    private configurationService: ConfigurationService,
  ) {
  }

  ngOnInit(): void {
    if (this.configurationService.isReady) {
      this.loadData();
    }
    else {
      this.configurationService.settingLoaded$.subscribe(x => {
        this.loadData();
      });
    }
  }

  loadData(){
    this.getCategories();
    this.getBrands();
    this.getCatalog(this.currentQuery);
  }

  getCategories(){
    this.service.getCategories().subscribe(categories =>{
      this.categories = categories;
    })
  }

  getBrands(){
    this.service.getBrands().subscribe(brands =>{
      this.brands = brands;
    })
  }

  onFilterApplied(event: any){
    this.getCatalog(this.currentQuery);
  }

  onBrandFilterChanged(event: any, value: string){
    this.brandSelected = value;
    this.currentQuery.brandId = value;
  }

  onCategoryFilterChanged(event: any, value: number){
    this.categorySelected = value;
    this.currentQuery.brandId = value;
  }

  onPageChanged(value: any){
    this.currentQuery.pageIndex = value;
    this.getCatalog(this.currentQuery);
  }

  getCatalog(params: { [param: string]: any }) {
    this.service.getCatalog(params)
      .subscribe(catalog => {
        this.catalog = catalog;
        this.paginationInfo = {
          actualPage : catalog.pageIndex,
          itemsPage : catalog.pageSize,
          totalItems: catalog.count,
          items: catalog.pageSize,
          totalPages: Math.ceil(catalog.count / catalog.pageSize)
        }
      })
  }

  private handleError(error: any){
    this.errorRecieved = true;
    if (error.error instanceof ErrorEvent) {
      console.log('Client side network error occurred', error.error.message);
    } else {
        console.error('Backend - ' +
          `status: ${error.status}, ` +
          `statusText: ${error.statusText}, ` +
          `message: ${error.error.message}`);
    }
    return throwError(error);
  }

}
