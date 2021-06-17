import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var displayFixedPopup: any;

@Component({
  selector: 'app-terr-units',
  templateUrl: './terr-units.component.html',
  styleUrls: ['./terr-units.component.scss']
})
export class TerrUnitsComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  @Input('selectedTerritory') selectedTerritory: any;
  @Input('currentPlayer') currentPlayer: any;
  @Input('superpowersData') superpowersData: any;
  @Input('gameObj') gameObj: any;
  @Input('ableToTakeThisTurn') ableToTakeThisTurn: any;
  @Input('user') user: any;

  constructor() { super(); }

  ngOnInit(): void {
  }

  ngStyleUnitTop(status) {
    if (status == 'Purchase')
      return { 'max-width': '40px', 'max-height': '30px' };
    else
      return { 'max-width': '100px', 'max-height': '60px' };
  }
  switchOwnership(nation: number) {
    if (this.selectedTerritory.nation == 99 && this.selectedTerritory.owner != nation && this.ableToTakeThisTurn) {
      this.playClick();
      this.selectedTerritory.owner = nation;
      //this.closeModal('#territoryPopup');
      this.messageEvent.emit('switch');
    }

  }
}
