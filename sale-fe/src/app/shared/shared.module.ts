import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Identity } from './components/identity/identity.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UppercasePipe } from './pipes/uppercase.pipe';
import { Header } from './components/header/header.component';
import { DataService } from './services/data.service';
import { SecurityService } from './services/security.service';
import { ConfigurationService } from './services/configuration.service';
import { StorageService } from './services/storage.service';
import { Pager } from './components/pager/pager.component';
import { CartWrapperService } from './services/cart.wrapper.service';
import { ModalComponent } from './components/modal/modal.component';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrependHostPipe } from './pipes/prependHost.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FontAwesomeModule
  ],
  declarations: [
    Pager,
    Header,
    Identity,
    PageNotFoundComponent,
    ModalComponent,
    UppercasePipe,
    PrependHostPipe
  ],
  exports: [
    //Module
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    //Providers
    Pager,
    Header,
    Identity,
    PageNotFoundComponent,
    ModalComponent,
    UppercasePipe,
    PrependHostPipe
  ]
})
export class SharedModule {
   constructor(library: FaIconLibrary){
    library.addIconPacks(fas);
   }
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        DataService,
        SecurityService,
        ConfigurationService,
        StorageService,
        // SignalrService,
        CartWrapperService,
        Pager
      ]
    };
  }
}
