import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm} from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSub: Subscription;
  userIsAuth: boolean;
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(){
    this.userIsAuth = this.authService.getIsAuth();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
      this.userIsAuth = authStatus;
    });
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
  onLogin(form: NgForm){
    if(form.invalid){
      return
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }
}
