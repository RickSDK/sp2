import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var playClick: any;
declare var allowHostileAct: any;
declare var refreshTerritory: any;

@Component({
  selector: 'app-terr-buttons',
  templateUrl: './terr-buttons.component.html',
  styleUrls: ['./terr-buttons.component.scss']
})
export class TerrButtonsComponent implements OnInit {
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

  constructor() { }

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
    this.selectedTerritory.requestTransfer=this.currentPlayer.nation;
  }
  tranferConfirmButtonClicked() {
    playClick();
    this.selectedTerritory.owner=this.allyNation;
    this.initChild();
    refreshTerritory(this.selectedTerritory, this.gameObj, this.currentPlayer, this.superpowersData, this.currentPlayer);
  }
  requestFortifyButtonClicked() {
    playClick();
    this.selectedTerritory.requestedHotSpot=this.currentPlayer.nation;
  }
  requestTargetButtonClicked() {
    playClick();
    this.selectedTerritory.requestedTarget=this.currentPlayer.nation;
  }
}
