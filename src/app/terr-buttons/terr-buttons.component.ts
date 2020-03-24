import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var playClick: any;
declare var allowHostileAct: any;
declare var refreshTerritory: any;
declare var transferControlOfTerr: any;
declare var $: any;

@Component({
  selector: 'app-terr-buttons',
  templateUrl: './terr-buttons.component.html',
  styleUrls: ['./terr-buttons.component.scss']
})
export class TerrButtonsComponent extends BaseComponent implements OnInit {
  @Input('selectedTerritory') selectedTerritory: any;
  @Input('currentPlayer') currentPlayer: any;
  @Input('superpowersData') superpowersData: any;
  @Input('gameObj') gameObj: any;
  @Input('user') user: any;
  @Input('ableToTakeThisTurn') ableToTakeThisTurn: any;
  @Input('optionType') optionType: any;
  @Input('hostileMessage') hostileMessage: any;

  @Output() messageEvent = new EventEmitter<string>();

  public allyNation = 1;
  public infoFlg = false;
  public loadingFlg = false;
  public allies = [];
  public secondaryIndex = 0;
  public allyIndex = 0;
  public showAlliesButtonsFlg = false;
  public showAlliesButtonsIdx = 0;

  constructor() { super(); }

  ngOnInit(): void {
  }
  initChild() {
    this.allyNation = 1;
    this.showAlliesButtonsFlg = false;
    this.secondaryIndex = 0;
    this.showAlliesButtonsIdx = 0;
  }
  changeOptionType(type: string) {
    playClick();
    if (allowHostileAct(type, this.selectedTerritory, this.currentPlayer, this.gameObj)) {
      this.optionType = type;
      this.messageEvent.emit(type);
    }
  }
  changeIndex(num: number) {
    this.secondaryIndex = num;
  }
  alliesInfoButtonClicked() {
    if (this.showAlliesButtonsIdx == this.selectedTerritory.id)
      this.showAlliesButtonsIdx = 0;
    else
      this.showAlliesButtonsIdx = this.selectedTerritory.id;
    this.secondaryIndex = 0;
    if (this.currentPlayer.allies.length > 0) {
      this.allyIndex = 0;
      this.allyNation = this.currentPlayer.allies[0];
      this.showAlliesButtonsFlg = !this.showAlliesButtonsFlg;
    }
  }
  cycleAllies() {
    this.allyIndex++;
    if (this.allyIndex >= this.currentPlayer.allies.length)
      this.allyIndex = 0;
    this.allyNation = this.currentPlayer.allies[this.allyIndex];
  }
  requestTranferConfirmButtonClicked() {
    playClick();
    this.selectedTerritory.requestTransfer = this.currentPlayer.nation;
    //   $('#territoryPopup').modal('toggle');
  }
  tranferConfirmButtonClicked() {
    playClick();
    transferControlOfTerr(this.selectedTerritory, this.allyNation, this.gameObj, false);
    this.initChild();
    refreshTerritory(this.selectedTerritory, this.gameObj, this.currentPlayer, this.superpowersData, this.currentPlayer);
    $('#territoryPopup').modal('toggle');
  }
  requestFortifyButtonClicked() {
    playClick();
    this.selectedTerritory.requestedHotSpot = this.allyNation;
    //   $('#territoryPopup').modal('toggle');
  }
  requestTargetButtonClicked() {
    playClick();
    this.selectedTerritory.requestedTarget = this.allyNation;
    //    $('#territoryPopup').modal('toggle');
  }
  unloadAllParatroopers() {
    playClick();
    this.selectedTerritory.units.forEach(unit => {
      if (unit.cargoOf > 0)
        unit.cargoOf = 0;
      if (unit.cargo && unit.cargo.length > 0) {
        unit.cargo = [];
        unit.cargoUnits = 0;
      }
    });
    this.selectedTerritory.paratrooperCount = 0;
  }
}
