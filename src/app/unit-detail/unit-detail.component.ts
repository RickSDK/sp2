import { Component, OnInit, Input } from '@angular/core';

declare var ngUnitSrc: any;
declare var getSuperpowersData: any;

@Component({
  selector: 'app-unit-detail',
  templateUrl: './unit-detail.component.html',
  styleUrls: ['./unit-detail.component.scss']
})
export class UnitDetailComponent implements OnInit {
    @Input('selectedUnit') selectedUnit:any;
    @Input('nation') nation:string;
    @Input('hideUnitDetailFlg') hideUnitDetailFlg:boolean;

  public unit:any;
  public superpowersData:any;
  public typeIcon = 'fa-truck';
  public typeTitle = 'Land';
  public buttonList = [
  	{name: 'Land', icon: 'fa-truck', title: 'Land'},
  	{name: 'Air', icon: 'fa-fighter-jet', title: 'Air'},
  	{name: 'Sea', icon: 'fa-anchor', title: 'Sea'},
  	{name: 'Sp1', icon: 'fa-star', title: 'Special'},
  	{name: 'Sp2', icon: 'fa-star'},
  	{name: 'Sp3', icon: 'fa-star'},
  	{name: 'Sp4', icon: 'fa-star'},
  	];

  constructor() { console.log('constructor');  }

  ngOnInit(): void {
 //   this.superpowersData = getSuperpowersData();
//    this.selectedUnit = this.superpowersData.units[1];
  }
  ngUnitSrc(piece) {
  	return ngUnitSrc(piece, this.nation);
  }
}
