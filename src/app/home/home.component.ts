import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { observable, VirtualTimeScheduler } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import {Manifest} from '../models/manifest.model';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //url from user
  link = "";
  //search form
  form: FormGroup;
  //user input forms
  linkData ;
  //keys from data
  datakeys = [];
  //total quantity of items in auction
  quantityTotal = 0;
  //total sum of prices estimated by auction
  priceTotal = 0;
  //Used to populate dynamic form prices
  uniqueItemCount = 0;
  //manifest array
  manifests: Manifest[];
  products: Product[];
  current_manifest: Manifest;



  constructor(public mainService: MainService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.getManifests();
  }


  resetForms(){
    //Clearing Form
    this.form.reset();
    this.priceTotal = 0;
    this.quantityTotal = 0;

  }

  getLinkData(url,siteNum) {
    this.mainService.getLinkData(url,siteNum)
    .subscribe(
      data => {
        //Logging data received
        console.log((data));

        //Getting only auction data
        this.linkData = data.data;//how to parse for future reference JSON.parse(data.data);

        //Storing keys from auction data
        this.datakeys = Object.keys(this.linkData).sort();

        //Geting number of forms to make
        this.uniqueItemCount = Object.keys(this.linkData).length;

        for(let key in data.data) {
          //aggrating quantity and price
          this.quantityTotal += data.data[key]["Quantity"]
          this.priceTotal += data.data[key]["Price"] * data.data[key]["Quantity"]
        };
      },
      error => console.error(error)
    );
  }

  getManifests(){
    this.mainService.getManifests().subscribe(
      data => {
        console.log((data));
        this.manifests = data;
      },
      error => console.error(error)
    );
  }

  getManifest(manifestID){
    this.mainService.getManifest(manifestID).subscribe(
      data => {
        console.log((data));
        this.current_manifest = data;

      },
      error => console.error(error)
    );
    this.mainService.getProducts(manifestID).subscribe(
      data => {
        console.log((data));
        this.products = data;

      },
      error => console.error(error)
    );
  }


}
