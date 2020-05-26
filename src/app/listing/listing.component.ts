import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { observable, VirtualTimeScheduler } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import {Manifest} from '../models/manifest.model';
import { Product } from '../models/product.model';
import { Item } from '../models/item.model';
import { Draft } from '../models/draft.model';
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {


  //total quantity of items in auction
  manifestQuantity: number = 0;
  //total sum of prices estimated by auction
  priceTotal: number = 0;
  //Contain list of all Manifests
  manifests: Manifest[];
  //Contain items of current manifest
  items: Item[];
  //Contains current manifest
  current_manifest: Manifest;
  //products of current manifest
  products: Product[] = [];
  draft: FormGroup;
  ttInput: string;
  skuUpdated: boolean[] = [];


  constructor(public mainService: MainService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getManifests();
    //Form for link input
    this.draft = new FormGroup({
      sku: new FormControl(null, {}),
      title: new FormControl(null, {}),
      condition: new FormControl("Used", {}),
      conditionDesc: new FormControl(null, {}),
      price: new FormControl(null, {}),
    });

  }

  getManifests(){
    this.mainService.getManifests().subscribe(
      data => {
        this.manifests = data;
        this.manifests.sort((a,b) => (a.date_purchased < b.date_purchased)?1 : -1);
        this.manifests.forEach(element => {
          formatDate(element.date_purchased,'mm/DD/yyyy', 'en-US');
        });
      });
  }

  getManifestDetails(manifestID){
    //reseting vars
    this.priceTotal = 0;
    this.products = [];
    this.getManifest(manifestID);
    this.getItems(manifestID);
  }

  getManifest(manifestID){
    this.mainService.getManifest(manifestID).subscribe(
      data => {
        console.log((data));
        this.current_manifest = data;
        //Getting Quantity
        this.manifestQuantity = this.current_manifest.quantity;
      });
  }

  getItems(manifestID){
    this.mainService.getItems(manifestID).subscribe(
      data => {
        this.items = data;
        //Getting Items Total Value
        for ( var item of data){
          this.priceTotal += item.price * item.quantity;
        }
        //clearing previous products
        this.getProducts();
        // console.log("Logging products",this.products);
      });
  }

  getProducts(){

    const sleep = ms => {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    const getProduct = itemid => {
      return sleep(1000).then(v => {
        this.mainService.getProduct(itemid).subscribe(
          data => {
              console.log("getting products",data);
              this.products.push(data);
        });
      });
    }
    const loopItems = async _ => {
      for (let index = 0; index < this.items.length; index++) {
        // Get num of each fruit
        const item_id = this.items[index].id
        await getProduct(item_id);
      }
    }

    loopItems(text => console.log(text));

  }


  updateSKU(productID, newSKU){
    var itm = this.items.filter(x => x.product_id == productID);
    this.mainService.updateSKU(itm[0].id, newSKU).subscribe(data => {
      console.log(data);
    });
  }

}
