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
  public superpowersData: any;
  public selectedUnit: any;
  public nation = 1;
  public hideUnitDetailFlg: boolean;

  constructor() { }

  ngOnInit(): void {
    this.superpowersData = getSuperpowersData();
    this.selectedUnit = this.superpowersData.units[0];
  }

  show(unit, hideUnitDetailFlg=false) {
    if (unit.piece && unit.piece > 0)
      this.selectedUnit = this.superpowersData.units[unit.piece];
    else
      this.selectedUnit = unit;
    this.nation = unit.owner || 1;
    this.hideUnitDetailFlg = hideUnitDetailFlg;
    $("#unitDetailPopup").modal();
  }

}
