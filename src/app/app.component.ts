import { Component, OnInit } from '@angular/core';
import{Router, NavigationEnd} from '@angular/router';
import { AuthService } from './auth/auth.service';



//declare gives Angular app access to ga function
declare let gtag: Function;
declare let ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit{
  title = 'angularGoogleAnalytics';

  constructor(public router: Router, private authService: AuthService){

    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){

        console.log(event.urlAfterRedirects);
        gtag('config', 'UA-96184893-1', {'page_path': event.urlAfterRedirects});


      }
    })
  }

  ngOnInit(){
    this.authService.autoAuthUser();
  }
}
