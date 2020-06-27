import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../main.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { observable, VirtualTimeScheduler, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import {Manifest} from '../models/manifest.model';
import { Product } from '../models/product.model';
import { Item } from '../models/item.model';
import { Draft } from '../models/draft.model';
import { formatDate, Location } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExternalLoginComponent } from '../ext-login/external.component';
import { stringify } from 'querystring';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { AnalysisService } from './analysis.service';
const BACKEND_URL = environment.apiUrl ;

@Component({
  selector: 'app-home',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit, OnDestroy {


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
  userIsAuth = false;
  userId: string;
  private authStatusSubs: Subscription;
  userSeeded: boolean;
  // local variable to track website
  source = 'liquidation';


  constructor(private http: HttpClient, public analysisService: AnalysisService, public mainService: MainService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getLiquidationManifests();
    this.userIsAuth = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.userIsAuth = isAuth;
    });
    this.userId = this.authService.getUserId();
    this.userSeeded = this.authService.getSeeded();
    var code = this.router.url.split('=')[1].split('&')[0];
    this.analysisService.accessEbay(code).subscribe(data => {
      console.log(data.data.access_token);
    })

  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }

  onTabChanged($event) {
    const clickedIndex = $event.index;
    if ( clickedIndex === 0) {
      this.source = 'liquidation';
      this.getLiquidationManifests();
    } else {
      this.source = 'techliquidators';
      this.getTechManifests();
    }
  }
  getLiquidationManifests() {
    this.manifests = [];
    this.mainService.getLiquidationManifests().subscribe(
      data => {
        this.manifests = data;
        this.manifests.sort((a, b) => (a.date_purchased < b.date_purchased) ? 1 : -1);
        this.manifests.forEach(element => {
          formatDate(element.date_purchased, 'mm/DD/yyyy', 'en-US');
        });
      });
  }

  getTechManifests() {
    this.manifests = [];
    this.mainService.getTechManifests().subscribe(
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
              resolve('Got Draft!!');
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

  seedUser(source: string) {
    // this.mainService.seedUser(this.userId, source);
    // this.userSeeded = true;
  }

  updateUser(source: string) {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.data = {
    //   source: source
    // };
    // const dialogRef = this.dialog.open(ExternalLoginComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(data => {
    //   this.mainService.updateUserManifests(data.username, data.password, source);
    // });

  }

}
