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
  private userId: string;

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

  getUserId(){
    return this.userId;
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
    this.http.post<{token: string, expiresIn: number, userID: string}>(BACKEND_URL + '/users/login', authData).subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        const expiration = response.expiresIn;
        this.setAuthTimer(expiration);
        this.isAuth = true;
        this.userId = response.userID;
        this.authStatusListener.next(true);
        const now = new Date();
        const expires = new Date(now.getTime() + expiration * 1000);
        this.saveAuthData(token, expires, this.userId);
        this.router.navigate(['/home']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });

  }

  autoAuthUser(){
    const authInfo = this.getAuthData();
    if(!authInfo){ return; }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuth = true;
      this.userId = authInfo.userId;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  logout(){
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.router.navigate(['/login']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem('userId');
  }
  private getAuthData(){
    const token = localStorage.getItem("token");
    const expires = localStorage.getItem("expiration");
    const userId = localStorage.getItem('userId');
    if(!token || !expires ) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expires),
      userId: userId,
    }
  }
  private setAuthTimer(duration){
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

}
