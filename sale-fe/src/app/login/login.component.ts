import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../shared/services/security.service';
import { IAuthorizeRequest } from '../shared/models/authorizeRequest.model';
import { IRegistingRequest } from '../shared/models/registingCustomerRequest.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Form, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authRequest?: IAuthorizeRequest | IRegistingRequest;

  authForm: FormGroup;
  registryForm: FormGroup;
  isLogin: boolean = true;
  constructor(
    private router: Router,
    private securityService: SecurityService,
    private modalService: NgbModal
  ) {
    this.authForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.pattern('')]),
      password: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])
    });
    this.registryForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.pattern('')]),
      password: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
      email: new FormControl(null),
      phoneNumber: new FormControl(null),
    });
  }

  ngOnInit() {
    this.loadLoginForm();
  }

  changeAction() {
    this.isLogin = !this.isLogin;
    if(this.isLogin){
      this.loadLoginForm();
    } else {
      this.loadRegisterForm();
    }
  }

  loadLoginForm() {
    this.authForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.pattern('')]),
      password: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])
    });
  }

  loadRegisterForm() {
    this.registryForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.pattern('')]),
      password: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
      email: new FormControl(null),
      phoneNumber: new FormControl(null),
    });
  }

  login(errorModal: any) {
    this.authForm.markAllAsTouched();
    if (this.authForm.valid) {
      this.authRequest = {
        phone: this.usernameLogin.value,
        password: this.passwordLogin.value
      };
      this.securityService.Authorize(this.authRequest)
    }
  }

  signup() {
    this.authForm.markAllAsTouched();
    if (this.registryForm.valid) {
      this.authRequest = {
        name: this.username.value,
        password: this.password.value,
        confirmPassword: this.confirmPassword.value,
        email: this.email.value,
        phoneNumber: this.phoneNumber.value,
      };
      this.securityService.Register(this.authRequest);
    } else {
      alert("wrong input")
    }
  }

  openModal(content: any){
    this.modalService.open(content);
  }

  get usernameLogin(): FormControl {
    return this.authForm.get('username') as FormControl;
  }

  get passwordLogin(): FormControl {
    return this.authForm.get('password') as FormControl;
  }

  get username(): FormControl{
    return this.registryForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.registryForm.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.registryForm.get('confirmPassword') as FormControl;
  }

  get email(): FormControl {
    return this.registryForm.get('email') as FormControl;
  }

  get phoneNumber(): FormControl {
    return this.registryForm.get('phoneNumber') as FormControl;
  }

}
