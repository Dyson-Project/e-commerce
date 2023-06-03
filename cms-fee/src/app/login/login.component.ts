import { IAuthorizeRequest } from '../shared/models/authorizeRequest.model';
import { SecurityService } from '../shared/services/security.service';
import { RegisterComponent } from './register/register.component';
import { EventEmitter } from 'protractor';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authRequest: IAuthorizeRequest;
  authForm: FormGroup;
  constructor(
    private router: Router,
    private sercurityService: SecurityService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    // this.getAccessToken(this.authRequest);
    this.authForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.pattern('')]),
      password: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])
    });
  }

  // public getAccessToken(authRequest){
  //   let resp = this.service.generateToken(authRequest);
  //   resp.subscribe(data => this.accessApi(data));
  // }

  // public accessApi(token){
  //   let resp = this.service.welcome(token);
  //   resp.subscribe(data => {
  //     this.response = data;
  //     console.log(this.response);
  //   });
  // }

  loginn() {
    this.authForm.markAllAsTouched();
    if (this.authForm.valid) {
      this.authRequest = {
        phone: this.username.value,
        password: this.password.value
      };
      this.sercurityService.Authorize(this.authRequest)
    } else {
      alert("wrong input");
    }
  }

  openModal(content){
    this.modalService.open(content);
  }

  get username(): FormControl {
    return this.authForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.authForm.get('password') as FormControl;
  }
}
