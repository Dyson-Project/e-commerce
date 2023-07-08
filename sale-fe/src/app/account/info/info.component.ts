import {ICustomer} from '../../shared/models/customer.model';
import {AccountService} from '../account.service';
import {ConfigurationService} from '../../shared/services/configuration.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class ProfileComponent implements OnInit {
  profile?: ICustomer;
  isLoaded: boolean = false;
  changePasswordForm: FormGroup;

  constructor(
    private service: AccountService,
    private configurationService: ConfigurationService,
    private modalService: NgbModal,
  ) {
    this.changePasswordForm = new FormGroup({
      oldPwd: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      newPwd: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmNewPwd: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ])
    })
  }

  ngOnInit() {
      this.loadData();
  }

  loadData() {
    this.getProfile();
    this.changePasswordForm = new FormGroup({
      oldPwd: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      newPwd: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmNewPwd: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ])
    })
  }

  // checkConfirmPwd() {
  //   if (this.changePasswordForm.get('confirmNewPwd').value != this.changePasswordForm.get('newPwd').value) {
  //     this.changePasswordForm.controls.confirmNewPwd.setErrors({
  //       ...this.changePasswordForm.get('confirmNewPwd').errors,
  //       'incorrectPassword': true
  //     });
  //   } else {
  //     this.changePasswordForm.controls['confirmNewPwd'].setErrors(null);
  //   }
  // }

  // checkCorrectNewPassword(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: boolean } | null => {
  //     let newPwd = control.parent.get('newPwd').value;
  //     return control.value === newPwd ? { 'incorrect': true } : null;
  //   }
  // }

  getProfile() {
    console.log('load data');
    this.service.getProfile().subscribe({
      next: profile => {
        this.profile = profile;
        console.log(this.profile);
      },
      complete: () => {
        this.isLoaded = true;
      }
    })
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'change-pwd'}).result.then((result) => {
      if (this.changePasswordForm.status === 'VALID') {
        this.service.updatePassword(this.oldPwd?.value, this.newPwd?.value);
        console.log('update passwod success');
      }
    }, (reason) => {
    });
  }

  modifyProfile() {
    console.log(this.profile);
    this.service.updateProfile(this.profile).subscribe({
      next: res => {

      },
      complete: () => {
        this.loadData();
      }
    })
  }

  get oldPwd() {
    return this.changePasswordForm.get('oldPwd');
  }

  get newPwd() {
    return this.changePasswordForm.get('newPwd');
  }

  get confirmNewPwd() {
    return this.changePasswordForm.get('confirmNewPwd');
  }
}
