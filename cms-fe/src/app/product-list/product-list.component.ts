import { ConfigurationService } from '../shared/services/configuration.service';
import { SecurityService } from '../shared/services/security.service';
import { Subscription, throwError } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ProductListService } from './product-list.service';
import { ICatalog } from '../shared/models/catalog.model';
import { IPager } from '../shared/models/pager.model';
import { IProduct } from '../shared/models/product.model';
import { EProductStatus } from '../shared/models/productStatus.const';
import { ConfirmModelComponent } from '../shared/components/confirm-model/confirm-model.component';
import { ICategory } from '../shared/models/category.model';
import { IBrand } from '../shared/models/brand.model';
import numberOnly from '../shared/utils/validate';
import { FormControl } from '@angular/forms';
import { AbstractControl, AbstractControlOptions } from '@angular/forms';
import { AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface Product extends IProduct{
  totalAvailable: number,
  minPrice: number,
  maxPrice: number,
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  numberOnly:Function = numberOnly;
  authenticated: boolean = false;
  authSubscription: Subscription;
  selectedTab: string = EProductStatus.All;
  currentQuery = {
    pageIndex: 0,
    pageSize: 4,
    status: null,
  }
  categories:ICategory[];
  brands: IBrand[];
  EProductStatus = EProductStatus;
  ProductStatus = [
    {name: 'All', value: EProductStatus.All},
    {name: 'Active', value:EProductStatus.Active},
    {name: 'Disabled',value:EProductStatus.Disabled},
    {name: 'Deleted',value:EProductStatus.Deleted}
  ]
  productList: Product[] = [];
  searchFormGroup: FormGroup;
  paginationInfo: IPager;
  constructor(
    private configurationService:ConfigurationService,
    private securityService: SecurityService,
    private service: ProductListService,
    private modalService: NgbModal
  ) { 

  }

  ngOnInit() {
    if(this.configurationService.isReady){
      this.loadData();
    } else {
      this.configurationService.settingLoaded$.subscribe(x=>{
        this.loadData();
      });
    }

    this.authSubscription = this.securityService.authenticationChallenge$.subscribe(res=>{
      this.authenticated = res;
    })
  }

  changeTab(status: string) {
    this.selectedTab = status;
    this.currentQuery = {...this.currentQuery, pageIndex: 0, status: status};
    this.getCatalog(this.currentQuery);
  }

  loadData(){
    this.getCategories();
    this.getBrands();
    this.getCatalog(this.currentQuery);
    this.loadSearchForm();
  }

  getCatalog(params: {[param:string]:any} ){
    this.service.getCatalog(params).subscribe({
      next: catalog => {
          this.productList = [];
        //Load list product
        catalog.data.forEach(product => {
          let productTemp:Product={
            ...product,
            totalAvailable: 0,
            minPrice: Number.MAX_SAFE_INTEGER,
            maxPrice: 0
          }
          product.skus.forEach(sku=>{
            productTemp.totalAvailable += sku.available;
            if(productTemp.minPrice>sku.price){
              productTemp.minPrice = sku.price;
            }
            if(productTemp.maxPrice<sku.price){
              productTemp.maxPrice = sku.price;
            }
          })
          this.productList.push(productTemp);
        });
        // Load page info
        this.paginationInfo = {
          actualPage : catalog.pageIndex,
          itemsPage : catalog.pageSize,
          totalItems: catalog.count,
          items: catalog.data.length,
          totalPages: Math.ceil(catalog.count / catalog.pageSize)
        }
      }
    })
  }

  loadSearchForm(){
    this.searchFormGroup = new SearchFormGroup({
      id: new FormControl(null),
      categoryId: new FormControl(null),
      brandId: new FormControl(null),
      minPrice: new FormControl(null),
      maxPrice: new FormControl(null)
    })
  }

  searchProduct(){
    console.log(this.searchFormGroup);
    this.currentQuery = {...this.currentQuery, ...this.searchFormGroup.value} 
    this.getCatalog(this.currentQuery);
  }

  deleteProduct(product:IProduct) {
    let confirmRef = this.modalService.open(ConfirmModelComponent);
    confirmRef.componentInstance.message = "Delete product?"
    confirmRef.result.then((result) => {
      product.status = EProductStatus.Deleted;
      let promiseAddress = () => Promise.all([
        this.service.deleteProduct(product).toPromise()
      ]);
      promiseAddress().then(() => this.loadData());
    }, (reason) => {});
  }

  onPageChanged(value){
    this.currentQuery.pageIndex = value;
    this.getCatalog(this.currentQuery);
  }

  get Object(){
    return window.Object;
  }

  getCategories(){
    this.service.getCategories().subscribe({
      next: res => this.categories = res
    })
  }
  
  getBrands(){
    this.service.getBrands().subscribe({
      next: brands => this.brands = brands
    })
  }

}

class SearchFormGroup extends FormGroup{
  constructor(
    controls: { [key: string]: AbstractControl },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
      super(controls, validatorOrOpts, asyncValidator)
  }

  get idControll():FormControl{
    return this.get('id') as FormControl;
  }

  get categoryIdControl():FormControl{
    return this.get('categoryId') as FormControl;
  }

  get brandIdControl():FormControl{
    return this.get('brandId') as FormControl;
  }

  get minPrice():FormControl{
    return this.get('minPrice') as FormControl;
  }

  get maxPrice():FormControl{
    return this.get('maxPrice') as FormControl;
  }
}
