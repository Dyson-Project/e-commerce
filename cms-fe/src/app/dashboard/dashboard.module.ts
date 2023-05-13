import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from './dasboard.service';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    ChartsModule,
    CommonModule,
    BrowserModule,
    CKEditorModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [DashboardService],
})
export class DashboardModule {
}