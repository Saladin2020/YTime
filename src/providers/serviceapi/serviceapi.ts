import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs";

/*
  Generated class for the ServiceapiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceapiProvider {
  BaseURL: string;
  constructor(public http: HttpClient) {
    //this.get_urlapi();
  }

  setBaseURL(urlAPI) {
    this.BaseURL = "http://" + urlAPI + "/yiapi2/v1/";
  }

  getViewNewsAll(): Observable<any> {
    return this.http.get(this.BaseURL + "news");
  }

  setLoginData(dataPost): Observable<any> {
    return this.http.post(this.BaseURL + "login", dataPost);
  }

  setScanData(dataPost): Observable<any> {
    return this.http.post(this.BaseURL + "check", dataPost);
  }

  getViewListScan(dataPost): Observable<any> {
    return this.http.post(this.BaseURL + "listuser", dataPost);
  }

  getViewStatusScan(dataPost) {
    return this.http.post(this.BaseURL + "checkstatus", dataPost);
  }

  getViewHistory(dataPost) {
    return this.http.post(this.BaseURL + "history", dataPost);
  }

  getViewDateHistory(dataPost) {
    return this.http.post(this.BaseURL + "datehistory", dataPost);
  }

  setRegister(dataPost) {
    return this.http.post(this.BaseURL + "register", dataPost);
  }

  getLocationCheck(dataPost) {
    return this.http.post(this.BaseURL + "location", dataPost);
  }
}
