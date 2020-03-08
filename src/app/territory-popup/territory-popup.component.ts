import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var ngUnitSrc: any;
declare var populateUnits: any;
declare var getSuperpowersData: any;
declare var playSound: any;
declare var isUnitGoodForForm: any;
declare var getDisplayQueueFromQueue: any;
declare var playClick: any;
declare var playerOfNation: any;
declare var changeTreaty: any;
declare var refreshTerritory: any;
declare var showAlertPopup: any;
declare var popupMessage: any;
declare var logItem: any;
declare var displayLeaderAndAdvisorInfo: any;

@Component({
  selector: 'app-territory-popup',
  templateUrl: './territory-popup.component.html',
  styleUrls: ['./territory-popup.component.scss']
})
export class TerritoryPopupComponent extends BaseComponent implements OnInit {
  public selectedTerritory: any;
  public currentPlayer: any;
  public gameObj: any;
  public optionType: string;
  public ableToTakeThisTurn = false;
  public unitDetailFlg = false;
  public productionDisplayUnits = [];
  public fortifyNation = 1;
  public allies=[];
  public loadingFlg=false;
  public loadPlanesFlg=false;
  public loadBoatsFlg=false;

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(terr: any, currentPlayer: any, gameObj: any, ableToTakeThisTurn: boolean, user: any) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    $("#territoryPopup").modal();
    this.selectedTerritory = terr;
    // this.currentPlayer = currentPlayer;
    // this.gameObj = gameObj;
    // this.ableToTakeThisTurn = ableToTakeThisTurn;
    // this.user = user;
    //this.superpowersData = getSuperpowersData();

    this.unitDetailFlg = false;
    this.optionType = 'none';
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
  offerTreaty(type: number) {
    playClick();
    var p2 = playerOfNation(this.selectedTerritory.owner, this.gameObj);
    var p1TopFlg = (this.currentPlayer.nation == this.gameObj.top1Nation || this.currentPlayer.nation == this.gameObj.top2Nation);
    var p2TopFlg = (p2.nation == this.gameObj.top1Nation || p2.nation == this.gameObj.top2Nation);
    if (p1TopFlg && p2TopFlg && type == 3) {
      showAlertPopup('Sorry, top 2 players cannot ally.', 1);
      return;
    }
    this.currentPlayer.diplomacyFlg = true;
    this.attemptDiplomacy(this.currentPlayer, p2, type);
  }
  attemptDiplomacy(player: any, player2: any, type: number) {
    if (type == 2) {
      var msg = 'Peace treaty offered to ' + this.superpowersData.superpowers[player2.nation];
      popupMessage(player, msg, player2, true);
      logItem(this.gameObj, player, 'Diplomacy', msg);
      player2.offers.push(player.nation);
    }
    if (type == 3) {
      var msg = 'Alliance offered to ' + this.superpowersData.superpowers[player2.nation];
      popupMessage(player, msg, player2, true);
      player2.offers.push(player.nation);
      logItem(this.gameObj, player, 'Diplomacy', msg);
    }
  }
  declareWar() {
    playClick();
    var p2 = playerOfNation(this.selectedTerritory.owner, this.gameObj);
    changeTreaty(this.currentPlayer, p2, 0, this.gameObj, this.superpowersData.superpowers);
    refreshTerritory(this.selectedTerritory, this.gameObj, this.superpowersData.units, this.currentPlayer, this.superpowersData.superpowers, this.currentPlayer);
    displayLeaderAndAdvisorInfo(this.selectedTerritory, this.currentPlayer, this.currentPlayer, this.user, this.gameObj, this.superpowersData.superpowers);
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
