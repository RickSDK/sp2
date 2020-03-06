import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;

@Component({
  selector: 'app-game-info-popup',
  templateUrl: './game-info-popup.component.html',
  styleUrls: ['./game-info-popup.component.scss']
})
export class GameInfoPopupComponent extends BaseComponent implements OnInit {
  public ableToTakeThisTurn=false
  public currentPlayer:any;
  public gameObj:any;
  public user:any;
  
  constructor() { super(); }

  ngOnInit(): void {
  }
  
  show(gameObj, ableToTakeThisTurn, currentPlayer, user) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    this.openModal('#gameInfoPopup');
  }

}
