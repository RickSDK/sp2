import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var playSound: any;
declare var getDisplayQueueFromQueue: any;
declare var isUnitGoodForForm: any;
declare var addUniToQueue: any;
declare var displayFixedPopup: any;
declare var isFactoryAllowedOnTerr: any;
declare var unitOfId: any;
declare var isUnitFighterUnit: any;
declare var playClick: any;
declare var closePopup: any;

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
  @Input('allowFactoryFlg') allowFactoryFlg: any;
  @Input('adminModeFlg') adminModeFlg: string;
  public facBombedFlg = false;
  public productionDisplayUnits: any;
  public battleshipCost = 0;
  public brokeFlg = false;
  public superBCForm: any;
  public factoriesInQueue = 0;

  constructor() { super(); }

  ngOnInit(): void {
  }
  initChild(terr: any) {
    this.allowFactoryFlg = isFactoryAllowedOnTerr(terr, this.gameObj);
    this.segmentIdx = (terr.nation < 99) ? 0 : 2;
    this.changeProdType(this.segmentIdx, terr);
    this.facBombedFlg = terr.facBombed;
    this.factoriesInQueue = this.numFactoriesInQueue(terr);
  }

  addUniToQueue(piece: number, count: number) {
    playClick();

    if((this.gameObj.currentCampaign == 1 || this.gameObj.currentCampaign == 2) && piece != 3 && this.gameObj.round==1) {
      this.showAlertPopup(' Since you are new, just buy tanks this turn.', 1);
      return;
    }
    if(this.gameObj.currentCampaign == 1 && piece != 3 && piece != 15 && piece != 19) {
      this.showAlertPopup(' For this training, we are only going to buy tanks, factories and economic centers.', 1);
      return;
    }
    if(this.gameObj.currentCampaign == 2 && piece > 3 && piece != 15 && piece != 19) {
      this.showAlertPopup(' For this training, we are only going to buy ground units, factories and economic centers.', 1);
      return;
    }
    if(this.gameObj.currentCampaign == 3 && piece != 13 && this.gameObj.round==1) {
      this.showAlertPopup(' Only buy AA Guns this round. Click each of your factories and buy 1 AA Gun per factory. Press the "Air" tab.', 1);
      return;
    }
    if(this.gameObj.currentCampaign == 3 && piece != 13 && piece != 7 && piece != 15 && piece != 19) {
      this.showAlertPopup(' For this training, we are only going to buy Air Defense, Bombers, Factories and Economic Centers. Click the "Air" tab.', 1);
      return;
    }
    if(this.gameObj.currentCampaign == 4 && piece != 13 && piece != 14) {
      this.showAlertPopup(' For this training, we are only going to buy Air Defense and Nukes. Click the "Air" tab.', 1);
      return;
    }
    if(this.gameObj.currentCampaign == 5 && this.gameObj.round==1 && piece != 4) {
      this.showAlertPopup('For this training, we are only going to buy Transports. Click on the North Sea zome and buy transports.', 1);
      return;
    }
    if(this.gameObj.currentCampaign == 6 && this.gameObj.round==1 && piece != 16 && piece != 17) {
      this.showAlertPopup('Buy Anti-Balistics and Railway this turn. Look for the buttons next to the "Research" button. Then press the "Purchase Complete" button.', 1);
      return;
    }
    if(this.gameObj.currentCampaign == 6 && piece != 18 && piece != 16 && piece != 17) {
      this.showAlertPopup('For this campaign we are just buying Research. No attacks needed.', 1);
      return;
    }
    if(this.gameObj.type=='ww2' && piece==14) {
      this.showAlertPopup('No nukes allowed in this game.');
      return;
    }
    if (this.adminModeFlg) {
      var newId = this.gameObj.unitId;
      this.gameObj.unitId++;
      var unit = unitOfId(newId, this.selectedTerritory.owner, piece, this.selectedTerritory.id, this.superpowersData.units, true);
      this.gameObj.units.push(unit);
      playSound('Swoosh.mp3');
      return;
    }
    if (this.selectedTerritory.nation == 99 && isUnitFighterUnit(piece)) {
      var carrierSpace = this.selectedTerritory.carrierSpace + this.numCarriersInQueue(this.selectedTerritory) * 2;
      var carrierCargo = this.selectedTerritory.carrierCargo + this.numFightersInQueue(this.selectedTerritory);
      if (carrierSpace < carrierCargo + count) {
        this.showAlertPopup('no room for this fighter!', 1);
        return;
      }
    }
    if (piece == 52) {
      this.currentPlayer.empBoughtFlg = true;
      this.showAlertPopup('Warning: If you buy an EMP, you will not have the option to redo your purchases.');
    }

    if (piece == 12) {
      displayFixedPopup('battleshipPopup');
      this.addUpBattleShipCost();
      return;
    }
    if (piece == 15 || piece == 19) {
      if (this.facBombedFlg)
        this.facBombedFlg = false;
      else
        this.allowFactoryFlg = false;
    }
    addUniToQueue(piece, count, this.superpowersData, this.currentPlayer, this.gameObj, this.selectedTerritory);
  }
  numFactoriesInQueue(terr: any) {
    var num = 0;
    this.gameObj.unitPurchases.forEach(unitPurch => {
      if ((unitPurch.piece == 15 || unitPurch.piece == 19) && unitPurch.terr == terr.id)
        num++;
    });
    return num;
  }
  numFightersInQueue(terr: any) {
    var num = 0;
    this.gameObj.unitPurchases.forEach(unitPurch => {
      if (isUnitFighterUnit(unitPurch.piece) && unitPurch.terr == terr.id)
        num++;
    });
    return num;
  }
  numCarriersInQueue(terr: any) {
    var num = 0;
    this.gameObj.unitPurchases.forEach(unitPurch => {
      if (unitPurch.piece == 8 && unitPurch.terr == terr.id)
        num++;
    });
    return num;
  }
  clearQueue() {
    playClick();
    var newUnits = [];
    var terrId = this.selectedTerritory.id;
    var units = this.superpowersData.units;
    var money = this.currentPlayer.money;
    this.facBombedFlg = this.selectedTerritory.facBombed;
    this.factoriesInQueue = 0;

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
        if (purchUnit.piece == 52) {
          this.currentPlayer.empCount++;
          this.currentPlayer.empBoughtFlg = false;
        }
        if (purchUnit.piece == 12) {
          money += this.gameObj.superBCForm.cost - 15;
          this.currentPlayer.battleshipCost = 0;
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

  changeProdType(segmentIdx: number, terr: any) {
    this.segmentIdx = segmentIdx;
    this.productionDisplayUnits = [];
    if (terr.factoryCount == 0 && terr.nation < 99 && !this.adminModeFlg)
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
      if(this.gameObj.type != 'ww2')
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
    if (!this.gameObj.restrict_units_flg && (segmentIdx == 2 || segmentIdx == 3)) { //special
      var num2 = parseInt(this.currentPlayer.nation) + 19;
      if (this.adminModeFlg || this.user.rank >= 4)
        this.tryThisUnit(num2);
      if (this.adminModeFlg || this.user.rank >= 7)
        this.tryThisUnit(num2 + 8);
      if (this.adminModeFlg || this.user.rank >= 10)
        this.tryThisUnit(num2 + 16);
      if (this.adminModeFlg || this.user.rank >= 14)
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
  selectAllBattleShipUpg() {
    playClick();
    var field = (<HTMLInputElement>document.getElementById('bsb99'));
    var checked = field.checked;
    if (checked) {
      if (this.currentPlayer.money < 45) {
        this.showAlertPopup('You do not have enough money!', 1);
        return;
      }
      this.battleshipCost = 45;
    } else {
      this.battleshipCost = 0;
    }
    for (var x = 1; x <= 10; x++) {
      var e = (<HTMLInputElement>document.getElementById('bsb' + x));
      e.checked = checked;
    }
    this.addUpBattleShipCost();
  }
  addUpBattleShipCost() {
    var battleshipCost = 15;
    var superBCForm = { name: '', hp: 0, att: 0, def: 0, adCount: 0, numAtt: 0, numDef: 0, cost: 0 };
    for (var x = 1; x <= 10; x++) {
      var e = (<HTMLInputElement>document.getElementById('bsb' + x));
      if (e && e.checked) {
        battleshipCost += 3;
        if (x == 1 || x == 2)
          superBCForm.hp++;
        if (x == 3 || x == 4)
          superBCForm.adCount++;
        if (x == 5 || x == 6)
          superBCForm.numAtt++;
        if (x == 7 || x == 8)
          superBCForm.numDef++;
        if (x == 9)
          superBCForm.att++;
        if (x == 10)
          superBCForm.def++;
        superBCForm.cost += 3;
      }
    }
    this.battleshipCost = battleshipCost;
    superBCForm.cost = battleshipCost;
    this.brokeFlg = battleshipCost > this.currentPlayer.money;
    if (this.brokeFlg)
      this.showAlertPopup('You cannot afford this!', 1);
    this.superBCForm = superBCForm;
  }
  buyBattleShipButtonClicked() {
    this.currentPlayer.money -= (this.superBCForm.cost - 15);
    this.gameObj.superBCForm = this.superBCForm;
    this.currentPlayer.battleshipCost = this.superBCForm.cost;
    closePopup('battleshipPopup');
    addUniToQueue(12, 1, this.superpowersData, this.currentPlayer, this.gameObj, this.selectedTerritory);
  }



}
