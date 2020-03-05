import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-video-popup',
  templateUrl: './video-popup.component.html',
  styleUrls: ['./video-popup.component.scss']
})
export class VideoPopupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  show() {
    $("#videoPopup").modal();
  }

}
