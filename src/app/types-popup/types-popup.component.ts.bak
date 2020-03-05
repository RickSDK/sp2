import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var getGameTypesObj: any;

@Component({
  selector: 'app-types-popup',
  templateUrl: './types-popup.component.html',
  styleUrls: ['./types-popup.component.scss']
})
export class TypesPopupComponent implements OnInit {
  public gameTypes1 = [];
  public gameTypes2 = [];
  public gameTypes3 = [];
  
  constructor() { }

  ngOnInit(): void {
  	this.gameTypes1 = getGameTypesObj(false, 1);
  	this.gameTypes2 = getGameTypesObj(false, 2);
  	this.gameTypes3 = getGameTypesObj(false, 3);
  }
  show() {
    $("#typesPopup").modal();
  }

}
