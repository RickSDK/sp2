import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var getAllRanks: any;

@Component({
  selector: 'app-ranks-popup',
  templateUrl: './ranks-popup.component.html',
  styleUrls: ['./ranks-popup.component.scss']
})
export class RanksPopupComponent implements OnInit {
  public ranks = [];
  
  constructor() { }

  ngOnInit(): void {
  	this.ranks = getAllRanks();
  }
  show() {
    $("#ranksPopup").modal();
  }

}
