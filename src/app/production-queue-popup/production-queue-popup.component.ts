import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;

@Component({
  selector: 'app-production-queue-popup',
  templateUrl: './production-queue-popup.component.html',
  styleUrls: ['./production-queue-popup.component.scss']
})
export class ProductionQueuePopupComponent extends BaseComponent implements OnInit {
  public productionTerrList: any;

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);

    var productionTerrList = [];
    var terrHash = {};
    var count = 1;
    gameObj.unitPurchases.forEach(element => {

      var terrId = element.terr;
      if (!terrHash[terrId]) {
        terrHash[terrId] = count++;
        productionTerrList.push({ terrId: terrId, units: [] });
      }
      var id = terrHash[terrId] - 1;
      productionTerrList[id].units.push(element);
    });
    this.productionTerrList = productionTerrList;
    this.openModal('#productionQueuePopup');
  }
}
