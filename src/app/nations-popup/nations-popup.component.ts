import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-nations-popup',
  templateUrl: './nations-popup.component.html',
  styleUrls: ['./nations-popup.component.scss']
})
export class NationsPopupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  show() {
    $("#nationsPopup").modal();
  }

}
