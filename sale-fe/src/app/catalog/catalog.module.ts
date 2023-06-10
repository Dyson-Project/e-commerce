import {CatalogComponent} from './catalog.component';
import {NgModule} from '@angular/core';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {BrowserModule} from "@angular/platform-browser";
import {SharedModule} from "../shared/shared.module";
import {CommonModule} from "@angular/common";
import {CatalogService} from "./catalog.service";

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    CommonModule,
    FontAwesomeModule
  ],
  declarations: [
    CatalogComponent
  ],
  providers: [
  ]
})
export class CatalogModule {
  constructor(library: FaIconLibrary){
    library.addIconPacks(fas);
  }
}
