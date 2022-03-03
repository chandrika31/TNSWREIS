import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PathConstants } from '../Common-Modules/PathConstants';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  images: any[] = [];
  homeImageData: any[] = [];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  constructor(private restApiService: RestAPIService) { }

  ngOnInit(): void {
    var path = 'assets/layout/Home/Documents/';
    this.restApiService.get(PathConstants.HomePageImageUpload_Get).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.length !== 0) {
          res.forEach(i => {
            this.homeImageData.push({
              "previewImageSrc": path + i.ImageFilename,
              "alt": i.ImageTitle,
              "title": i.ImageTitle
            })
          })
        }
      }
    })
  }

  ngAfterViewInit(): void {
    this.images = this.homeImageData;
  }

 
}
