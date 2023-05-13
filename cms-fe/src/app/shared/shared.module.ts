import { PagerComponent } from './components/pager/pager.component';
import { HeaderComponent } from './components/header/header.component';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UppercasePipe } from './pipes/uppercase.pipe';
import { DataService } from './services/data.service';
import { SecurityService } from './services/security.service';
import { ConfigurationService } from './services/configuration.service';
import { StorageService } from './services/storage.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PrependHostPipe } from './pipes/prependHost.pipe';
import { ConfirmModelComponent } from './components/confirm-model/confirm-model.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // NgbModule,
    HttpClientModule,
    HttpClientJsonpModule,
    //new
    BrowserModule
  ],
  declarations: [
    ConfirmModelComponent,
    PagerComponent,
    HeaderComponent,
    PageNotFoundComponent,
    UppercasePipe,
    NavbarComponent,
    PrependHostPipe
  ],
  exports: [
    //Module
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    PagerComponent,
    PageNotFoundComponent,
    UppercasePipe,
    NavbarComponent,
    PrependHostPipe,
    HeaderComponent,
    ConfirmModelComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule>{
    return {
      ngModule: SharedModule,
      providers: [
        DataService,
        SecurityService,
        ConfigurationService,
        StorageService
      ]
    }
  }
}
