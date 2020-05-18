import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-google-ads',
  templateUrl: './google-ads.component.html',
  styleUrls: ['./google-ads.component.scss']
})
export class GoogleAdsComponent implements AfterViewInit  {

  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    try{
      console.log('google!');

      (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
    }catch(e){
      console.error("error");
    }
  }
}
