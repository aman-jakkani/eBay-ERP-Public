import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, retry, catchError  } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { stringify } from '@angular/compiler/src/util';
import { analyzeAndValidateNgModules } from '@angular/compiler';

import { AuthData } from "./auth-data.model";
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl ;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuth = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient) {}

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
    this.http.post(BACKEND_URL+'/users/signup', authData).subscribe(response => {
      console.log(response);
    });
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string}>(BACKEND_URL+'/users/login', authData).subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        this.isAuth = true;
        this.authStatusListener.next(true);
      }
    });
  }

  logout(){
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
  }
}
