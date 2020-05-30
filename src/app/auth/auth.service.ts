import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, retry, catchError  } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { stringify } from '@angular/compiler/src/util';
import { analyzeAndValidateNgModules } from '@angular/compiler';

import { AuthData } from "./auth-data.model";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl ;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuth = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuth;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post(BACKEND_URL+'/users/signup', authData).subscribe(() => {
      this.router.navigate(['/login']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number}>(BACKEND_URL+'/users/login', authData).subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        const expiration = response.expiresIn;
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, expiration * 1000);
        this.isAuth = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/home']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });

  }

  logout(){
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
    clearTimeout(this.tokenTimer);
  }
}
