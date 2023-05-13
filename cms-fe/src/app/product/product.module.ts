import { SharedModule } from '../shared/shared.module';
import { ProductComponent } from './product.component';
import { ProductListService } from '../product-list/product-list.service';
import { ProductService } from './product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
      BrowserModule,
    CKEditorModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [ProductService],
})
export class ProductModule {}