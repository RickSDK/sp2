import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { TerrButtonsComponent } from '../terr-buttons/terr-buttons.component';
import { TerrPurchaseComponent } from '../terr-purchase/terr-purchase.component';

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
declare var autoButtonPressed: any;
declare var getSelectedUnits: any;
declare var showAlertPopup: any;
declare var highlightCompleteTurnButton: any;
//battle.js
declare var highlightTheseUnits: any;
declare var playSoundForPiece: any;
declare var rollAttackDice: any;
declare var rollDefenderDice: any;
declare var removeCasualties: any;
declare var battleCompleted: any;
declare var initializeBattle: any;
declare var startBattle: any;
declare var landTheNukeBattle: any;
declare var landTheCruiseBattle: any;
//board.js
declare var checkCargoForTerr: any;
declare var isFactoryAllowedOnTerr: any;
declare var checkWaterForFactory: any;
//movement.js
declare var countNumberUnitsChecked: any;
declare var checkThisNumberBoxesForUnit: any;
declare var verifyUnitsAreLegal: any;
declare var packageSelectedUnits: any;

@Component({
  selector: 'app-territory-popup',
  templateUrl: './territory-popup.component.html',
  styleUrls: ['./territory-popup.component.scss']
})
export class TerritoryPopupComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  @Output() battleHappened = new EventEmitter<string>();
  @ViewChild(TerrButtonsComponent) terrButtonsComp: TerrButtonsComponent;
  @ViewChild(TerrPurchaseComponent) terrPurchaseComp: TerrPurchaseComponent;
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
  public selectedUnitTerr: any;
  public totalUnitsThatCanMove = 0;
  public checkAllTroops = false;
  public autoCompleteFlg = false;
  public battleAnalysisObj: any;
  public battleDelay = 1200;
  //battle board
  public displayBattle: any;
  public boardCols = [1, 2, 3, 4, 5];
  public allowFactoryFlg = true;

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(terr: any, currentPlayer: any, gameObj: any, ableToTakeThisTurn: boolean, user: any) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    $("#territoryPopup").modal();
    this.selectedTerritory = terr;
    var moveTerr = [];
    var totalUnitsThatCanMove = 0;

    this.gameObj.territories.forEach(function (terr) {
      totalUnitsThatCanMove += terr.movableTroopCount;
      if (terr.movableTroopCount > 0) {
        terr.distObj = { land: 9, air: 9, sea: 9 };
        moveTerr.push(terr);
      }
    });
    this.hostileMessage = populateHostileMessage('home', this.selectedTerritory, this.gameObj, this.currentPlayer);
    this.totalUnitsThatCanMove = totalUnitsThatCanMove;
    this.totalMoveTerrs = moveTerr;
    this.optionType = 'home';

    terr.facFlg = (terr.treatyStatus == 4 && terr.nation < 99);
    if (terr.nation == 99)
      terr.facFlg = checkWaterForFactory(terr, currentPlayer.nation, gameObj);

    if (ableToTakeThisTurn && currentPlayer.status == 'Purchase' && terr.facFlg) {
      if (this.selectedTerritory.nation == 99)
        this.changeProdType(2);
      else
        this.changeProdType(0);
      this.optionType = 'production';
    }
    this.checkSendButtonStatus(null);
    checkCargoForTerr(terr, gameObj);
    this.allowFactoryFlg = isFactoryAllowedOnTerr(terr, this.gameObj);


    console.log(terr.name, this.allowFactoryFlg, terr);

    if (this.terrButtonsComp)
      this.terrButtonsComp.initChild();
    if (this.terrPurchaseComp)
      this.terrPurchaseComp.initChild(terr);
  }
  completePurchaseButtonClicked() {
    this.battleHappened.emit('done!');
    this.closeModal('#territoryPopup');
  }
  autoCompletePressed() {
    playClick();
    this.autoCompleteFlg = !this.autoCompleteFlg;
  }
  moveSpriteFromTerrToTerr(terr1: any, terr2: any, piece: number) {
    this.moveSpriteBetweenTerrs({ t1: terr1.id, t2: terr2.id, id: piece });
  }
  moveSpriteBetweenTerrs(obj: any) {
    //{ t1: terr1.id, t2: terr2.id, id: piece }
    this.messageEvent.emit(obj);
  }
  buttonClicked(type) {
    //this event emitted from app-terr-buttons
    this.optionType = type;
    this.loadingFlg = true;
    this.checkSendButtonStatus(null);

    setTimeout(() => {
      this.showUnitsForMovementBG();
    }, 30);
    //    }
  }
  showUnitsForMovementBG() {
    var obj = showUnitsForMovementBG2(this.optionType, this.gameObj, this.currentPlayer, this.totalMoveTerrs, this.selectedTerritory);
    this.moveTerr = obj.moveTerr;
    this.totalUnitsThatCanMove = obj.totalUnitsThatCanMove;
    this.loadingFlg = false;
    this.checkSendButtonStatus(null);
  }

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
    if (this.optionType == 'attack')
      this.moveTroopsButtonPressed();
  }
  autoButtonPressed() {
    playClick();
    autoButtonPressed(this.selectedTerritory, this.moveTerr, this.optionType, this.currentPlayer);
    this.checkSendButtonStatus(null);
    if (this.optionType == 'attack')
      this.moveTroopsButtonPressed();
  }
  checkMovement(distObj: any, unit: any, optionType: string, player: any, terr: any) {
    return checkMovement(distObj, unit, optionType, player, this.selectedTerritory);
  }
  moveTroopsButtonPressed() {
    if (this.user.rank==0 && this.gameObj.round==1 && this.selectedTerritory.id == 62) { //ukraine
      var attackUnits = getSelectedUnits(this.moveTerr);
      if (attackUnits.length < 8) {
        showAlertPopup('Go ahead and select all your troops for this battle.', 1);
        return;
      }
    }
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
      var attackUnits = getSelectedUnits(this.moveTerr);
      if (verifyUnitsAreLegal(attackUnits)) {
        this.displayBattle = initializeBattle(this.currentPlayer, this.selectedTerritory, attackUnits, this.gameObj);
        this.optionType = 'battle';
        playSoundForPiece(this.displayBattle.militaryObj.pieceId, this.superpowersData);
      }
      return;
    }
    if (this.optionType == 'nuke') {
      var obj = packageSelectedUnits(this.moveTerr, this.selectedTerritory);
      var attackUnits = getSelectedUnits(this.moveTerr);
      this.landTheNuke(obj.t1, attackUnits, this.selectedTerritory, this.moveTerr, this.currentPlayer, this.gameObj, this.superpowersData);
    }
    if (this.optionType == 'cruise') {
      playSound('raid.mp3');
      var obj = packageSelectedUnits(this.moveTerr, this.selectedTerritory);
      var attackUnits = getSelectedUnits(this.moveTerr);
      this.landTheCruise(obj.t1, attackUnits, this.selectedTerritory, this.currentPlayer, this.gameObj, this.superpowersData);
    }
    this.closeModal('#territoryPopup');
  }

  landTheNuke(fromTerrId: number, attackUnits: any, targetTerr: any, launchTerritories: any, player: any, gameObj: any, superpowersData: any) {
    var obj = { t1: fromTerrId, t2: targetTerr.id, id: 14, nukeFlg: true };
    this.moveSpriteBetweenTerrs(obj);
    landTheNukeBattle(player, targetTerr, attackUnits, gameObj, superpowersData, launchTerritories);
  }
  landTheCruise(fromTerrId: number, attackUnits: any, targetTerr: any, player: any, gameObj: any, superpowersData: any) {
    var obj = { t1: fromTerrId, t2: targetTerr.id, id: 144, cruiseFlg: true };
    this.moveSpriteBetweenTerrs(obj);
    landTheCruiseBattle(player, targetTerr, attackUnits, gameObj, superpowersData);
  }
  fightButtonPressed() {
    //emit 
    this.battleHappened.emit('yes');
    this.displayBattle.phase = 1;
    playSound('AirHorn.mp3');
    startBattle(this.selectedTerritory, this.currentPlayer, this.gameObj, this.superpowersData);
    this.beginNextRoundOfBattle();
  }
  beginNextRoundOfBattle() {
    if (this.displayBattle.round > 0)
      removeCasualties(this.displayBattle, this.gameObj, this.currentPlayer, false, this.superpowersData);
    this.displayBattle.round++;

    this.displayBattle.phase = 2;
    this.battleDelay = this.autoCompleteFlg ? 100 : 1200;
    playSound('9mm.mp3');
    this.changeDiceUnitsToImg(this.displayBattle.attackUnits, 'spin.gif');
    this.changeDiceUnitsToImg(this.displayBattle.defendingUnits, 'dice.png');
    setTimeout(() => {
      this.attackerRolls();
    }, this.battleDelay);
  }
  attackerRolls() {
    rollAttackDice(this.displayBattle);
    this.changeDiceUnitsToImg(this.displayBattle.defendingUnits, 'spin.gif');
    setTimeout(() => {
      this.rollDefenderDice()
    }, this.battleDelay);
  }
  rollDefenderDice() {
    rollDefenderDice(this.displayBattle, this.selectedTerritory, this.currentPlayer, this.moveTerr, this.gameObj, this.superpowersData);
    if(!this.displayBattle.militaryObj.battleInProgress) {
      this.battleHappened.emit('battle completed');
    }
 
    if (this.autoCompleteFlg) {
      if (this.displayBattle.militaryObj.battleInProgress)
        this.beginNextRoundOfBattle();
      else
        this.closeModal('#territoryPopup');
    }
    if(this.user.rank==0 && this.gameObj.round==1 && !this.displayBattle.militaryObj.battleInProgress) {
      setTimeout(() => {
        showAlertPopup('Good job! Click "Complete Turn" at the top to finish your turn.');
        highlightCompleteTurnButton();
 			}, 3500);
    }
  }
  removeCasualties() {
    playClick();
    removeCasualties(this.displayBattle, this.gameObj, this.currentPlayer, false, this.superpowersData);
    this.displayBattle.phase = 1;
  }
  changeDiceUnitsToImg(units: any, image: string) {
    units.forEach(unit => {
      for (var x = 0; x < unit.dice.length; x++) {
        unit.dice[x] = [image];
      }
    });
  }
  retreatButtonPressed() {
    playSound('Scream.mp3');
    this.displayBattle.militaryObj.battleInProgress = false;
    this.displayBattle.militaryObj.endPhrase = ' Attacker retreated.';
    battleCompleted(this.displayBattle, this.selectedTerritory, this.currentPlayer, this.moveTerr, this.gameObj, this.superpowersData);
    this.closeModal('#territoryPopup');
  }
  addMoreButtonClicked() {
    playClick();
    this.optionType = 'attack';
    setTimeout(() => {
      highlightTheseUnits(this.moveTerr, this.displayBattle.attackUnits);
      this.checkSendButtonStatus(null);
    }, 250);
  }
  fightButtonClass() {
    if (this.displayBattle && this.displayBattle.militaryObj && this.displayBattle.militaryObj.allowAttackFlg)
      return 'btn btn-danger roundButton glowRed';
    else
      return 'btn btn-danger roundButton';
  }
  checkSendButtonStatus(unit: any, terr = null) {
    this.battleAnalysisObj = checkSendButtonStatus(unit, this.moveTerr, this.optionType, this.selectedTerritory, this.currentPlayer, this.gameObj);
    this.selectedUnitTerr = { piece: 1, terrId: 1, max: 0, count: 0 };
    if (terr) {
      var obj = countNumberUnitsChecked(terr, unit, this.currentPlayer);
      this.selectedUnitTerr = { piece: unit.piece, terrId: terr.id, max: obj.max, count: obj.count };
    }
  }
  checkboxAmountOfUnit(num: number, terr: any) {
    this.selectedUnitTerr.count = num;
    checkThisNumberBoxesForUnit(this.selectedUnitTerr.piece, num, terr);
    this.battleAnalysisObj = checkSendButtonStatus(null, this.moveTerr, this.optionType, this.selectedTerritory, this.currentPlayer, this.gameObj);
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
