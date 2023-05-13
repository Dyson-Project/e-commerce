import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { routes, routing } from './app.routes';
import { SharedModule } from './shared/shared.module';
import { CatalogModule } from './catalog/catalog.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductDetailsModule } from './product-details/productDetails.module';
import { CartModule } from './cart/cart.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { LoginModule } from './login/login.module';
import { AccountModule } from './account/account.module';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent
   ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    BrowserModule,
    NgbModule,
    ToastrModule.forRoot(),
    routing,
    HttpClientModule,
    // TODO: T_T
    SharedModule.forRoot(),
    FontAwesomeModule,
    SlickCarouselModule,
    CatalogModule,
    ProductDetailsModule,
    CartModule,
    LoginModule,
    AccountModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
   constructor(library: FaIconLibrary){
    library.addIconPacks(fas);
   }
}
