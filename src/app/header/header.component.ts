import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MainService } from '../main.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

form: FormGroup;


constructor(public mainService: MainService, private router: Router) {}

ngOnInit(){
  this.form = new FormGroup({
    search: new FormControl(null, {}),
  });
}
onSearch(){
  var searchValue = this.form.value.search
  this.router.navigate(['home'], { queryParams: { search: searchValue } } );
}







}
