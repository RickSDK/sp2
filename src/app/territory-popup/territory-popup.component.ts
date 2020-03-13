import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
declare var getSelectedUnits: any;

@Component({
  selector: 'app-territory-popup',
  templateUrl: './territory-popup.component.html',
  styleUrls: ['./territory-popup.component.scss']
})
export class TerritoryPopupComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public selectedTerritory: any;
  public optionType: string;
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
  //battle board
  public displayBattle: any;
//  public displayBattle = {
  //  generalUnit: 3, hijackerUnit: 6, medicHealedCount: 1, subsDove: 1, airDefenseUnits: [], phase: 1,
    //attNation: 1, attHits: 1, attackUnits: [], defendingUnits: [], defHits: 1, defNation: 3
 // };
  public boardCols = [1, 2, 3, 4, 5];

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(terr: any, currentPlayer: any, gameObj: any, ableToTakeThisTurn: boolean, user: any) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    $("#territoryPopup").modal();
    this.selectedTerritory = terr;
    this.expectedHits = 0;
    var moveTerr = [];
    var totalUnitsThatCanMove = 0;

    this.gameObj.territories.forEach(function (terr) {
      totalUnitsThatCanMove += terr.movableTroopCount;
      if (terr.movableTroopCount > 0) {
        terr.distObj = { land: 9, air: 9, sea: 9 };
        moveTerr.push(terr);
      }
    });
    this.totalUnitsThatCanMove = totalUnitsThatCanMove;
    this.totalMoveTerrs = moveTerr;
    this.optionType = 'home';
    if (ableToTakeThisTurn && terr.treatyStatus == 4 && currentPlayer.status == 'Purchase') {
      if (this.selectedTerritory.nation == 99)
        this.changeProdType(2);
      else
        this.changeProdType(0);
      this.optionType = 'production';
    }

    console.log(terr.name, terr);



    //console.log('ableToTakeThisTurn', ableToTakeThisTurn);
    //console.log('user', user);
    //console.log('currentPlayer', currentPlayer);
  }
  moveSpriteBetweenTerrs(obj: any) {
    this.messageEvent.emit(obj);
  }
  buttonClicked(type) {
    //this event emitted from app-terr-buttons
    this.optionType = type;
    this.expectedHits = 0;
    this.hostileMessage = populateHostileMessage(type, this.selectedTerritory, this.gameObj, this.currentPlayer);
    this.loadingFlg = true;
    setTimeout(() => { this.showUnitsForMovementBG(); }, 20);
  }
  showUnitsForMovementBG() {
    var obj = showUnitsForMovementBG2(this.optionType, this.gameObj, this.currentPlayer, this.totalMoveTerrs, this.selectedTerritory);
    this.moveTerr = obj.moveTerr;
    this.totalUnitsThatCanMove = obj.totalUnitsThatCanMove;
    this.loadingFlg = false;
  }
  /*
  changeOptionType(type: string) {
    playClick();
    this.optionType = type;

    //loadPlanesButtonClicked()
    //moveButtonClicked
    //unloadPlanesButtonClicked
    //requestTargetButtonClicked
    //requestFortifyButtonClicked
    //tranferButtonClicked
    //requestTranferButtonClicked
  }*/



  selectAllUnitsForTerr(terr: any) {
    playClick();
    selectAllUnits(terr, this.optionType, this.currentPlayer);
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
    autoButtonPressed(this.selectedTerritory, this.moveTerr);
    this.checkSendButtonStatus(null);
  }
  checkMovement(distObj: any, unit: any, optionType: string) {
    return checkMovement(distObj, unit, optionType, this.currentPlayer);
  }
  moveTroopsButtonPressed() {
    playClick();
    if (this.optionType == 'movement') {
      var obj = moveSelectedUnits(this.moveTerr, this.selectedTerritory);
      setTimeout(() => {
        refreshBoardFromMove(this.moveTerr, this.selectedTerritory, this.gameObj, this.superpowersData, this.currentPlayer);
      }, 1000);
      if (this.moveTerr.length > 0) {
        this.moveSpriteBetweenTerrs(obj);
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
    this.displayBattle = {
      generalUnit: 0,
      hijackerUnit: 0,
      medicHealedCount: 0,
      subsDove: 0,
      airDefenseUnits: [],
      phase: 1,
      attNation: this.currentPlayer.nation,
      attHits: 0,
      attackUnits: [],
      defendingUnits: [],
      defHits: 0,
      defNation: this.selectedTerritory.owner,
      militaryMessage: 'do somethingX!',
    };
    var defendingUnits = [];
    this.selectedTerritory.units.forEach(unit => {
      if (unit.owner != this.currentPlayer.nation) {
        unit.dice = [];
        var numDef = unit.numDef || 1;
        for(var i=0; i<numDef; i++)
          unit.dice.push('dice.png');
        defendingUnits.push(unit);
      }
    });
    this.displayBattle.defendingUnits = defendingUnits;
    this.displayBattle.attackUnits = getSelectedUnits(this.moveTerr);
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

  changeProdType(segmentIdx: number) {
    this.segmentIdx = segmentIdx;
    this.productionDisplayUnits = [];
    if (this.selectedTerritory.nation < 99 && this.selectedTerritory.factoryCount == 0)
      return;
    if (segmentIdx == 0) { //ground
      this.productionDisplayUnits.push(this.superpowersData.units[1]);
      this.productionDisplayUnits.push(this.superpowersData.units[2]);
      this.productionDisplayUnits.push(this.superpowersData.units[3]);
      this.productionDisplayUnits.push(this.superpowersData.units[19]);
    }
    if (segmentIdx == 1) { //air
      this.productionDisplayUnits.push(this.superpowersData.units[6]);
      this.productionDisplayUnits.push(this.superpowersData.units[7]);
      this.productionDisplayUnits.push(this.superpowersData.units[13]);
      this.productionDisplayUnits.push(this.superpowersData.units[14]);
    }
    if (segmentIdx == 2) { //water
      this.productionDisplayUnits.push(this.superpowersData.units[4]);
      this.productionDisplayUnits.push(this.superpowersData.units[5]);
      this.productionDisplayUnits.push(this.superpowersData.units[8]);
      this.productionDisplayUnits.push(this.superpowersData.units[9]);
      this.productionDisplayUnits.push(this.superpowersData.units[12]);
      this.productionDisplayUnits.push(this.superpowersData.units[6]);
      this.productionDisplayUnits.push(this.superpowersData.units[13]);
    }
    if (segmentIdx == 2 || segmentIdx == 3) { //special
      var num2 = parseInt(this.currentPlayer.nation) + 19;
      this.tryThisUnit(num2);
      this.tryThisUnit(num2 + 8);
      this.tryThisUnit(num2 + 16);
      this.tryThisUnit(num2 + 24);
    }
  }
  tryThisUnit(id: number) {
    var unit = this.superpowersData.units[id];
    if (isUnitGoodForForm(this.segmentIdx, unit.type, unit.subType))
      this.productionDisplayUnits.push(unit);
  }
  ngStyleUnitTop(optionType) {
    if (optionType == 'production')
      return { 'max-width': '40px', 'max-height': '30px' };
    else
      return { 'max-width': '100px', 'max-height': '60px' };
  }

}
