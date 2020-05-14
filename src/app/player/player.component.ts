import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import {Router} from '@angular/router';
import {DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  // movietitle
  movieId;
  // current movie
  movie;

  id: string;
  url: SafeResourceUrl;

  constructor(private mainService: MainService, private router: Router, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    console.log('log this is player');
    this.movieId = this.mainService.getCurrentMovie();
    if (this.movieId === '') {
      this.router.navigate(['home']);
    } else {
      this.getMovie();
    }
  }

  getImage(image) {
    return  'data:image/png;base64,' + atob(image);
  }

  getMovie() {
    this.mainService.getMovie(this.movieId)
    .subscribe(
      data => {
        console.log('sucess', data);
        this.movie = data.movie;
        this.id = this.movie.Source;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.id);
      },
      error => console.error(error)
    );
  }

}
