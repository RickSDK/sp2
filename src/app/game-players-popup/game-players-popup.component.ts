import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var getSuperpowersData: any;

@Component({
  selector: 'app-game-players-popup',
  templateUrl: './game-players-popup.component.html',
  styleUrls: ['./game-players-popup.component.scss']
})
export class GamePlayersPopupComponent implements OnInit {
  public ableToTakeThisTurn=false
  public currentPlayer:any;
  public gameObj:any;
  public user:any;
  public filterNumber=0;
  public showIncomeInfo = false;
  public superpowersData:any;

  constructor() { }

  ngOnInit(): void {
    this.superpowersData = getSuperpowersData();
  }
  show(gameObj, ableToTakeThisTurn, currentPlayer, user) {
    this.gameObj = gameObj;
    this.ableToTakeThisTurn = ableToTakeThisTurn;
    this.currentPlayer = currentPlayer;
    this.user = user;
    this.superpowersData = getSuperpowersData();
    $("#gamePlayersPopup").modal();
  }

}
