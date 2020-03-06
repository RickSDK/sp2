import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var getSuperpowersData: any;

@Component({
  selector: 'app-game-players-popup',
  templateUrl: './game-players-popup.component.html',
  styleUrls: ['./game-players-popup.component.scss']
})
export class GamePlayersPopupComponent extends BaseComponent implements OnInit {
  public showIncomeInfo = false;

  constructor() { super(); }

  ngOnInit(): void {
  }

  show(gameObj:any, ableToTakeThisTurn:any, currentPlayer:any, user:any) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    this.openModal('#gamePlayersPopup');
  }


}
