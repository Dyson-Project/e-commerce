import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule, routing} from './app-routing.module';
import {AppComponent} from './app.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {LoginModule} from "./login/login.module";
import {AccountModule} from "./account/account.module";
import {CartModule} from "./cart/cart.module";
import {CatalogModule} from "./catalog/catalog.module";
import {ProductDetailsModule} from "./product-details/productDetails.module";
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {ToastrModule} from 'ngx-toastr';
import {SharedModule} from "./shared/shared.module";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {CommonModule} from "@angular/common";

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        realm: 'ecommerce',
        url: 'https://keycloak.tiktzuki.com',
        clientId: 'sale-frontend'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      }
    });
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    NgbModule,
    KeycloakAngularModule,
    ToastrModule.forRoot(),
    routing,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    FontAwesomeModule,
    LoginModule,
    AccountModule,
    CartModule,
    CatalogModule,
    ProductDetailsModule,
    SlickCarouselModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AppModule {
}
