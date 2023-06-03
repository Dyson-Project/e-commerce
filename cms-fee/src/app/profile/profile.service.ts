import { DataService } from '../shared/services/data.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { SecurityService } from '../shared/services/security.service';
import { ISellerAccount } from '../shared/models/seller.model';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IAddress } from '../shared/models/address.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userUrl:string='';
  private addressUrl:string='';

  constructor(
    private service: DataService,
    private configurationService: ConfigurationService,
    private securityService: SecurityService,
  ) {
    if (this.configurationService.isReady) {
      this.userUrl = this.configurationService.serverSettings.purchaseUrl + '/api/sellers'
      this.addressUrl= this.configurationService.serverSettings.purchaseUrl + '/api/sellerAddress'
    } else {
      this.configurationService.settingLoaded$.subscribe(x => {
        this.userUrl = this.configurationService.serverSettings.purchaseUrl + '/api/sellers'
      this.addressUrl= this.configurationService.serverSettings.purchaseUrl + '/api/sellerAddress'
      });
    }
  }

  getUser(userId:number):Observable<ISellerAccount>{
    return this.service.get(this.userUrl+'/'+userId).pipe<ISellerAccount>(tap((res:any)=>{return res}))
  }

  createNewAddress(address:IAddress):Observable<any>{
    return this.service.post(this.addressUrl,address);
  }

  updateAddress(address:IAddress):Observable<any>{
    let url = `${this.addressUrl}/${address.id}`
    return this.service.put(url, address);
  }

  deleteAddress(addressId:number):Observable<any>{
    let url = this.addressUrl+'/'+addressId;
    return this.service.delete(url);
  }
  
  getAddressList(){
    let url = window.location.origin + '/assets/address.json';
    return this.service.get(url).pipe<any>(tap((res: any)=>{
      return res.data;
    }))
  }
}