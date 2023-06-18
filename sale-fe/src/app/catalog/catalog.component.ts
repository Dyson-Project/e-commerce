import {ICategory} from '../shared/models/category.model';
import {IPage} from '../shared/models/catalog.model';
import {IPager} from '../shared/models/pager.model';
import {throwError} from 'rxjs';
import {CatalogService} from './catalog.service';
import {ConfigurationService} from '../shared/services/configuration.service';
import {Component, OnInit} from '@angular/core';
import {IProduct} from '../shared/models/product.model';
import {IBrand} from '../shared/models/brand.model';
import {EProductStatus} from '../shared/models/productStatus.const';
import numberOnly from '../shared/util/validate';

class ValueAndText {
  constructor(public Value: string, public Text: string) {
  }
}

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  numberOnly: Function = numberOnly;
  brands!: IBrand[];
  categories!: ICategory[];
  categorySelected?: number;
  brandSelected?: string;
  catalog?: IPage<IProduct>;
  paginationInfo!: IPager;
  authenticated: boolean = false;
  errorReceived: boolean = false;
  currentQuery: any = {
    page: 0,
    size: 8,
    status: EProductStatus.Active,
    productName: null,
    brandId: null,
    categoryId: null
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

  getCategories() {
    this.service.getCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  getBrands() {
    this.service.getBrands().subscribe(brands => {
      this.brands = brands;
    })
  }

  onFilterApplied(event: any) {
    this.getCatalog(this.currentQuery);
  }

  onBrandFilterChanged(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.brandSelected = value;
    this.currentQuery.brandId = value;
  }

  onCategoryFilterChanged(event: Event) {
    const value = Number((event.target as HTMLInputElement).value)
    this.categorySelected = value;
    this.currentQuery.brandId = value;
  }

  onPageChanged(value: any) {
    this.currentQuery.page = value;
    this.getCatalog(this.currentQuery);
  }

  getCatalog(params: { [param: string]: any }) {
    this.service.getCatalog(params)
      .subscribe(catalogPage => {
        console.log(catalogPage)
        this.catalog = catalogPage;
        this.paginationInfo = {
          items: catalogPage.size,
          totalItems: catalogPage.totalElements,
          totalPages: catalogPage.totalPages,
          actualPage: catalogPage.number,
        }
      })
  }

  private handleError(error: any){
    this.errorReceived = true;
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
