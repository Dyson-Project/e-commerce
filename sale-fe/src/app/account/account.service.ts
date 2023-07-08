import {DataService} from '../shared/services/data.service';
import {ConfigurationService} from '../shared/services/configuration.service';
import {SecurityService} from '../shared/services/security.service';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {ICustomer} from '../shared/models/customer.model';
import {Observable} from 'rxjs';
import {IOrder} from '../shared/models/order.model';
import {IAddress} from '../shared/models/address.model';
import {IPage} from '../shared/models/catalog.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  accountUrl: string = '/api/customers';
  purchaseUrl: string = "";
  addressUrl: string = '/api/address';
  orderUrl: string = '/api/orders';

  constructor(
    private service: DataService,
    private configurationService: ConfigurationService,
    private securityService: SecurityService
  ) {
  }

  getAddress(): Observable<IAddress[]> {
    let url = this.addressUrl + '?customerId=' + this.securityService.userData.id;
    return this.service.get(url).pipe<IAddress[]>(tap((res: any) => {
      return res;
    }));
  }

  getAddressList() {
    let url = window.location.origin + '/assets/address.json';
    return this.service.get(url).pipe<any>(tap((res: any) => {
      return res.data;
    }))
  }

  createNewAddress(address: IAddress) {
    let url = this.addressUrl;
    return this.service.post(url, address).pipe<boolean>(tap((res: any) => {
      console.log(res);
      return res;
    }));
  }

  updateAddress(address: IAddress): Observable<boolean> {
    let url = this.purchaseUrl + '/api/address/' + address.id;
    return this.service.put(url, address).pipe<boolean>(tap((res: any) => {
      return res;
    }));
  }

  deleteAddress(id: string): Observable<boolean> {
    let url = this.addressUrl + '/' + id;
    this.service.delete(url);
    return new Observable((observer) => {
      observer.next(true)
    });
  }

  getProfile(): Observable<ICustomer> {
    let url = this.accountUrl + '/' + this.securityService.userData.id;
    return this.service.get(url).pipe<ICustomer>(tap((res: any) => {
      return res;
    }))
  }

  updatePassword(oldPwd: string, newPwd: string) {
    let url = this.accountUrl + '/' + this.securityService.userData.id;
    let requestChangePwd = {
      oldPwd,
      newPwd
    }
    //TODO: change password
    // return this.service.put(url, requestChangePwd).pipe<any>(tap((Res: any) => {
    // }));
  }

  updateProfile(profile?: ICustomer) {
    let url = `${this.accountUrl}/${this.securityService.userData.id}`;
    return this.service.put(url, profile).pipe<any>(tap((res: any) => {
      return res;
    }));
  }

  getOrderCatalog(params: { [param: string]: any }): Observable<IPage<IOrder>> {
    let url = `${this.orderUrl}?customerId=${this.securityService.userData.id}`;
    if (params && Object.values(params).some(value => value)) {
      url += '&';
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          url += `${key}=${value}&`;
        }
      }
      url = url.substr(0, url.lastIndexOf('&'));
    }
    return this.service.get(url, null).pipe<IPage<IOrder>>(tap((res: any) => {
      return res;
    }));
  }

  updateOrder(order: IOrder) {
    let url = this.orderUrl + '/' + order.id;
    return this.service.put(url, order).pipe<any>(tap((res: any) => {
      return res;
    }));
  }

}
