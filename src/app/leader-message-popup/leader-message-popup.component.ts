import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-leader-message-popup',
  templateUrl: './leader-message-popup.component.html',
  styleUrls: ['./leader-message-popup.component.scss']
})
export class LeaderMessagePopupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  show() {
    $("#leaderMessagePopup").modal();
  }

}
