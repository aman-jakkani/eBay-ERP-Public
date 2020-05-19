import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';


import { environment } from '../environments/environment';
import { stringify } from 'querystring';

const BACKEND_URL = environment.apiUrl ;

@Injectable({ providedIn: 'root' })
export class MainService {

  private currentMovieId = '';
  private searchValue = new Subject<string>();

  constructor(private http: HttpClient) {}

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

getLinkData(url, siteNum){
  return this.http
  .get<{message: string; data: any}>(
    BACKEND_URL + '/getLinkData/' + encodeURIComponent(url) +'/'+ siteNum
  ).pipe(map((response: any) => {

    const movieCount = response;

    return movieCount;
  }));
}

getManifests() {
  return this.http.get<{ message: string; data: any}>(
    BACKEND_URL + '/getManifests').pipe(map((response: any) => {
      const manifests = response;
      return manifests;
    }));
}
  //Not using but goot example of observable
  // updateSearchValue(searchValue: string){
  //   this.searchValue.next(searchValue);
  // }
  // getSearchValue(){
  //   return this.searchValue.asObservable();
  // }
  // getPostUpdateListener() {
  //   return this.postsUpdated.asObservable();
  // }

}
