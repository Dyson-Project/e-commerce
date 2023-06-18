import {StorageService} from './storage.service';
import {Observable, Subject} from 'rxjs';
import {ConfigurationService} from './configuration.service';
// import { error } from 'protractor';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
// import { encode } from 'node:punycode';
import {IAuthorizeRequest} from '../models/authorizeRequest.model';
import {tap} from 'rxjs/operators';
// import { RSA_NO_PADDING } from 'node:constants';
import {IRegistingRequest} from '../models/registingCustomerRequest.model';
import {ICustomer} from "../models/customer.model";

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private actionUrl!: string;
  private headers: HttpHeaders;
  private authenticationSource = new Subject<boolean>();
  authenticationChallenge$ = this.authenticationSource.asObservable();
  private identityUrl = '';
  private storage;

  public UserData!: ICustomer;
  public IsAuthorized!: boolean;
  constructor(
    private _http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute,
    private configurationService: ConfigurationService,
    private _storageService: StorageService,
  ) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.storage = _storageService;

    this.configurationService.settingLoaded$.subscribe(serverConfig => {
      this.identityUrl = serverConfig.identityUrl;
      this.storage.store('identityUrl', this.identityUrl);
    });

    if (this.storage.retrieve('isAuthorized') !== '') {
      this.IsAuthorized = this.storage.retrieve('isAuthorized');
      this.UserData = this.storage.retrieve('userData');
      this.authenticationSource.next(true);
      console.log(this.UserData);
    }
  }

  public GoToLoginPage(){
    this._router.navigate(['/sign-in']);
  }

  public Authorize(authorizedRequest: IAuthorizeRequest){
    this.ResetAuthorizationData();
    const url = this.identityUrl.endsWith('/') ? this.identityUrl : `${this.identityUrl}/api/authenticate/login`;
    console.log(authorizedRequest, url);
    this._http.post(url, JSON.stringify(authorizedRequest), this.setHeaders()).pipe<IAuthorizeResponseSuccess>(
      tap((res: any) => {
          return res;
      })
    ).subscribe({
      next: res => {
        if(res.token){
          this.SetAuthorizationData(res.token, res.refreshToken);
        }
      },
      error: err=>{
        alert("wrong input!!!");
      }
    });
  }

  public SetAuthorizationData(token: any, idToken: any) {
    this.storage.store('accessToken', token);
    this.storage.store('refreshToken', idToken);
    this.IsAuthorized = true;
    this.storage.store('isAuthorized', true);

    // TODO: replace for get user data
    // this.UserData = this.storage.retrieve('userData');
    let tokenData: any = this.getDataFromToken(token);
    this.getUserData()
      .pipe<ICustomer>(tap((res: any) => res))
      .subscribe({
        next: data => {
          this.UserData = data;
          this.storage.store('userData', data);
          //emit observable
          this.authenticationSource.next(true);
          window.location.href = location.origin;
        },
        error: this.HandleError
      });
  }

  public Logoff() {
    this.ResetAuthorizationData();
    this.authenticationSource.next(false);
    window.location.href = location.origin;
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
      /*
{
"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "0931421322",
  "jti": "26bc8655-2028-498f-8fc3-428e19db83db",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "customer",
  "exp": 1619705815,
  "iss": "http://localhost:5001",
  "aud": "http://localhost:4200"
}
       */
      data = JSON.parse(this.urlBase64Decode(encoded));
    }
    return data;
  }

  private getUserData(): Observable<ICustomer[]>{
    if(this.identityUrl === ''){
      this.identityUrl = this.storage.retrieve('IdentityUrl');
    }

    const options = this.setHeaders();

    return this._http.get<string[]>(`${this.identityUrl}/api/customers/info`, options)
    .pipe<ICustomer[]>((info:any) => info);
  }

  getUser(userId: number): Observable<ICustomer> {
    return this._http.get(this.identityUrl + '/api/customers/' + userId)
      .pipe<ICustomer>(tap((res: any) => { return res }));
  }

  private setHeaders():any {
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

  public ResetAuthorizationData() {
    this.IsAuthorized = false;
    this.storage.store('isAuthorized', this.IsAuthorized);
    this.storage.store('userData', this.UserData);
  }

  GetToken(): any {
    return this.storage.retrieve('accessToken');
  }

  public Register(registingRequest: IRegistingRequest){
    const url = this.identityUrl.endsWith('/') ? `${this.identityUrl}api/authenticate/register` : `${this.identityUrl}/api/authenticate/register`;
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
