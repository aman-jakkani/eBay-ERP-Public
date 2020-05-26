import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, retry, catchError  } from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

import { Manifest } from "./models/manifest.model";
import { Item } from "./models/item.model";


import { environment } from '../environments/environment';
import { Product } from './models/product.model';
import { stringify } from '@angular/compiler/src/util';
import { analyzeAndValidateNgModules } from '@angular/compiler';

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

  getItems(manifestID) {
    return this.http.get<{ message: string; items: any}>(
      BACKEND_URL + '/getItems/'+manifestID)
      .pipe(map((itemData) => {
        var items: Item[] = itemData.items.map ( item =>{
          let itemData: Item = {
            id: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            model: item.model,
            grade: item.grade,
            manifest_id: item.manifest_id
          };
          return itemData;
        });
          return items;
      })).pipe(catchError(this.handleError));
  }

  getProduct(itemID){
    return this.http.get<{ message: string; product: any}>(
      BACKEND_URL + '/getProduct/'+itemID).pipe(map((productData) => {
        return{
          id: productData.product._id,
          sku: productData.product.sku,
          quantity_sold: productData.product.quantity_sold,
          prices_sold: productData.product.prices_sold,
          item_ids: productData.product.item_ids
        }
      })).pipe(catchError(this.handleError)
    );
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

  updateSKU(itemID, newSKU){
    return this.http.get<{message: string; data: any}>(
      BACKEND_URL + '/updateSKU/'+itemID+'/'+encodeURIComponent(newSKU)).pipe(map((response: any) => {
        const updatedItem = response;
        return updatedItem;
      }));

  }
}
