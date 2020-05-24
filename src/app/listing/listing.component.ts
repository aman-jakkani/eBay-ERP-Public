import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { observable, VirtualTimeScheduler } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import {Manifest} from '../models/manifest.model';
import { Product } from '../models/product.model';
import { Item } from '../models/item.model';
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
    this.onValueChanges();
  }

  onValueChanges(): void {
    this.draft.get('title').valueChanges.subscribe(val => {
      console.log(val);
      this.ttInput = val;

    })
  }
  getManifests(){
    this.mainService.getManifests().subscribe(
      data => {
        console.log((data));
        this.manifests = data;
        this.manifests.sort((a,b) => (a.date_purchased < b.date_purchased)?1 : -1);
        this.manifests.forEach(element => {
          formatDate(element.date_purchased,'mm/DD/yyyy', 'en-US');
        });
      });
  }

  getManifestDetails(manifestID){
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
        console.log((data));
        this.items = data;
        //Getting Items Total Value
        for ( var item of data){
          this.priceTotal += item.price * item.quantity;
        }
        //clearing previous products
        this.getProducts(data);
        console.log("Logging products",this.products);


      });
  }

  getProducts(data){
    for (var item of data){
      this.mainService.getProduct(item.id).subscribe(
        data => {
          this.products.push(data);
        }
      );
    }
  }

}
