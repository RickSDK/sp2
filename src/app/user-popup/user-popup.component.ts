import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.scss']
})
export class UserPopupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  show() {
    $("#userPopup").modal();
  }

}
