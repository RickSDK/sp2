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
  public logRound = 1;
  public logNation = 0;
  public showLog = 1;
  public editPostMode = false;
  public displayLogs = [];

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    var round = gameObj.round;
    if (round > 1 && gameObj.currentNation == gameObj.players[0].nation)
      round--;
    this.filterLogsForRound(round);
    this.openModal('#logsPopup');
  }
  changeIdx(num: number) {
    this.segmentIdx = num;
    if (num == 0)
      this.filterLogsForRound(this.gameObj.round);
    if (num == 1)
      this.filterLogsForNation(0);
  }
  changeLogRound(num: number) {
    this.filterLogsForRound(this.logRound + num);
  }
  filterLogsForRound(round: number) {
    this.logRound = round;
    var displayLogs = [];
    this.gameObj.logs.forEach(function (log) {
      if (log.round == round)
        displayLogs.push(log);
    });
    this.displayLogs = displayLogs;
  }
  filterLogsForNation(nation: number) {
    this.logNation = nation;
    var displayLogs = [];
    this.gameObj.logs.forEach(function (log) {
      if (log.nation == nation)
        displayLogs.push(log);
    });
    this.displayLogs = displayLogs;
  }

}
