import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CatalogComponent} from "./catalog/catalog.component";
import {ProductDetailsComponent} from "./product-details/product-details.component";
import {CartComponent} from "./cart/cart.component";
import {CheckOutComponent} from "./cart/check-out/check-out.component";
import {PaymentsuccessComponent} from "./cart/check-out/paymentsuccess/paymentsuccess.component";
import {ShippingComponent} from "./shipping/shipping.component";
import {AccountComponent} from "./account/account.component";
import {ProfileComponent} from "./account/info/info.component";
import {OrderComponent} from "./account/order/order.component";
import {PageNotFoundComponent} from "./shared/components/page-not-found/page-not-found.component";
import {AddressComponent} from "./account/address/address.component";
import {AuthGuard} from "./guard/auth.guard";

// import { ProductDetailsComponent } from './product-details/product-details.component';
// import { ShippingComponent } from './shipping/shipping.component';
// import { CatalogComponent } from './catalog/catalog.component';
// import { CartComponent } from './cart/cart.component';
// import { LoginComponent } from './login/login.component';
// import { AccountComponent } from './account/account.component';
// import { AddressComponent } from './account/address/address.component';
// import { ProfileComponent as ProfileComponent } from './account/info/info.component';
// import { OrderComponent } from './account/order/order.component';
// import { CheckOutComponent } from './cart/check-out/check-out.component';
// import { PaymentsuccessComponent } from './cart/check-out/paymentsuccess/paymentsuccess.component';
// import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {path: '*', redirectTo: ''},
  {path: '', component: CatalogComponent},
  {path: 'products/:productId', component: ProductDetailsComponent},
  {path: 'cart', component: CartComponent},
  {path: 'checkout/:id', component: CheckOutComponent},
  {path: 'paymentsuccess/:id', component: PaymentsuccessComponent},
  {path: 'shipping', component: ShippingComponent},
  // { path: 'sign-in', component: LoginComponent },
  {
    path: 'account', component: AccountComponent, children: [
      {path: 'address', component: AddressComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'orders', component: OrderComponent}
    ],
    canActivate: [AuthGuard]
  },
  // { path: 'address', component: AddressComponent },
  { path: '404', component: PageNotFoundComponent },
  {path: '**', redirectTo: '/404'}
];

export const routing = RouterModule.forRoot(routes);

@NgModule({
  imports: [routing],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
