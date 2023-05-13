import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product/product.component';
import { OrderListComponent } from './order-list/order-list.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { ProfileComponent } from './profile/profile.component';
import { routing } from './app.routes';
import { ProductListModule } from './product-list/product-list.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProductModule } from './product/product.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LoginComponent } from './login/login.component';
import { OrderListModule } from './order-list/order-list.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HaNoiTowerComponent } from './ha-noi-tower/ha-noi-tower.component';
import { TaciComponent } from './taci/taci.component';
import { PrependHostPipe } from './shared/pipes/prependHost.pipe';
import { ProfileModule } from './profile/profile.module';
import { ChartsModule } from 'ng2-charts';
import { QueenPuzzleComponent } from './queen-puzzle/queen-puzzle.component';
import { RegisterComponent } from './login/register/register.component';

@NgModule({
  declarations: [										
    AppComponent,
      AnalysisComponent,
      LoginComponent,
      RegisterComponent,
      HaNoiTowerComponent,
      TaciComponent,
      QueenPuzzleComponent
   ],
  imports: [
    BrowserModule,
    routing,
    CKEditorModule,
    ChartsModule,
    ReactiveFormsModule,
    NgbModule,
    //Custom Module
    SharedModule.forRoot(),
    ProductListModule,
    DashboardModule,
    ProductModule,
    OrderListModule,
    ProfileModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
