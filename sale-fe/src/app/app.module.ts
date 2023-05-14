import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from "@angular/forms";
import {routing} from "./app.routes";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./shared/shared.module";
import {LoginModule} from "./login/login.module";
import {AccountModule} from "./account/account.module";
import {CartModule} from "./cart/cart.module";
import {CatalogModule} from "./catalog/catalog.module";
import {ProductDetailsModule} from "./product-details/productDetails.module";
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        ReactiveFormsModule,
        BrowserModule,
        NgbModule,
        ToastrModule.forRoot(),
        routing,
        HttpClientModule,
        SharedModule.forRoot(),
        AppRoutingModule,
        FontAwesomeModule,
        LoginModule,
        AccountModule,
        CartModule,
        CatalogModule,
        ProductDetailsModule,
        SlickCarouselModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
