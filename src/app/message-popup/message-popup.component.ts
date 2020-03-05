import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.scss']
})
export class MessagePopupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  show() {
    $("#messagePopup").modal();
  }

}
