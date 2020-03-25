import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var drawSPGraph: any;
declare var checkVictoryConditions: any;

@Component({
  selector: 'app-stats-popup',
  templateUrl: './stats-popup.component.html',
  styleUrls: ['./stats-popup.component.scss']
})
export class StatsPopupComponent extends BaseComponent implements OnInit {
  public numTeams = 1;

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);

    checkVictoryConditions(currentPlayer, gameObj, this.superpowersData);
    console.log('xxx', gameObj.teams);


    var numTeams = 0;
    this.gameObj.teams.forEach(function (team) {
      if (team.income > 0)
        numTeams++;
    });
    this.numTeams = numTeams;
    this.openModal('#statsPopup');
    setTimeout(() => {
      this.drawGraphs();
    }, 100);
 //   drawSPGraph(this.gameObj.statsObj, 1, 'teamCanvas');
 //   drawSPGraph(this.gameObj.statsObj, 2, 'playersCanvas');

  }
  drawGraphs() {
    drawSPGraph(this.gameObj.statsObj, 1, 'teamCanvas');
    drawSPGraph(this.gameObj.statsObj, 2, 'playersCanvas');
  }

}
