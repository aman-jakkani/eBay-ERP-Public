import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Manifest } from "./models/manifest.model";


import { environment } from '../environments/environment';

const BACKEND_URL = environment.apiUrl ;

@Injectable({ providedIn: 'root' })
export class MainService {

  private manifests: Manifest[] = [];

  constructor(private http: HttpClient) {}



  getManifests() {
    return this.http.get<{ message: string; manifests: any}>(
      BACKEND_URL + '/getManifests')
      .pipe(map((manifestData) => {
        return manifestData.manifests.map ( manifest =>{
          return {
            id: manifest._id,
            auction_title: manifest.auction_title,
            auction_id: manifest.auction_id,
            transaction_id: manifest.transaction_id,
            quantity: manifest.quantity,
            total_price: manifest.total_price,
            date_purchased: manifest.date_purchased,
            status: manifest.status
          };
        });
      })).subscribe(transformedManifests =>{
        this.manifests = transformedManifests;
      });

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

  getLinkData(url, siteNum){
    return this.http
    .get<{message: string; data: any}>(
      BACKEND_URL + '/getLinkData/' + encodeURIComponent(url) +'/'+ siteNum
    ).pipe(map((response: any) => {

      const movieCount = response;

      return movieCount;
    }));
  }
}
