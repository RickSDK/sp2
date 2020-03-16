import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var playSound: any;
declare var isUnitGoodForForm: any;
declare var playClick: any;
declare var populateHostileMessage: any;
declare var selectAllUnits: any;
declare var checkMovement: any;
declare var checkSendButtonStatus: any;
declare var selectAllButtonChecked: any;
declare var showUnitsForMovementBG2: any;
declare var moveSelectedUnits: any;
declare var refreshBoardFromMove: any;
declare var whiteoutScreen: any;
declare var shakeScreen: any;
declare var autoButtonPressed: any;

@Component({
  selector: 'app-terr-troop-select',
  templateUrl: './terr-troop-select.component.html',
  styleUrls: ['./terr-troop-select.component.scss']
})
export class TerrTroopSelectComponent extends BaseComponent implements OnInit {
  @Input('selectedTerritory') selectedTerritory: any;
  @Input('currentPlayer') currentPlayer: any;
  @Input('superpowersData') superpowersData: any;
  @Input('gameObj') gameObj: any;
  @Input('terr') terr: any;
  @Input('optionType') optionType: any;
  @Output() messageEvent = new EventEmitter<string>();

  public productionDisplayUnits = [];
  public allyNation = 1;
  public allies = [];
  public loadingFlg = false;
  public loadPlanesFlg = false;
  public loadBoatsFlg = false;
  public hostileMessage = '';
  public moveTerr = [];
  public totalMoveTerrs = [];
  public selectedUnitForm = 0;
  public selectedFormUnit: any;
  public totalUnitsThatCanMove = 0;
  public expectedHits = 0;
  public expectedLosses = 0;
  public goButton = 'Go!';
  public checkAllTroops = false;


  constructor() { super(); }

  ngOnInit(): void {
  }/*
  selectAllUnitsForTerr(terr: any) {
   // playClick();
   // selectAllUnits(terr, this.optionType, this.currentPlayer);
    this.checkSendButtonStatus(null);
  }
  selectAllButtonChecked() {
    playClick();
    this.checkAllTroops = !this.checkAllTroops;
    selectAllButtonChecked(this.moveTerr, this.checkAllTroops, this.optionType, this.currentPlayer);
    this.checkSendButtonStatus(null);
  }
  autoButtonPressed() {
    playClick();
    autoButtonPressed(this.selectedTerritory, this.moveTerr, this.optionType, this.currentPlayer);
    this.checkSendButtonStatus(null);
  }
  checkMovement(distObj: any, unit: any, optionType: string, player:any, terr: any) {
    return checkMovement(distObj, unit, optionType, player, this.selectedTerritory);
  }
  moveTroopsButtonPressed() {
    playClick();
    if (this.optionType == 'movement') {
      var obj = moveSelectedUnits(this.moveTerr, this.selectedTerritory);
      setTimeout(() => {
        refreshBoardFromMove(this.moveTerr, this.selectedTerritory, this.gameObj, this.superpowersData, this.currentPlayer);
      }, 1000);
      if (this.moveTerr.length > 0) {
  //      this.moveSpriteBetweenTerrs(obj);
      }
    }
    if (this.optionType == 'attack') {
      this.setupAttackBoard();
      return;
    }
    if (this.optionType == 'nuke') {
      whiteoutScreen();
      playSound('tornado.mp3');
      playSound('bomb4.mp3');
    }
    if (this.optionType == 'cruise') {
      shakeScreen();
      playSound('raid.mp3');
    }
    this.closeModal('#territoryPopup');
  }
  setupAttackBoard() {
    this.optionType = 'battle';
  }
  checkSendButtonStatus(unit: any) {

    var obj = checkSendButtonStatus(unit, this.moveTerr, this.optionType, this.selectedTerritory, this.currentPlayer);
    this.expectedHits = obj.expectedHits;
    this.expectedLosses = this.selectedTerritory.expectedLosses;
    if (this.optionType == 'cruise')
      this.expectedLosses = 0;
    if (this.optionType == 'nuke')
      this.expectedLosses = obj.numNukes;
  }
*/
}
