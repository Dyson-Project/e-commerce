import { SharedModule } from '../shared/shared.module';
import { CatalogComponent } from './catalog.component';
import { CatalogService } from './catalog.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    CommonModule,
    FontAwesomeModule
  ],
  declarations: [CatalogComponent],
  providers: [CatalogService]
})
export class CatalogModule {
  constructor(library: FaIconLibrary){
    library.addIconPacks(fas);
  }
}