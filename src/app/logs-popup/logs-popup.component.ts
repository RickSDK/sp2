import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var logItem: any;

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
  public yourPlayer: any;
  public yourNation = 0;

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any, yourPlayer: any) {
    if (yourPlayer && yourPlayer.nation)
      this.yourNation = yourPlayer.nation;
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    this.filterLogsForRound(gameObj.round);
    this.openModal('#logsPopup');
  }
  changeIdx(num: number) {
    this.segmentIdx = num;
    if (num == 0)
      this.filterLogsForRound(this.gameObj.round);
    if (num == 1)
      this.filterLogsForNation(0);
    if (num == 2)
      this.filterLogsForNotes();
  }
  changeLogRound(num: number) {
    this.filterLogsForRound(this.logRound + num);
  }
  filterLogsForNotes() {
    var displayLogs = [];
    var noteNation = this.yourNation;
    this.gameObj.logs.forEach(function (log) {
      if (log.type == 'Note' && log.nation == noteNation)
        displayLogs.push(log);
    });
    this.displayLogs = displayLogs;
  }
  filterLogsForRound(round: number) {
    this.logRound = round;
    var displayLogs = [];
    var noteNation = this.yourNation;
    this.gameObj.logs.forEach(function (log) {
      if (log.round == round && (log.type != 'Note' || log.nation == noteNation))
        displayLogs.push(log);
    });
    this.displayLogs = displayLogs;
    if (round > 1 && displayLogs.length == 0)
      this.filterLogsForRound(round - 1);
  }
  filterLogsForNation(nation: number) {
    this.logNation = nation;
    var displayLogs = [];
    var noteNation = this.yourNation;
    this.gameObj.logs.forEach(function (log) {
      if (log.nation == nation && (log.type != 'Note' || log.nation == noteNation))
        displayLogs.push(log);
    });
    this.displayLogs = displayLogs;
  }
  showBattleDetails(log) {
    if (this.showLog == log.id)
      this.showLog = 0;
    else
      this.showLog = log.id;
  }
  postNote = function () {
    var msgField = this.databaseSafeValueOfInput('noteField');
    if (msgField.length == 0) {
      this.showAlertPopup('no msgField', 1);
      return;
    }
    this.playClick();
    $('#noteField').val('');
    logItem(this.gameObj, this.currentPlayer, 'Note', msgField);
    this.filterLogsForRound(this.gameObj.round);
  }

}
