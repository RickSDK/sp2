import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var playSound: any;
declare var getDisplayQueueFromQueue: any;
declare var isUnitGoodForForm: any;
declare var addUniToQueue: any;
declare var displayFixedPopup: any;
declare var isFactoryAllowedOnTerr: any;
declare var unitOfId: any;

@Component({
  selector: 'app-terr-purchase',
  templateUrl: './terr-purchase.component.html',
  styleUrls: ['./terr-purchase.component.scss']
})
export class TerrPurchaseComponent extends BaseComponent implements OnInit {
  @Input('selectedTerritory') selectedTerritory: any;
  @Input('currentPlayer') currentPlayer: any;
  @Input('superpowersData') superpowersData: any;
  @Input('gameObj') gameObj: any;
  @Input('user') user: any;
  @Input('ableToTakeThisTurn') ableToTakeThisTurn: any;
  @Input('optionType') optionType: any;
  @Input('productionDisplayUnits') productionDisplayUnits: any;
  @Input('allowFactoryFlg') allowFactoryFlg: any;
  @Input('adminModeFlg') adminModeFlg: string;
  public facBombedFlg = false;
  // public allowEcoCenterFlg = true;
  //  public allowFactoryFlg = true;

  constructor() { super(); }

  ngOnInit(): void {
  }
  initChild(terr: any) {
    this.allowFactoryFlg = isFactoryAllowedOnTerr(terr, this.gameObj);
    this.segmentIdx = (terr.nation < 99) ? 0 : 2;
    this.changeProdType(this.segmentIdx);
    this.facBombedFlg = terr.facBombed;
  }

  addUniToQueue(piece: number, count: number) {
    if (this.adminModeFlg) {
      var newId = this.gameObj.unitId;
      this.gameObj.unitId++;
      var unit = unitOfId(newId, this.selectedTerritory.owner, piece, this.selectedTerritory.id, this.superpowersData.units, true);
      this.gameObj.units.push(unit);
      playSound('Swoosh.mp3');
      return;
    }
    playSound('clink.wav');
    if (piece == 15 || piece == 19) {
      if (this.facBombedFlg)
        this.facBombedFlg = false;
      else
        this.allowFactoryFlg = false;
    }
    addUniToQueue(piece, count, this.superpowersData, this.currentPlayer, this.gameObj, this.selectedTerritory);
  }
  clearQueue() {
    playSound('clink.wav');
    var newUnits = [];
    var terrId = this.selectedTerritory.id;
    var units = this.superpowersData.units;
    var money = this.currentPlayer.money;
    this.facBombedFlg = this.selectedTerritory.facBombed;

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

    this.allowFactoryFlg = this.selectedTerritory.factoryCount < 2;
    this.currentPlayer.money = money;
    this.gameObj.unitPurchases = newUnits;
    this.selectedTerritory.displayQueue = getDisplayQueueFromQueue(this.selectedTerritory, this.gameObj);
  }

  changeProdType(segmentIdx: number) {
    this.segmentIdx = segmentIdx;
    this.productionDisplayUnits = [];
    if (this.selectedTerritory.factoryCount == 0)
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
      if (this.user.rank >= 4)
        this.tryThisUnit(num2);
      if (this.user.rank >= 7)
        this.tryThisUnit(num2 + 8);
      if (this.user.rank >= 10)
        this.tryThisUnit(num2 + 16);
      if (this.user.rank >= 14)
        this.tryThisUnit(num2 + 24);
    }
  }
  tryThisUnit(id: number) {
    var unit = this.superpowersData.units[id];
    if (isUnitGoodForForm(this.segmentIdx, unit.type, unit.subType))
      this.productionDisplayUnits.push(unit);
  }
  showUnitPopup(unit: any) {
    let piece = unit.piece || unit.id;
    this.selectedUnit = this.superpowersData.units[piece];
    displayFixedPopup('unitPopup2');
  }
}
