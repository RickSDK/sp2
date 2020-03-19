import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var closePopup: any;
declare var offerTreaty: any;
declare var figureOutTeams: any;

@Component({
  selector: 'app-allies-popup',
  templateUrl: './allies-popup.component.html',
  styleUrls: ['./allies-popup.component.scss']
})
export class AlliesPopupComponent extends BaseComponent implements OnInit {
  public showInfoFlg = false;
  public displayPlayers = [];
  public displayTeams = [];

  constructor() { super(); }

  ngOnInit(): void {
  }

  show(gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    closePopup('diplomacyWarningPopup');

    figureOutTeams(this.gameObj);
    this.displayPlayers = gameObj.players;
    this.displayPlayers.sort(function (a, b) { return a.team - b.team; });

    var displayTeams = [];
    gameObj.teams.forEach(team => {
      if (team.income > 0)
        displayTeams.push(team);
    });
    this.displayTeams = displayTeams;

    this.openModal('#alliesPopup');
  }
  offerTreaty(type: number, nation: number) {
    offerTreaty(type, nation, this.gameObj, this.currentPlayer, this.superpowersData);
  }
}
