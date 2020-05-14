import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  // movieId
  movieId: string;
  // stores movies of the current page
  movies = [];
  movie;
  movieInfomation;
  Object = Object;
  deviceInfo = null;
  chromeAlert = false;
  errorMessage= false;
  constructor(private mainService: MainService, private router: Router, private route: ActivatedRoute, private deviceService: DeviceDetectorService) { }

  ngOnInit() {
    this.checkBrowser();
    this.getMovie();
  }

  checkBrowser(){
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    console.log(this.deviceInfo);
    console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
    if ((isMobile || isTablet) && this.deviceInfo.browser != "Chrome") {
      this.chromeAlert = true;
    }
  }

  getImage(image: string) {
    return  'data:image/png;base64,' + atob(image);
  }

  getMovie() {


    const id = this.route.snapshot.paramMap.get('id');
    this.mainService.setCurrentMovie(id);

    this.mainService.getMovie(id)
    .subscribe(
      data => {
        console.log('Success in detail componenet', data.movie);
        this.movie = data.movie;
        this.movieInfomation = data.movie['movie information'];
      },
      error => console.error(error)
    );
  }

  play() {
    if (this.chromeAlert == false){
      this.router.navigate(['player']);
    } else {
      this.errorMessage = true;
    }
    
  }

}

