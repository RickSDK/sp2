import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var addIncomeForPlayer: any;
declare var checkVictoryConditions: any;
declare var closePopup: any;
declare var drawSPGraph: any;

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

  constructor() { super(); }

  ngOnInit(): void {
  }

  show(gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any, buttonIdx = 0) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    this.buttonIdx = buttonIdx;
    if (buttonIdx == 2)
      this.showGraphs();

    closePopup('diplomacyWarningPopup'); //not sure if needed

    checkVictoryConditions(currentPlayer, gameObj, this.superpowersData);

    gameObj.players.forEach(player => {
      addIncomeForPlayer(player, gameObj);
    });

    //------------------allies
    this.displayPlayers = gameObj.players;
    this.displayPlayers.sort(function (a, b) { return a.team - b.team; });

    var displayTeams = [];
    gameObj.teams.forEach(team => {
      if (team.alive)
        displayTeams.push(team);
    });
    this.displayTeams = displayTeams;

    this.openModal('#gamePlayersPopup');
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
