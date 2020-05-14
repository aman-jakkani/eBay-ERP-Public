import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { observable, VirtualTimeScheduler } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";

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




  constructor(public mainService: MainService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    
    //Creating Forms
    //Form for link input
    this.form = new FormGroup({
      search: new FormControl(null, {}),
    });
    
  }


  //Stores link url
  onEnterLink(siteNum){

    //Stores url
    if (siteNum == 0) {
      this.link = this.form.value.search
      var localLink = this.form.value.search
    }

    //Resetting Forms for clarity and reuseage of site without reresh
    this.resetForms()
    
    //Gets url data
    this.getLinkData(this.link,siteNum);
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





}
