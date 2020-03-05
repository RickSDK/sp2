import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-game-info-popup',
  templateUrl: './game-info-popup.component.html',
  styleUrls: ['./game-info-popup.component.scss']
})
export class GameInfoPopupComponent implements OnInit {
  public ableToTakeThisTurn=false
  public currentPlayer:any;
  public gameObj:any;
  public user:any;
  public gamePoints=0;
  
  constructor() { }

  ngOnInit(): void {
  }
  
  show(gameObj, ableToTakeThisTurn, currentPlayer, user) {
    this.gameObj = gameObj;
    this.ableToTakeThisTurn = ableToTakeThisTurn;
    this.currentPlayer = currentPlayer;
    this.user = user;
    $("#gameInfoPopup").modal();
  }

}
