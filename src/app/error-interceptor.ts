import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export class ErrorInterceptor implements HttpInterceptor {
  constructor(){}
  intercept(req: HttpRequest<any>, next: HttpHandler){
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        alert(err.error.message);
        return throwError(err);
      })
    );
  }
}
