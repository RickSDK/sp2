import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var ngUnitSrc: any;
declare var getSuperpowersData: any;

@Component({
  selector: 'app-unit-detail-popup',
  templateUrl: './unit-detail-popup.component.html',
  styleUrls: ['./unit-detail-popup.component.scss']
})
export class UnitDetailPopupComponent implements OnInit {
  public unit:any;
  public selectedUnit:any;
  public superpowersData:any;
  public typeIcon = 'fa-truck';
  public typeTitle = 'Land';
  public nation=1;
  public piece=1;
  public buttonList = [
  	{name: 'Land', icon: 'fa-truck', title: 'Land'},
  	{name: 'Air', icon: 'fa-fighter-jet', title: 'Air'},
  	{name: 'Sea', icon: 'fa-anchor', title: 'Sea'},
  	{name: 'Sp1', icon: 'fa-star', title: 'Special'},
  	{name: 'Sp2', icon: 'fa-star'},
  	{name: 'Sp3', icon: 'fa-star'},
  	{name: 'Sp4', icon: 'fa-star'},
  	];

  constructor() { }

  ngOnInit(): void {
    this.superpowersData = getSuperpowersData();
    this.selectedUnit = this.superpowersData.units[0];
  }
  
  show(unit) {
    this.unit = unit;
    this.nation = unit.owner;
    this.piece = unit.piece;
    this.selectedUnit = this.superpowersData.units[unit.piece];
    $("#unitDetailPopup").modal();
  }
  ngUnitSrc(piece, nation=1) {
  	return ngUnitSrc(piece, nation);
  }

}
