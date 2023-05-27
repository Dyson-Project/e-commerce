import {StorageService} from './storage.service';
import {Subject, Observable} from 'rxjs';
import {ConfigurationService} from './configuration.service';
import {error} from 'protractor';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {encode} from 'node:punycode';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
class SecurityService {
  private actionUrl!: string;
  private headers: HttpHeaders;
  private storage: StorageService;
  private authenticationSource = new Subject<boolean>();
  authenticationChallenge$ = this.authenticationSource.asObservable();
  private authorityUrl = '';

  public UserData: any;
  public IsAuthorized!: boolean;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute,
    private _configurationService: ConfigurationService,
    private _storageService: StorageService
  ) {
    console.log('constructor');
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.storage = _storageService;

    this._configurationService.settingLoaded$.subscribe(x => {
      this.authorityUrl = this._configurationService.serverSettings.identityUrl;
      this.storage.store('IdentityUrl', this.authorityUrl);
    });
    if (this.storage.retrieve('IsAuthorized') !== '') {
      this.IsAuthorized = this.storage.retrieve('IsAuthorized');
      this.authenticationSource.next(true);
      this.UserData = this.storage.retrieve('userData');
    }
  }

  public GetToken(): any {
    return this.storage.retrieve('authorizationData');
  }

  public ResetAuthorizationData() {
    this.storage.store('authorizationData', '');
    this.storage.store('authorizationDataIdToken', '');

    this.IsAuthorized = false;
    this.storage.store('IsAuthorized', false);
  }

  public SetAuthorizationData(token: any, idToken: any) {
    if (this.storage.retrieve('authorizationData') !== '') {
      this.storage.store('authorizationData', '');
    }

    this.storage.store('authorizationData', token);
    this.storage.store('authorizationDataIdToken', idToken);
    this.IsAuthorized = true;
    this.storage.store('IsAuthorized', true);

    // TODO: replace for get user data
    this.UserData = this.storage.retrieve('userData');
    //   this.getUserData()
    //     .subscribe(data => {
    //       this.UserData = data;
    //       this.storage.store('userData', data);
    //       //emit observable
    //       this.authenticationSource.next(true);
    //       window.location.href = location.origin;
    //     },
    //       error => this.HandleError(error),
    //       () => {
    //         console.log(this.UserData);
    //       });
  }

  public Authorize() {
    this.ResetAuthorizationData();
    let authorizationUrl = this.authorityUrl + '/connect/authorize';
    let client_id = 'js';
    let redirect_uri = location.origin + '/';
    let response_type = 'id_token token';
    let scope = 'openid profile orders cart webshoppingagg orders.signalrhub';
    let nonce = 'N' + Math.random() + '' + Date.now();
    let state = Date.now() + '' + Math.random();

    this.storage.store('authStateControl', state);
    this.storage.store('authNonce', nonce);

    let url =
      authorizationUrl + '?' +
      'response_type=' + encodeURI(response_type) + '&' +
      'client_id=' + encodeURI(client_id) + '&' +
      'redirect_uri=' + encodeURI(redirect_uri) + '&' +
      'scope=' + encodeURI(scope) + '&' +
      'nonce=' + encodeURI(nonce) + '&' +
      'state=' + encodeURI(state);
    console.log(url);

    window.location.href = url;
  }

  public AuthorizedCallBack() {
    this.ResetAuthorizationData();

    let hash = window.location.hash.substr(1);

    /**
     *  result = {
     *  token: "tokenblabla",
     *  id_token: "id_token.dataobjectEncoded",
     *  state: "state df"
     * }
     */
    let result: any = hash.split('&').reduce(function (result: any, item: string) {
      let parts = item.split('=');
      result[parts[0]] = parts[1];
      return result;
    }, {});

    console.log(result);

    let token = '';
    let id_token = '';
    let authResponseIsValid = false;

    if (!result.error) {
      // TODO: DO FOR AUTHORIZATION
      // if (result.state !== this.storage.retrieve('authStateControl')) {
      //   console.log('AuthorizedCallbacl incorrect state');
      // } else {
      token = result.access_token;
      id_token = result.id_token;

      // let dataIdToken: any = this.getDataFromToken(id_token);

      // if (dataIdToken.nonce !== this.storage.retrieve('authNonce')) {
      //   console.log('AuthorizedCallback incorrect nonce');
      // } else {
      this.storage.store('authNonce', '');
      this.storage.store('authStateControl', '');

      authResponseIsValid = true;
      console.log("AuthorizedCallback")
      // }
      // }
    }

    if (authResponseIsValid) {
      this.SetAuthorizationData(token, id_token);
    }
  }

  public Logoff() {
    let authorizationUrl = this.authorityUrl + '/coonect/endssion';
    let id_token_hint = this.storage.retrieve('authorizationDataIdToken');
    let post_logout_redirect_uri = location.origin + '/';

    let url =
      authorizationUrl + '?' +
      'id_token_hint=' + encodeURI(id_token_hint) + '&' +
      'post_logout_redirect_uri=' + encodeURI(post_logout_redirect_uri);

    this.ResetAuthorizationData();

    this.authenticationSource.next(false);
    window.location.href = url;
  }

  public HandleError(error: any) {
    console.log(error);
    if (error.status == 403) {
      this._router.navigate(['/Forbidden']);
    } else if (error.status == 401) {
      this._router.navigate(['/Unauthorized']);
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
      /**
       * data = {
       * nonce: "45534534543543"
       * }
       */
      data = JSON.parse(this.urlBase64Decode(encoded));
    }
    return data;
  }

  private getUserData = (): Observable<string[]> => {
    if (this.authorityUrl === '') {
      this.authorityUrl = this.storage.retrieve('IdentityUrl');
    }

    /**
     * options = {
     * headers: "HttpHeaders()"
     * }
     */
    const options = this.setHeaders();

    return this._http.get<string[]>(`${this.authorityUrl}/connect/userinfo`, options)
      .pipe<string[]>((info: any) => info);
  }

  private setHeaders(): any {
    console.log("set header");
    const httpOptions = {
      headers: new HttpHeaders()
    }

    httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
    httpOptions.headers = httpOptions.headers.set('Accept', 'application/json');

    const token = this.GetToken();

    if (token !== '') {
      httpOptions.headers = httpOptions.headers.set('Authorization', `Bearer tokensercurity${token}`);
    }
    return httpOptions;
  }

}
