import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-rules-popup',
  templateUrl: './rules-popup.component.html',
  styleUrls: ['./rules-popup.component.scss']
})
export class RulesPopupComponent implements OnInit {
  public buttonIdx: number;
  public buttonList = [
    { name: 'Info', icon: 'fa-info-circle' },
    { name: 'Overview', icon: 'fa-eye' },
    { name: 'Rules', icon: 'fa-book' },
    { name: 'Nations', icon: 'fa-globe' },
    { name: 'More', icon: 'fa-plus' },
  ];
  public superpowers = ['United States', 'European Union', 'Russian Federation', 'Imperial Japan', 'Communist China', 'Middle-East Federation', 'African Coalition', 'Latin Alliance'];
  public showPageFlg = false;

  constructor() { }

  ngOnInit(): void {
  }

  show() {
    this.buttonIdx = 0;
    this.showPageFlg = true;
    $("#rulesPopup").modal();
  }
}
