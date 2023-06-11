import {SecurityService} from './security.service';
import {Observable, retry, throwError} from 'rxjs';
import {Guid} from '../../../guid';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private securityService: SecurityService) {
  }

  get(url: string, param?: any): Observable<any> {
    let options = {};
    this.setHeaders(options);

    return this.http.get(url, options)
        .pipe(
            retry(1),
            catchError(this.handleError)
        );
  }

  // postWithId(url: string, data: any, params?: any): Observable<Response>{
  //   return this.doPost(url, data, true, params);
  // }

  post(url: string, data: any, params?: any): Observable<Response> {
    console.log('post', url, data);
    return this.doPost(url, data, false, params);
  }

  put(url: string, data: any, params?: any): Observable<Response> {
    return this.doPut(url, data, false, params);
  }
  putWithId(url: string, data: any, params: any): Observable<Response> {
    return this.doPut(url, data, true, params);
  }

  private doPost(url: string, data: any, needId: boolean, params?: any): Observable<Response> {
    let options = {};
    this.setHeaders(options, needId);
    console.log(data, url);
    return this.http.post<Response>(url, data, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  private doPut(url: string, data: any, needId: boolean, param?: any): Observable<Response> {
    let options = {};
    this.setHeaders(options, needId);
    console.log('do put', url ,data);
    return this.http.put<Response>(url, data, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  delete(url: string, params?: any) {
    let options = {};
    this.setHeaders(options);

    this.http.delete(url, options)
      .subscribe((res) => { console.log(res) });
  }

  private handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      console.error('Client side network error occurred:', error.error.message);
    } else {
      console.error(error);
      // console.error('Backend - ' +
      //   `status: ${error.status}, ` +
      //   `statusText: ${error.statusText}, ` +
      //   `message: ${error.error.message}`);
    }

    return throwError(error || 'server error');
  }

  private setHeaders(options: any, needId?: boolean) {
    if (needId && this.securityService) {
      options.headers = new HttpHeaders()
        // .append('Authorization', 'Bearer' + this.securityService.GetToken())
        .append('x-requestid', Guid.newGuid());
    } else if (this.securityService) {
      options.headers = new HttpHeaders()
        // .append('Authorization', 'Bearer ' + this.securityService.GetToken());
    }
  }
}
