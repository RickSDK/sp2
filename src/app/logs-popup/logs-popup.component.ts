import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var getSuperpowersData: any;

@Component({
  selector: 'app-logs-popup',
  templateUrl: './logs-popup.component.html',
  styleUrls: ['./logs-popup.component.scss']
})
export class LogsPopupComponent extends BaseComponent implements OnInit {
 // public ableToTakeThisTurn=false
 // public currentPlayer:any;
 // public gameObj:any;
  //public user:any;
 // public superpowersData:any;
 public logRound = 1;
 public logNation = 1;
 public showLog = 1;
 public editPostMode = false;

  constructor() { super(); }

  ngOnInit(): void {
//    this.superpowersData = getSuperpowersData();
  }
  show(gameObj:any, ableToTakeThisTurn:any, currentPlayer:any, user:any) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    this.openModal('#logsPopup');
  }
  changeLogRound(num) {

  }

}
