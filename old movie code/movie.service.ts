//ignore this file!

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';


import { environment } from '../environments/environment';
import { stringify } from 'querystring';

const BACKEND_URL = environment.apiUrl ;

export class MainService{
  constructor(private http: HttpClient) {}
  private currentMovieId = '';
  private searchValue = new Subject<string>();
setCurrentMovie(movieId: string) {
  console.log('setting movieId', movieId);
  this.currentMovieId = movieId;
}
getCurrentMovie() {
  return this.currentMovieId;
}

getMovies(page: number) {
  return this.http
    .get<{ message: string; movies: any }>(
      BACKEND_URL + '/getMovies/' + page.toString()
    ).pipe(map((response: any) => {

      const movies = response;

      return movies;
    }));
}

getMoviesSearch(searchTerms: string){
  return this.http
    .get<{ message: string; movies: any }>(
      BACKEND_URL + '/getMoviesSearch/' + searchTerms
    ).pipe(map((response: any) => {

      const movies = response;

      return movies;
    }));
}
getMovie(movieId: string) {
  return this.http
  .get<{ message: string; movie: any }>(
    BACKEND_URL + '/getMovie/' + movieId
  ).pipe(map((response: any) => {
    const movie = response;
    console.log('Success in get movie', movie);
    return movie;
  }));
}

getMovieCount() {
  return this.http
    .get<{ message: string; movies: any }>(
      BACKEND_URL + '/getMovieCount/'
    ).pipe(map((response: any) => {

      const movieCount = response;

      return movieCount;
    }));
}
}
