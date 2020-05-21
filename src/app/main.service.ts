import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, retry, catchError  } from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

import { Manifest } from "./models/manifest.model";


import { environment } from '../environments/environment';
import { Product } from './models/product.model';

const BACKEND_URL = environment.apiUrl ;

@Injectable({ providedIn: 'root' })
export class MainService {

  

  constructor(private http: HttpClient) {}

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
    } else {
        // server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  getManifests() {
    return this.http.get<{ message: string; manifests: any}>(
      BACKEND_URL + '/getManifests')
      .pipe(map((manifestData) => {
        var manifests:Manifest[] = manifestData.manifests.map ( manifest =>{
           let manifestData: Manifest = {
            id: manifest._id,
            auction_title: manifest.auction_title,
            auction_id: manifest.auction_id,
            transaction_id: manifest.transaction_id,
            quantity: manifest.quantity,
            total_price: manifest.total_price,
            date_purchased: manifest.date_purchased,
            status: manifest.status
          };
          return manifestData;
        });
        return manifests;
      })).pipe(catchError(this.handleError));

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

      )).pipe(catchError(this.handleError));
  }

  getProducts(manifestID) {
    return this.http.get<{ message: string; products: any}>(
      BACKEND_URL + '/getProducts/'+manifestID)
      .pipe(map((productData) => {
        var products: Product[] = productData.products.map ( product =>{
          let productData: Product = {
            id: product._id,
            title: product.title,
            quantity: product.quantity,
            price: product.price,
            model: product.model,
            grade: product.grade,
            manifest_id: product.manifest_id
          };
          return productData;
        });
          return products;
      })).pipe(catchError(this.handleError));
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
