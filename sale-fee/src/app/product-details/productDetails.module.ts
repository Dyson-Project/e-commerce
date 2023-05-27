import {SharedModule} from '../shared/shared.module';
import {ProductDetailsComponent} from './product-details.component';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ProductDetailService} from './productDetails.service';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbCarousel} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    CommonModule,
    FontAwesomeModule,
    SlickCarouselModule,
    NgbCarouselModule
  ],
  declarations: [ProductDetailsComponent],
  providers: [ProductDetailService]
})
export class ProductDetailsModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
