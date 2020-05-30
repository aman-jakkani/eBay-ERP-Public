import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MainService } from '../main.service';
import {Router} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
userIsAuth = false;
form: FormGroup;
private authListenerSubs: Subscription;

constructor(public mainService: MainService, private router: Router, private authService: AuthService) {}

ngOnInit(){
  this.form = new FormGroup({
    search: new FormControl(null, {}),
  });
  this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
    this.userIsAuth = isAuth;
  });
}

ngOnDestroy(){
  this.authListenerSubs.unsubscribe();
}
onSearch(){
  var searchValue = this.form.value.search
  this.router.navigate(['home'], { queryParams: { search: searchValue } } );
}

onLogout(){
  this.authService.logout();
}






}
