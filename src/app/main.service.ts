import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Manifest } from "./models/manifest.model";


import { environment } from '../environments/environment';

const BACKEND_URL = environment.apiUrl ;

@Injectable({ providedIn: 'root' })
export class MainService {

  

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
      }));

  }

  getManifest(manifestID) {
    return this.http.get<{ message: string; manifest: any}>(
      BACKEND_URL + '/getManifest/'+manifestID)
      .pipe(map((response) =>    {
        
        return {
          id: response.manifest._id,
          auction_title: response.manifest.auction_title,
          auction_id: response.manifest.auction_id,
          transaction_id: response.manifest.transaction_id,
          quantity: response.manifest.quantity,
          total_price: response.manifest.total_price,
          date_purchased: response.manifest.date_purchased,
          status: response.manifest.status
        } 
      }           

      ));
  }

  getProducts(manifestID) {
    return this.http.get<{ message: string; products: any}>(
      BACKEND_URL + '/getProducts/'+manifestID)
      .pipe(map((productData) => {
        return productData.products.map ( product =>{
          return {
            id: product._id,
            title: product.title,
            quantity: product.quantity,
            price: product.price,
            model: product.model,
            grade: product.grade,
            manifest_id: product.manifest_id
          };
        });
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
