import { ProfileComponent } from './profile.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileService } from './profile.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    SharedModule
  ],
  providers: [ProfileService],
})
export class ProfileModule { }