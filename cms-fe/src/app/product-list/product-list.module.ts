import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list.component';
import { ProductListService } from './product-list.service';
import { SharedModule } from '../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    ProductListComponent,
  ],
  imports: [ CommonModule,
    BrowserModule,
    SharedModule
  ],
  providers: [ProductListService],
})
export class ProductListModule {}