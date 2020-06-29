import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {JsonpModule, Jsonp, Response} from '@angular/http';
import { map, retry, catchError  } from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';


import { environment } from '../../environments/environment';
import { stringify } from '@angular/compiler/src/util';
import { analyzeAndValidateNgModules } from '@angular/compiler';


const BACKEND_URL = environment.apiUrl ;

@Injectable({ providedIn: 'root' })
export class AnalysisService {
  constructor(private http: HttpClient){}

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
    } else {
        // server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  accessEbay(code){
    return this.http.get<{message: string, data: any}>(BACKEND_URL+'/analysis/ebay/'+code).pipe(map(res => {
      return res;
    })).pipe(catchError(this.handleError));
  }

  accessThruRefresh(){
    return this.http.get<{message: string, data: any}>(BACKEND_URL+'/analysis/refresh').pipe(map(res => {
      return res;
    })).pipe(catchError(this.handleError));
  }


}
