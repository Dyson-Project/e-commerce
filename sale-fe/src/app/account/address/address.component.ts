import {Component, OnInit} from '@angular/core';
import {AccountService} from '../account.service';
import {SecurityService} from '../../shared/services/security.service';
import {ConfigurationService} from '../../shared/services/configuration.service';
import {ICustomer} from '../../shared/models/customer.model';
import {IAddressJson1, IAddressJson2, IAddressJson3} from '../../shared/models/addressJson.model';
import {Observable} from 'rxjs';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal/confirm-modal.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {IAddress} from 'src/app/shared/models/address.model';


interface ICurrentAddress {
  level1_id: any,
  id: any,
  customerId: any,
  street: any,
  name: any,
  type: any,
  level2s: any,
  address2: IAddressJson2,
  address3: IAddressJson3
}

@Component({
  selector: 'cutomer-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  address: IAddress[] = [];
  currentAddress?: ICurrentAddress;
  addressList: IAddressJson1[] = [];
  user?: ICustomer;
  addressForm: FormGroup;
  address1s: any[] = [];

  constructor(
    private configurationService: ConfigurationService,
    private securityService: SecurityService,
    private service: AccountService,
    private modalService: NgbModal) {
    this.addressForm = new FormGroup({
      street: new FormControl('', [Validators.required]),
      address1: new FormControl('', [Validators.required]),
      address2: new FormControl('', [Validators.required]),
      address3: new FormControl('', [Validators.required]),
      isDefault: new FormControl(false),
      customerId: new FormControl(''),
      id: new FormControl(0)
    })
  }

  ngOnInit() {
  }


  loadAddressForm(address?: IAddress) {
    this.securityService.UserData$.subscribe({
      next: user => {
        if (address) {

          this.addressForm = new FormGroup({
            street: new FormControl(address.street, [Validators.required]),
            address1: new FormControl(address.address1, [Validators.required]),
            address2: new FormControl(address.address2, [Validators.required]),
            address3: new FormControl(address.address3, [Validators.required]),
            isDefault: new FormControl(address.isDefault),
            customerId: new FormControl(user.id),
            id: new FormControl(address.id)
          })
          console.log(this.addressForm);
        } else {
          this.addressForm = new FormGroup({
            street: new FormControl('', [Validators.required]),
            address1: new FormControl('', [Validators.required]),
            address2: new FormControl('', [Validators.required]),
            address3: new FormControl('', [Validators.required]),
            isDefault: new FormControl(false),
            customerId: new FormControl(user.id),
            id: new FormControl(0)
          })
        }

      }
    })
  }

  async setAsDefault(addressId: number) {
    if (this.user) {
      let oldDefault = this.user.address.find(address => address.isDefault);
      let newDefault = this.user.address.find(address => address.id == addressId);
      if (oldDefault) {
        oldDefault.isDefault = false;
        await this.service.updateAddress(oldDefault).toPromise();
      }
      if (newDefault) {
        newDefault.isDefault = true;
        await this.service.updateAddress(newDefault).toPromise();
      }
    }
  }

  openAddressForm(content: any, address?: IAddress) {
    this.loadAddressList();
    this.loadAddressForm(address);

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      let promiseAddress = () => Promise.all([
        this.saveAddress().toPromise()
      ]);
      promiseAddress().then(() => {
      });
    }, (reason) => {
    });
  }

  loadAddressList() {
    this.service.getAddressList().subscribe({
      next: res => {
        this.address1s = res.data;
      }
    })
  }

  saveAddress(): Observable<any> {
    if (this.addressForm.invalid) {
      alert("check your input");
      return new Observable();
    }
    if (!this.addressForm.value.id) {
      return this.service.createNewAddress(this.addressForm.value);
    } else {
      return this.service.updateAddress(this.addressForm.value);
    }
  }

  deleteAddress(addressId: any) {
    let modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = "Delete this address?";
    modalRef.result.then((result) => {
      this.service.deleteAddress(addressId).toPromise();
    }, (reason) => {
    });
  }

  get address2s(): any[] {
    let selectedAddress1 = this.addressForm.get('address1')?.value;
    let address2s = null;
    for (let addressObj of this.address1s) {
      if (addressObj.name == selectedAddress1) {
        address2s = addressObj.level2s;
      }
    }
    return address2s;
  }

  get address3s() {
    let selectedAddress2 = this.addressForm.get('address2')?.value;
    let address3s = null;
    this.address2s.forEach(addressObj => {
      if (addressObj.name == selectedAddress2) {
        address3s = addressObj.level3s;
      }
    })
    return address3s;
  }
}
