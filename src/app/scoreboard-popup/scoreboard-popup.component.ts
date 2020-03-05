import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-scoreboard-popup',
  templateUrl: './scoreboard-popup.component.html',
  styleUrls: ['./scoreboard-popup.component.scss']
})
export class ScoreboardPopupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  show() {
    $("#scoreboardPopup").modal();
  }

}
