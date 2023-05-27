import {Component, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SecurityService} from '../shared/services/security.service';
import {IAuthorizeRequest} from '../shared/models/authorizeRequest.model';
import {IRegistingRequest} from '../shared/models/registingCustomerRequest.model';
import {Output} from '@angular/core';
import {Input} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Form, Validators} from '@angular/forms';
import {FormControl} from '@angular/forms';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authRequest: IAuthorizeRequest | IRegistingRequest;

  authForm: FormGroup;
  registForm: FormGroup;
  isLogin: boolean = true;

  constructor(
    private router: Router,
    private sercurityService: SecurityService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.loadLoginForm();
  }

  changeAction() {
    this.isLogin = !this.isLogin;
    if (this.isLogin) {
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
    this.registForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.pattern('')]),
      password: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
      email: new FormControl(null),
      phoneNumber: new FormControl(null),
    });
  }

  login(errorModal) {
    this.authForm.markAllAsTouched();
    if (this.authForm.valid) {
      this.authRequest = {
        phone: this.usernameLogin.value,
        password: this.passwordLogin.value
      };
      this.sercurityService.Authorize(this.authRequest)
    }
  }

  signup() {
    this.authForm.markAllAsTouched();
    if (this.registForm.valid) {
      this.authRequest = {
        name: this.username.value,
        password: this.password.value,
        confirmPassword: this.confirmPassword.value,
        email: this.email.value,
        phoneNumber: this.phoneNumber.value,
      };
      this.sercurityService.Register(this.authRequest);
    } else {
      alert("wrong input")
    }
  }

  openModal(content) {
    this.modalService.open(content);
  }

  get usernameLogin(): FormControl {
    return this.authForm.get('username') as FormControl;
  }

  get passwordLogin(): FormControl {
    return this.authForm.get('password') as FormControl;
  }

  get username(): FormControl {
    return this.registForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.registForm.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.registForm.get('confirmPassword') as FormControl;
  }

  get email(): FormControl {
    return this.registForm.get('email') as FormControl;
  }

  get phoneNumber(): FormControl {
    return this.registForm.get('phoneNumber') as FormControl;
  }

}
