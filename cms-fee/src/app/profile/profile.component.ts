import { DataService } from '../shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ISellerAccount } from '../shared/models/seller.model';
import { SecurityService } from '../shared/services/security.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { IAddress } from '../shared/models/address.model';
import { ProfileService } from './profile.service';
import { Observable, Subscription } from 'rxjs';
import { promise } from 'protractor';
import { ConfirmModelComponent } from '../shared/components/confirm-model/confirm-model.component';
import { Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  authSubscription: Subscription;
  authenticated: boolean;
  selectedTab: string = 'address';
  user:ISellerAccount;
  addressForm: FormGroup;
  address1s: any[] = [];
  constructor(
    private service:ProfileService,
    private configurationService:ConfigurationService,
    private securityService: SecurityService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    if (this.configurationService.isReady) {
      this.loadData();
    } else {
      this.configurationService.settingLoaded$.subscribe(x => {
        this.loadData();
      })
    }

  }

  loadData() {
    console.log("load data");
    // load user
    this.service.getUser(this.securityService.UserData.id).subscribe({
      next: res => {
        this.user = res;
        console.log(this.user);
      }
    });
  }

  changeTab(tab:string){
    this.selectedTab = tab;
  }

  loadAddressForm(address?: IAddress) {
    if (address) {
      this.addressForm = new FormGroup({
        street: new FormControl(address.street, [Validators.required]),
        address1: new FormControl(address.address1, [Validators.required]),
        address2: new FormControl(address.address2, [Validators.required]),
        address3: new FormControl(address.address3, [Validators.required]),
        isDefault: new FormControl(address.isDefault),
        sellerId: new FormControl(address.sellerId),
        id: new FormControl(address.id)
      })
    } else {
      this.addressForm = new FormGroup({
        street: new FormControl('', [Validators.required]),
        address1: new FormControl('', [Validators.required]),
        address2: new FormControl('', [Validators.required]),
        address3: new FormControl('', [Validators.required]),
        isDefault: new FormControl(false),
        sellerId: new FormControl(this.securityService.UserData.id),
        id: new FormControl(0)
      })
    }
  }

  async setAsDefault(addressId: number) {
    let oldDefault = this.user.address.find(address => address.isDefault);
    let newDefault = this.user.address.find(address => address.id == addressId);
    if (oldDefault) {
      oldDefault.isDefault = false;
      await this.service.updateAddress(oldDefault).toPromise();
    }
    newDefault.isDefault = true;
    await this.service.updateAddress(newDefault).toPromise();
  }

  openAddressForm(content, address?:IAddress) {
    this.loadAddressList();
    this.loadAddressForm(address);

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      let promiseAddress = () => Promise.all([
        this.saveAddress().toPromise()
      ]);
      promiseAddress().then(() => this.loadData());
    }, (reason) => { });
  }

  loadAddressList(){
    this.service.getAddressList().subscribe({
      next: res=>{
        this.address1s = res.data;
      }
    })
  }

  saveAddress():Observable<any>{
    this.addressForm.markAllAsTouched();
    if(this.addressForm.invalid){
      alert("check your input");
      return null;
    }
    if(!this.addressForm.value.id){
      return this.service.createNewAddress(this.addressForm.value);
    } else {
      return this.service.updateAddress(this.addressForm.value); 
    }
  }

  deleteAddress(addressId: number) {
    let modalRef = this.modalService.open(ConfirmModelComponent);
    modalRef.componentInstance.message = "Delete this address?";
    modalRef.result.then((result) => {
      let promiseDelete = () => Promise.all([
        this.service.deleteAddress(addressId).toPromise()
      ])
      promiseDelete().then(() => this.loadData());
    }, (reason) => {});
  }

  get address2s():any[]{
    let selectedAddress1 = this.addressForm.get('address1').value;
    let address2s = null;
   for(let addressObj of this.address1s){
    if(addressObj.name == selectedAddress1){
      address2s = addressObj.level2s;
    }
   } 
    return address2s;
  }

  get address3s(){
    let selectedAddress2 = this.addressForm.get('address2').value;
    let address3s = null;
    this.address2s.forEach(addressObj=>{
      if(addressObj.name == selectedAddress2){
        address3s = addressObj.level3s;
      }
    })
    return address3s;
  }
}
