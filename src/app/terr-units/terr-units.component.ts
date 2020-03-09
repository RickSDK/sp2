import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-terr-units',
  templateUrl: './terr-units.component.html',
  styleUrls: ['./terr-units.component.scss']
})
export class TerrUnitsComponent extends BaseComponent implements OnInit {
  @Input('selectedTerritory') selectedTerritory: any;
  @Input('currentPlayer') currentPlayer: any;
  @Input('superpowersData') superpowersData: any;
  @Input('gameObj') gameObj: any;
  @Input('user') user: any;

  public infoFlg = false;
  public unitDetailFlg = false;

  constructor() { super(); }

  ngOnInit(): void {
  }
  ngStyleUnitTop(optionType) {
    if (optionType == 'production')
      return { 'max-width': '40px', 'max-height': '30px' };
    else
      return { 'max-width': '100px', 'max-height': '60px' };
  }
}
