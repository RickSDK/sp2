import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-email-popup',
  templateUrl: './email-popup.component.html',
  styleUrls: ['./email-popup.component.scss']
})
export class EmailPopupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  show() {
    $("#emailPopup").modal();
  }

}
