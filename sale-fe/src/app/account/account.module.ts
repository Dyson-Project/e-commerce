import { NgModule } from '@angular/core';

import { AccountComponent } from './account.component';
import { AccountNavComponent } from './account-nav/account-nav.component';
import { AddressComponent } from './address/address.component';
import { ProfileComponent } from './info/info.component';
import { OrderComponent } from './order/order.component';
import { SharedModule } from '../shared/shared.module';
import { AccountService } from './account.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    CommonModule,

  ],
  declarations: [
    AccountComponent,
    AccountNavComponent,
    AddressComponent,
    ProfileComponent,
    OrderComponent
  ],
  providers: [AccountService],
})
export class AccountModule {

}
