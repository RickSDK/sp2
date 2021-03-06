import { Component, OnInit, Input } from '@angular/core';

declare var declareWarOnNation: any;
declare var offerTreatyToNation: any;
declare var refreshTerritory: any;
declare var displayLeaderAndAdvisorInfo: any;
declare var playSound: any;
declare var $: any;


@Component({
  selector: 'app-terr-advice',
  templateUrl: './terr-advice.component.html',
  styleUrls: ['./terr-advice.component.scss']
})
export class TerrAdviceComponent implements OnInit {
  @Input('selectedTerritory') selectedTerritory: any;
  @Input('currentPlayer') currentPlayer: any;
  @Input('yourPlayer') yourPlayer: any;
  @Input('superpowersData') superpowersData: any;
  @Input('gameObj') gameObj: any;
  @Input('user') user: any;
  @Input('optionType') optionType: any; 
  @Input('battleAnalysisObj') battleAnalysisObj: any;
  @Input('ableToTakeThisTurn') ableToTakeThisTurn: any;

  constructor() { }

  ngOnInit(): void {
  }
  ngStyleLogs(nation: number) {
    var colors = ['#ffc', '#ccf', '#ccc', '#db6', '#fcc', '#cfc', '#ffc', '#fcf', '#cff', '#666'];
    var color = colors[nation];
    return { 'background-color': color, 'color': 'black' };
  }
  declareWar() {
    if(this.gameObj.type === 'autobalance' && this.selectedTerritory.territoryType == 'Ally') {
      playSound('error.mp3');
      return;
    }
    playSound('shotgun.mp3');
    playSound('warning.mp3');
    declareWarOnNation(this.selectedTerritory.owner, this.gameObj, this.currentPlayer, this.superpowersData)
    refreshTerritory(this.selectedTerritory, this.gameObj, this.currentPlayer, this.superpowersData, this.currentPlayer);
    displayLeaderAndAdvisorInfo(this.selectedTerritory, this.currentPlayer, this.currentPlayer, this.user, this.gameObj, this.superpowersData.superpowers, this.optionType);
    $('#territoryPopup').modal('toggle');
  }
  offerTreaty(type: number) {
    offerTreatyToNation(this.selectedTerritory.owner, this.gameObj, this.currentPlayer, this.superpowersData);
    $('#territoryPopup').modal('toggle');
  }
}
