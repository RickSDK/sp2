import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var getSuperpowersData: any;

@Component({
  selector: 'app-allies-popup',
  templateUrl: './allies-popup.component.html',
  styleUrls: ['./allies-popup.component.scss']
})
export class AlliesPopupComponent implements OnInit {
  public ableToTakeThisTurn=false
  public currentPlayer:any;
  public gameObj:any;
  public user:any;
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
    $("#alliesPopup").modal();
  }

}
