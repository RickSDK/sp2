import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var addIncomeForPlayer: any;
declare var checkVictoryConditions: any;
declare var closePopup: any;
declare var drawSPGraph: any;
declare var refreshTerritory: any;

@Component({
  selector: 'app-game-players-popup',
  templateUrl: './game-players-popup.component.html',
  styleUrls: ['./game-players-popup.component.scss']
})
export class GamePlayersPopupComponent extends BaseComponent implements OnInit {
  public buttonIdx = 0;
  public showInfoFlg = false;
  public displayPlayers = [];
  public displayTeams = [];
  public gameUpdDt: string;
  public generalRetreatObj: any;
  public generalRetreatFlg = false;

  constructor() { super(); }

  ngOnInit(): void {
  }

  show(gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any, buttonIdx = 0) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    this.buttonIdx = buttonIdx;
    if (buttonIdx == 2)
      this.showGraphs();

    closePopup('diplomacyWarningPopup'); //not sure if needed

    this.gameUpdDt = localStorage.gameUpdDt;

    if (ableToTakeThisTurn && localStorage.generalRetreatObj && localStorage.generalRetreatObj.length > 0) {
      this.generalRetreatObj = JSON.parse(localStorage.generalRetreatObj);
      if (this.generalRetreatObj && this.generalRetreatObj.gameId == this.gameObj.id) {
        this.generalRetreatFlg = true;
        var terr1 = gameObj.territories[this.generalRetreatObj.terrId1 - 1];
        var terr2 = gameObj.territories[this.generalRetreatObj.terrId2 - 1];
        if (terr1.owner != currentPlayer.nation || terr2.owner != currentPlayer.nation)
          this.generalRetreatFlg = false;
        if (terr1.generalFlg)
          this.generalRetreatObj.currentLoc = terr1.id;
        if (terr2.generalFlg)
          this.generalRetreatObj.currentLoc = terr2.id;
      }
    }

    checkVictoryConditions(currentPlayer, gameObj, this.superpowersData);

    gameObj.players.forEach(player => {
      addIncomeForPlayer(player, gameObj);
    });

    //------------------allies
    this.displayPlayers = gameObj.players.slice(0);
    this.displayPlayers.sort(function (a, b) { return a.team - b.team; });

    var displayTeams = [];
    gameObj.teams.forEach(team => {
      if (team.alive)
        displayTeams.push(team);
    });
    this.displayTeams = displayTeams;

    this.openModal('#gamePlayersPopup');
  }
  moveGeneralToTerr(id: number) {
    console.log(id);
    this.playSound('tada.mp3');
    this.closeModal('#gamePlayersPopup');
    var nation = this.currentPlayer.nation;
    this.gameObj.units.forEach(unit => {
      if (unit.nation == nation && unit.piece == 10)
        unit.terr = id;
    });
    var terr1 = this.gameObj.territories[this.generalRetreatObj.terrId1 - 1];
    var terr2 = this.gameObj.territories[this.generalRetreatObj.terrId2 - 1];
    refreshTerritory(terr1, this.gameObj, this.currentPlayer, this.superpowersData, this.currentPlayer);
    refreshTerritory(terr2, this.gameObj, this.currentPlayer, this.superpowersData, this.currentPlayer);
}

  showGraphs() {
    this.buttonIdx = 2;
    this.drawGraphs();

    setTimeout(() => {
      this.drawGraphs();
    }, 20);
    setTimeout(() => {
      this.drawGraphs();
    }, 200);
  }

  drawGraphs() {
    drawSPGraph(this.gameObj.statsObj, 1, 'teamCanvas');
    drawSPGraph(this.gameObj.statsObj, 2, 'playersCanvas');
  }
}
