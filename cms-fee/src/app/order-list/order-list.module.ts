import { OrderListComponent } from './order-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Browser } from 'selenium-webdriver';
import { OrderListService } from './order-list.service';
import { SharedModule } from '../shared/shared.module';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [OrderListComponent, OrderDetailComponent],
  imports: [
    CommonModule,
    BrowserModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [OrderListService],
})
export class OrderListModule {}