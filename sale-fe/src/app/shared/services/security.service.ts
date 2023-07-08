import {StorageService} from './storage.service';
import {from, Observable, Subject} from 'rxjs';
import {ConfigurationService} from './configuration.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {IAuthorizeRequest} from '../models/authorizeRequest.model';
import {map, tap} from 'rxjs/operators';
import {IRegistingRequest} from '../models/registingCustomerRequest.model';
import {ICustomer} from "../models/customer.model";
import {environment} from "../../../environments/environment";
import {KeycloakService} from "keycloak-angular";
import {KeycloakLoginOptions, KeycloakProfile} from "keycloak-js";

@Injectable({
  providedIn: 'root'
})
export class SecurityService extends KeycloakService {
  private headers: HttpHeaders;
  private storage;
  public UserData$: Subject<ICustomer> = new Subject<ICustomer>();
  public userData!:ICustomer;

  constructor(
      private _http: HttpClient,
      private _router: Router,
      private route: ActivatedRoute,
      private configurationService: ConfigurationService,
      private _storageService: StorageService,
  ) {
    super();
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.storage = _storageService;
  }

  public override login(option?: KeycloakLoginOptions): Promise<void> {
    return super.login(option).then(value => {
      this.getUserProfile().subscribe(user => {
        this.UserData$.next(user);
        this.userData = user;
      })
    });
  }

  public GoToLoginPage() {
    this._router.navigate(['/sign-in']);
  }

  public Authorize(authorizedRequest: IAuthorizeRequest) {
    const url = `${environment.API_HOST}/api/authenticate/login`;
    this._http.post(url, JSON.stringify(authorizedRequest), this.setHeaders()).pipe<IAuthorizeResponseSuccess>(
        tap((res: any) => {
          return res;
        })
    ).subscribe({
      next: res => {

      },
      error: err => {
        alert("wrong input!!!");
      }
    });
  }


  public HandleError(error: any) {
    console.log(error);
    if (error.status == 403) {
      alert('Forrbiden');
    } else if (error.status == 401) {
      alert('Unauthorized');
    }
  }


  private urlBase64Decode(str: string) {
    let output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }
    return window.atob(output);
  }

  private getDataFromToken(token: any) {
    let data = {};

    if (typeof token !== 'undefined') {
      let encoded = token.split('.')[1];
      data = JSON.parse(this.urlBase64Decode(encoded));
    }
    return data;
  }

  public getUserProfile(): Observable<ICustomer> {
    return from(this.loadUserProfile()).pipe(map<KeycloakProfile, ICustomer>(value => {
      return {
        id: value.id!,
        email: value.email!,
        name: value.lastName!,
        phoneNumber: value.email!,
        address: []
      }
    }))
  }

  getUser(userId: number): Observable<ICustomer> {
    return this._http.get(`${environment.API_HOST}/api/customers/${userId}`)
        .pipe<ICustomer>(tap((res: any) => {
          return res
        }));
  }

  private setHeaders(): any {
    console.log("set header");
    const httpOptions = {
      headers: new HttpHeaders()
    }

    httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
    httpOptions.headers = httpOptions.headers.set('Accept', 'application/json');

    const token = this.GetToken();

    if(token !== ''){
      httpOptions.headers = httpOptions.headers.set('Authorization', `Bearer ${token}`);
    }
    return httpOptions;
  }

  GetToken(): any {
    return this.storage.retrieve('accessToken');
  }

  public Register(registingRequest: IRegistingRequest){
    const url = `${environment.API_HOST}api/authenticate/register`;
    console.log(registingRequest, url);
    this._http.post(url, JSON.stringify(registingRequest), this.setHeaders()).pipe<IAuthorizeResponseSuccess>(
      tap((res:any)=>{
          return res;
      })
    ).subscribe({
      next: res=>{
          window.alert("success!!!");
      },
      error: err => window.alert("user is already exists")
    })
  }

}

/*
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDkzMTQyMTMyMSIsImp0aSI6IjEwNDA4OTFiLTViYzctNDc1Ny04YjU1LTM5ZjVhZDM1MjY2NyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNjE5NjkyMjUwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDEiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAifQ.1cSfNAlyR-E-AkC69DpQkRGCgFPK2srw9Dha2KVt150",
    "expiration": "2021-04-29T10:30:50Z",
    "refreshToken": "bcbb0ca0-3d68-47ac-b6e1-92bdf638b768"
}
*/

interface IAuthorizeResponseSuccess {
  token: string,
  refreshToken: string,
  expiration: string
}
