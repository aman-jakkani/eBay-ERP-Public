import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { observable, VirtualTimeScheduler } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import {Manifest} from '../models/manifest.model';
import { Product } from '../models/product.model';
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  //total quantity of items in auction
  manifestQuantity: number = 0;
  //total sum of prices estimated by auction
  priceTotal: number = 0;
  //Contain list of all Manifests
  manifests: Manifest[];
  //Contain products of current manifest
  products: Product[];
  //Contains current manifest
  current_manifest: Manifest;



  constructor(public mainService: MainService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getManifests();

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
      },
      error => console.error(error)
    );
  }

  getManifestDetails(manifestID){
    this.getManifest(manifestID);
    this.getProducts(manifestID);
  }

  getManifest(manifestID){
    this.mainService.getManifest(manifestID).subscribe(
      data => {
        console.log((data));
        this.current_manifest = data;
        //Getting Quantity
        this.manifestQuantity = this.current_manifest.quantity;
      },
      error => console.error(error)
    );
  }

  getProducts(manifestID){
    this.mainService.getProducts(manifestID).subscribe(
      data => {
        console.log((data));
        this.products = data;
        //Getting Products Total Value
        for ( var product of data){
          this.priceTotal += product.price * product.quantity;
        }
      },
      error => console.error(error)
    );
  }

}
