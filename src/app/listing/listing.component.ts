import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { observable, VirtualTimeScheduler } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import {Manifest} from '../models/manifest.model';
import { Product } from '../models/product.model';
import { Item } from '../models/item.model';
import { Draft } from '../models/draft.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {


  // total quantity of items in auction
  manifestQuantity = 0;
  // total sum of prices estimated by auction
  priceTotal = 0;
  // Contain list of all Manifests
  manifests: Manifest[];
  // Contain items of current manifest
  items: Item[];
  // Contains current manifest
  current_manifest: Manifest;
  // products of current manifest
  products: Product[] = [];
  draft: FormGroup;
  ttInput: string;
  drafts: Draft[] = [];

  constructor(public mainService: MainService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getManifests();
    // Form for link input
    this.draft = new FormGroup({
      sku: new FormControl(null, {}),
      title: new FormControl(null, {}),
      condition: new FormControl('Used', {}),
      conditionDesc: new FormControl(null, {}),
      price: new FormControl(null, {}),
    });

  }

  getManifests() {
    this.mainService.getManifests().subscribe(
      data => {
        this.manifests = data;
        this.manifests.sort((a, b) => (a.date_purchased < b.date_purchased) ? 1 : -1);
        this.manifests.forEach(element => {
          formatDate(element.date_purchased, 'mm/DD/yyyy', 'en-US');
        });
      });
  }

  getManifestDetails(manifestID) {
    // reseting vars
    this.priceTotal = 0;
    this.getManifest(manifestID);
    this.getItems(manifestID);
  }

  getManifest(manifestID) {
    this.mainService.getManifest(manifestID).subscribe(
      data => {
        console.log((data));
        this.current_manifest = data;
        // Getting Quantity
        this.manifestQuantity = this.current_manifest.quantity;
      });
  }

  getItems(manifestID) {
    this.mainService.getItems(manifestID).subscribe(
      data => {
        this.items = data;
        // Getting Items Total Value
        for ( const item of data) {
          this.priceTotal += item.price * item.quantity;
        }
        // clearing previous products
        this.getProducts();
        // console.log("Logging products",this.products);
        this.getDrafts();
        console.log('got drafts', this.drafts);
      });
  }
  getDrafts() {
    this.drafts = [];

    // anonymous async function to get drafts
    (async () => {

      for (const item of this.items) {

        const item_id = item.id;

        const one = new Promise<String>((resolve, reject) => {
          this.mainService.getDraft(item_id).subscribe(
            data => {
              this.drafts.push(data);
              resolve('Got Product!!');
          });
        });

        await one;
      }
      return 'out of loop';
    })();
  }
  getProducts() {
    this.products = [];

    // anonymous async function to get products
    (async () => {

      for (const item of this.items) {

        const item_id = item.id;

        const one = new Promise<String>((resolve, reject) => {
          this.mainService.getProduct(item_id).subscribe(
            data => {
              this.products.push(data);
              resolve('Got Product!!');
          });
        });

        await one;
      }
      return 'out of loop';
    })();



  }

  updateSKU(productID, newSKU, i) {
    // const itm = this.items.filter(x => x.product_id === productID); - if multiple items have the same the products this wouldnt work
    this.mainService.updateSKU(this.items[i].id, newSKU).subscribe(data => {
      const product: Product = data;
      console.log(data);
      this.products[i] = product;
      this.drafts[i].updated_SKU = true;
    });
  }
  updateSKUAgain(productID, newSKU, i) {
    alert('Updating your SKU may affect your tracking capabilities');
    // const itm = this.items.filter(x => x.product_id === productID);
    this.mainService.updateSKU(this.items[i], newSKU).subscribe(data => {
      const product: Product = data;
      console.log(data);
      this.products[i] = product;
      this.drafts[i].updated_SKU = true;

    });
  }
}
