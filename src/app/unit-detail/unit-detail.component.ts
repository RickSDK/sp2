import { Component, OnInit, Input } from '@angular/core';

declare var ngUnitSrc: any;

@Component({
  selector: 'app-unit-detail',
  templateUrl: './unit-detail.component.html',
  styleUrls: ['./unit-detail.component.scss']
})
export class UnitDetailComponent implements OnInit {
  @Input('selectedUnit') selectedUnit: any;
  @Input('nation') nation: string;
  @Input('hideUnitDetailFlg') hideUnitDetailFlg: boolean;

  public unit: any;
  public superpowersData: any;
  public typeIcon = 'fa-truck';
  public typeTitle = 'Land';
  public buttonList = [
    { name: 'Land', icon: 'fa-truck', title: 'Land' },
    { name: 'Air', icon: 'fa-fighter-jet', title: 'Air' },
    { name: 'Sea', icon: 'fa-anchor', title: 'Sea' },
    { name: 'Sp1', icon: 'fa-star', title: 'Special' },
    { name: 'Sp2', icon: 'fa-star' },
    { name: 'Sp3', icon: 'fa-star' },
    { name: 'Sp4', icon: 'fa-star' },
  ];


  constructor() { }

  ngOnInit(): void {
  }
  ngUnitSrc(piece) {
    return ngUnitSrc(piece, this.nation);
  }
  getTargetDesc(target) {
    if (target == 'vehicles')
      return 'Targets tanks and artillery first on offense and defense.';
    if (target == 'soldierOnly')
      return 'Can only hit soldier class units.';
    if (target == 'noplanes')
      return 'Cannot hit planes.';
    if (target == 'kamakazi')
      return 'Targets transports, planes and vehicles only.';
    if (target == 'planes')
      return 'Targets planes first, but can hit any unit.';
    if (target == 'planesTanks')
      return 'Targets planes, tanks and artillery first, but can hit any unit.';
    if (target == 'hijacker')
      return ' Targets planes and vehicles only.';
    if (this.selectedUnit.id == 13)
      return 'Planes & Choppers only.';
    if (this.selectedUnit.id == 14)
      return 'Heros are exempt.';
    return 'Targets all units.';
  }
}
