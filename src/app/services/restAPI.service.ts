import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
  
export class RestAPIService {
  // BASEURL = 'http://180.179.49.72:8084/TNSWREISAPI/api/';
  // BASEURL = 'https://adatwdapi.tessolve.com/api/';
  BASEURL = 'http://localhost:45407/api/';
  public HttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'Get,Post,Put,Delete,Options',
      'Access-Control-Allow-Credentials': 'true'
    })
  };
  constructor(private httpClient: HttpClient) { }

  get(url): Observable<any> {
    return this.httpClient.get(this.BASEURL + url);
  }

  post(url, obj): Observable<any> {
    return this.httpClient.post(this.BASEURL + url, obj).pipe(
      catchError(this.handleError)
    );
  }

  getByParameters(url, params): Observable<any> {
    return this.httpClient.get(this.BASEURL + url, { params: params });
  }

  put(url, obj): Observable<any> {
    return this.httpClient.put(this.BASEURL + url, obj).pipe(
      catchError(this.handleError)
    );
  }

  delete(url, value): Observable<any> {
    return this.httpClient.delete(this.BASEURL + url, value);
  }

  handleError(error) {
    return throwError(error);
  }

}
