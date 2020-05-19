import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';


import { environment } from '../environments/environment';
import { stringify } from 'querystring';

const BACKEND_URL = environment.apiUrl ;

@Injectable({ providedIn: 'root' })
export class MainService {

  constructor(private http: HttpClient) {}


  getLinkData(url, siteNum){
    return this.http
    .get<{message: string; data: any}>(
      BACKEND_URL + '/getLinkData/' + encodeURIComponent(url) +'/'+ siteNum
    ).pipe(map((response: any) => {

      const movieCount = response;

      return movieCount;
    }));
  }

  getManifests() {
    return this.http.get<{ message: string; data: any}>(
      BACKEND_URL + '/getManifests').pipe(map((response: any) => {
        const manifests = response;
        return manifests;
      }));
  }

  getManifest(manifestID) {
    return this.http.get<{ message: string; data: any}>(
      BACKEND_URL + '/getManifest/'+manifestID).pipe(map((response: any) => {
        const manifest = response;
        return manifest;
      }));
  }

  getProducts(manifestID) {
    return this.http.get<{ message: string; data: any}>(
      BACKEND_URL + '/getProducts/'+manifestID).pipe(map((response: any) => {
        const products = response;
        return products;
      }));
  }
  //Not using but goot example of observable
  // updateSearchValue(searchValue: string){
  //   this.searchValue.next(searchValue);
  // }
  // getSearchValue(){
  //   return this.searchValue.asObservable();
  // }
  // getPostUpdateListener() {
  //   return this.postsUpdated.asObservable();
  // }

}
