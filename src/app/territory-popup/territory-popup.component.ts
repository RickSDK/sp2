import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
//declare var ngUnitSrc: any;
//declare var populateUnits: any;
//declare var getSuperpowersData: any;
declare var playSound: any;
declare var isUnitGoodForForm: any;
declare var getDisplayQueueFromQueue: any;
declare var playClick: any;
//declare var playerOfNation: any;
//declare var changeTreaty: any;
//declare var refreshTerritory: any;
declare var showAlertPopup: any;
//declare var popupMessage: any;
//declare var logItem: any;
//declare var displayLeaderAndAdvisorInfo: any;
declare var populateHostileMessage: any;
declare var selectAllUnits: any;
declare var checkMovement: any;
declare var checkSendButtonStatus: any;
declare var selectAllButtonChecked: any;
declare var showUnitsForMovementBG2: any;
declare var expectedHitsFromStrength: any;
declare var moveSelectedUnits: any;
declare var refreshBoardFromMove: any;

@Component({
  selector: 'app-territory-popup',
  templateUrl: './territory-popup.component.html',
  styleUrls: ['./territory-popup.component.scss']
})
export class TerritoryPopupComponent extends BaseComponent implements OnInit {
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
  public totalAttackStrength = 0;

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
        terr.distObj = {land: 9, air: 9, sea: 9};
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
  buttonClicked(type) {
    //this event emitted from app-terr-buttons
    this.optionType = type;
    this.hostileMessage = populateHostileMessage(type, this.selectedTerritory, this.gameObj, this.currentPlayer);
    this.loadingFlg=true;
    setTimeout(() => { this.showUnitsForMovementBG(); }, 20);
  }
  showUnitsForMovementBG() {
   // var obj = showUnitsForMovementBG(this.optionType, this.gameObj.units, this.currentPlayer, this.gameObj.territories, this.selectedTerritory, 'Go', this.gameObj.round, this.currentPlayer, this.optionType);
    var obj = showUnitsForMovementBG2(this.optionType, this.gameObj, this.currentPlayer, this.totalMoveTerrs, this.selectedTerritory);
    this.moveTerr = obj.moveTerr;
    this.totalUnitsThatCanMove = obj.totalUnitsThatCanMove;
    this.loadingFlg=false;
  }
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
  }
  ngStyleTerr = function (terr: any, idx: number) {
    var num = terr.nation;
    if (num > 8)
      num = 9;
    var colors = ['#ffc', '#ccf', '#ccc', '#ea0', '#fcc', '#cfc', '#ff7', '#fcf', '#fc0', '#cff'];
    // if (idx%2==1)
    // colors = ['#ffe', '#eef', '#eee', '#fb4', '#fee', '#efe', '#ffa', '#fef', '#fe0', '#eff'];
    return { 'background-color': colors[num] };
  }
  selectAllUnitsForTerr(terr: any) {
    selectAllUnits(terr, this.optionType, this.currentPlayer);
    this.checkSendButtonStatus(null);
  }
  selectAllButtonChecked() {
    this.checkAllTroops = !this.checkAllTroops;
    selectAllButtonChecked(this.moveTerr, this.checkAllTroops, this.optionType, this.currentPlayer);
    this.checkSendButtonStatus(null);
  }
  checkMovement(distObj: any, unit: any) {
    return checkMovement(distObj, unit, this.optionType, this.currentPlayer);
  }
  moveTroopsButtonPressed() {
    playClick();
    //showAlertPopup('whoa', 1);
    moveSelectedUnits(this.moveTerr, this.selectedTerritory);
    setTimeout(() => {
      refreshBoardFromMove(this.moveTerr, this.selectedTerritory, this.gameObj, this.superpowersData, this.currentPlayer);
    }, 1000);
    
    this.closeModal('#territoryPopup');
  }
  checkSendButtonStatus(unit: any) {
    this.totalAttackStrength = checkSendButtonStatus(unit, this.moveTerr, this.optionType);
    this.expectedHits = expectedHitsFromStrength(this.totalAttackStrength);
  }
  addUniToQueue(piece: number, count: number) {
    playSound('clink.wav', 0, false);
    var unit = this.superpowersData.units[piece];
    var cost = unit.cost;

    for (var x = 0; x < count; x++) {
      if (this.currentPlayer.money - cost >= 0) {
        this.currentPlayer.money -= cost;
        var id = this.gameObj.unitPurchases.length + 1;
        this.gameObj.unitPurchases.push({ id: id, terr: this.selectedTerritory.id, piece: piece });
      }
    }
    if (piece == 16)
      this.currentPlayer.abFlg = true;
    if (piece == 17)
      this.currentPlayer.railFlg = true;
    if (piece == 18)
      this.currentPlayer.techCount++;
    this.selectedTerritory.displayQueue = getDisplayQueueFromQueue(this.selectedTerritory, this.gameObj);
  }
  clearQueue() {
    playSound('clink.wav', 0, false);
    var newUnits = [];
    var terrId = this.selectedTerritory.id;
    var units = this.superpowersData.units;
    var money = this.currentPlayer.money;

    for (var x = 0; x < this.gameObj.unitPurchases.length; x++) {
      var purchUnit = this.gameObj.unitPurchases[x];
      if (purchUnit.terr == terrId) {
        var unit = units[purchUnit.piece];
        money += unit.cost;
        if (purchUnit.piece == 16)
          this.currentPlayer.abFlg = false;
        if (purchUnit.piece == 17)
          this.currentPlayer.railFlg = false;
        if (purchUnit.piece == 18)
          this.currentPlayer.techCount--;
        if (purchUnit.piece == 52)
          this.currentPlayer.empCount++;
        if (purchUnit.piece == 12) {
          this.currentPlayer.money += this.gameObj.superBCForm.cost - 15;
          this.currentPlayer.battleshipCost = 0;
          this.gameObj.superBCForm.cost = 0;
        }
      } else {
        newUnits.push(purchUnit);
      }
    }

    this.currentPlayer.money = money;
    this.gameObj.unitPurchases = newUnits;
    this.selectedTerritory.displayQueue = getDisplayQueueFromQueue(this.selectedTerritory, this.gameObj);
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
