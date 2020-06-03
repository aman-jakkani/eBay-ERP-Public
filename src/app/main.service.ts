import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, retry, catchError  } from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

import { Manifest } from "./models/manifest.model";
import { Item } from "./models/item.model";
import { Product } from './models/product.model';
import { Draft } from './models/draft.model';

import { environment } from '../environments/environment';
import { stringify } from '@angular/compiler/src/util';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AuthData } from './auth/auth-data.model';
import { AuthService } from './auth/auth.service';

const BACKEND_URL = environment.apiUrl ;

@Injectable({ providedIn: 'root' })
export class MainService {


  constructor(private http: HttpClient, private authService: AuthService) {}

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

  getLiquidationManifests() {
    return this.http.get<{ message: string; manifests: any}>(
      BACKEND_URL + '/listing/getLiquidationManifests')
      .pipe(map((manifestData) => {
        var manifests:Manifest[] = manifestData.manifests.map ( manifest =>{
           let manifestData: Manifest = new Manifest ({
            id : manifest._id,
            auction_title : manifest.auction_title,
            auction_id : manifest.auction_id,
            transaction_id : manifest.transaction_id,
            quantity : manifest.quantity,
            total_price : manifest.total_price,
            date_purchased : manifest.date_purchased,
            status : manifest.status,
            source: manifest.source
           });
          return manifestData;
        });
        return manifests;
      })).pipe(catchError(this.handleError));
  }

  getTechManifests() {
    return this.http.get<{ message: string; manifests: any}>(
      BACKEND_URL + '/listing/getTechManifests')
      .pipe(map((manifestData) => {
        var manifests:Manifest[] = manifestData.manifests.map ( manifest =>{
           let manifestData: Manifest = new Manifest ({
            id : manifest._id,
            auction_title : manifest.auction_title,
            auction_id : manifest.auction_id,
            transaction_id : manifest.transaction_id,
            quantity : manifest.quantity,
            total_price : manifest.total_price,
            date_purchased : manifest.date_purchased,
            status : manifest.status,
            source: manifest.source
           });
          return manifestData;
        });
        return manifests;
      })).pipe(catchError(this.handleError));
  }

  getManifest(manifestID) {
    return this.http.get<{ message: string; manifest: any}>(
      BACKEND_URL + '/listing/getManifest/'+manifestID)
      .pipe(map((response) =>    {

        let manifest: Manifest = new Manifest({
          id: response.manifest._id,
          auction_title: response.manifest.auction_title,
          auction_id: response.manifest.auction_id,
          transaction_id: response.manifest.transaction_id,
          quantity: response.manifest.quantity,
          total_price: response.manifest.total_price,
          date_purchased: response.manifest.date_purchased,
          status: response.manifest.status,
          source: response.manifest.source
        });
        return manifest;
      }

      )).pipe(catchError(this.handleError));
  }

  getItems(manifestID) {
    return this.http.get<{ message: string; items: any}>(
      BACKEND_URL + '/listing/getItems/'+manifestID)
      .pipe(map((itemData) => {
        var items: Item[] = itemData.items.map ( item =>{
          let itemData: Item = new Item ({
            id: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            model: item.model,
            grade: item.grade,
            manifest_id: item.manifest_id,
            product_id: item.product_id,
            draft_id: item.draft_id
          });
          return itemData;
        });
          return items;
      })).pipe(catchError(this.handleError));
  }

  getProduct(itemID){
    return this.http.get<{ message: string; product: any}>(
      BACKEND_URL + '/listing/getProduct/'+itemID).pipe(map((productData) => {
        let product = new Product ({
          id: productData.product._id,
          sku: productData.product.sku,
          quantity_sold: productData.product.quantity_sold,
          prices_sold: productData.product.prices_sold,
          item_ids: productData.product.item_ids
        })
        return product;
      })).pipe(catchError(this.handleError));
  }
  getDraft(itemID){
    return this.http.get<{message: string; draft: any}>(
      BACKEND_URL+"/listing/getDraft/"+itemID).pipe(map((draftData) => {
        let draft = new Draft ({
          id: draftData.draft._id,
          updated_SKU: draftData.draft.updated_SKU,
          published_draft: draftData.draft.published_draft,
          listed: draftData.draft.listed,
          title: draftData.draft.title,
          condition: draftData.draft.condition,
          condition_desc: draftData.draft.condition_desc,
          price: draftData.draft.price,
          item_id: draftData.draft.item_id
        })
        return draft;
      })).pipe(catchError(this.handleError));
  }

  updateSKU(itemID, newSKU){
    return this.http.get<{message: string; product: any}>(
      BACKEND_URL + '/listing/updateSKU/'+itemID+'/'+encodeURIComponent(newSKU)).pipe(map((productData: any) => {
        let product = new Product ({
          id: productData.product._id,
          sku: productData.product.sku,
          quantity_sold: productData.product.quantity_sold,
          prices_sold: productData.product.prices_sold,
          item_ids: productData.product.item_ids
        })
        return product;
      })).pipe(catchError(this.handleError));
  }

  updateDraft(draftID, newTitle, newCondition, newDesc, newPrice){
    let url = '/listing/updateDraft/'+  "draftID:" + draftID + '/' + "newTitle:" + encodeURIComponent(newTitle)+'/'+ "newCondition:" + newCondition+'/'+ "newDesc:" + encodeURIComponent(newDesc)+'/'+ "newDesc" + "newPrice:"+ newPrice
    console.log("Service url",url)
    return this.http.get<{message: string; draft: any}>(
      BACKEND_URL+url).pipe(map((draftData: any) =>{
        let newdraft = new Draft ({
          id: draftData.draft._id,
          updated_SKU: draftData.draft.updated_SKU,
          published_draft: draftData.draft.published_draft,
          listed: draftData.draft.listed,
          title: draftData.draft.title,
          condition: draftData.draft.condition,
          condition_desc: draftData.draft.condition_desc,
          price: draftData.draft.price,
          item_id: draftData.draft.item_id
        });
        return newdraft;
      })).pipe(catchError(this.handleError));
  }

  listDraft(draftID){
    return this.http.get<{message: string; draft: any}>(
      BACKEND_URL+'/listing/listDraft/'+draftID).pipe(map((draftData: any) =>{
        let newdraft = new Draft ({
          id: draftData.draft._id,
          updated_SKU: draftData.draft.updated_SKU,
          published_draft: draftData.draft.published_draft,
          listed: draftData.draft.listed,
          title: draftData.draft.title,
          condition: draftData.draft.condition,
          condition_desc: draftData.draft.condition_desc,
          price: draftData.draft.price,
          item_id: draftData.draft.item_id
        });
        return newdraft;
      })).pipe(catchError(this.handleError));
  }

  unlistDraft(draftID){
    return this.http.get<{message: string; draft: any}>(
      BACKEND_URL+'/listing/unlistDraft/'+draftID).pipe(map((draftData: any) =>{
        let newdraft = new Draft ({
          id: draftData.draft._id,
          updated_SKU: draftData.draft.updated_SKU,
          published_draft: draftData.draft.published_draft,
          listed: draftData.draft.listed,
          title: draftData.draft.title,
          condition: draftData.draft.condition,
          condition_desc: draftData.draft.condition_desc,
          price: draftData.draft.price,
          item_id: draftData.draft.item_id
        });
        return newdraft;
      })).pipe(catchError(this.handleError));
  }

  seedUser(userId, source){
    this.http.post<{message: string}>(BACKEND_URL+'/users/seed/'+source, userId).subscribe(response => {
      console.log("user seeded");
    });
  }

  updateUserManifests(emal: string, password: string, userId, source){
    this.http.post<{message: string}>(BACKEND_URL+'/users/updateData/'+source, userId).subscribe(response => {
      console.log("user seeded");
    });
  }

  getLinkData(url, siteNum){
    return this.http
    .get<{message: string; data: any}>(
      BACKEND_URL + '/listing/getLinkData/' + encodeURIComponent(url) +'/'+ siteNum
    ).pipe(map((response: any) => {

      const movieCount = response;

      return movieCount;
    }));
  }


}
