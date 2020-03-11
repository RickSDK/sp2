import { Component, OnInit, Input } from '@angular/core';

declare var playClick: any;
declare var playerOfNation: any;
declare var changeTreaty: any;
declare var refreshTerritory: any;
declare var displayLeaderAndAdvisorInfo: any;
declare var offerTreaty: any;


@Component({
  selector: 'app-terr-advice',
  templateUrl: './terr-advice.component.html',
  styleUrls: ['./terr-advice.component.scss']
})
export class TerrAdviceComponent implements OnInit {
  @Input('selectedTerritory') selectedTerritory: any;
  @Input('currentPlayer') currentPlayer: any;
  @Input('superpowersData') superpowersData: any;
  @Input('gameObj') gameObj: any;
  @Input('user') user: any;
  
  constructor() { }

  ngOnInit(): void {
  }
  ngStyleLogs(nation: number) {
    var colors = ['#ffc', '#ccf', '#ccc', '#db6', '#fcc', '#cfc', '#ffc', '#fcf', '#cff', '#666'];
    var color = colors[nation];
    return { 'background-color': color, 'color': 'black' };
  }
  declareWar() {
    playClick();
    var p2 = playerOfNation(this.selectedTerritory.owner, this.gameObj);
    changeTreaty(this.currentPlayer, p2, 0, this.gameObj, this.superpowersData.superpowers);
    refreshTerritory(this.selectedTerritory, this.gameObj, this.superpowersData.units, this.currentPlayer, this.superpowersData.superpowers, this.currentPlayer);
    displayLeaderAndAdvisorInfo(this.selectedTerritory, this.currentPlayer, this.currentPlayer, this.user, this.gameObj, this.superpowersData.superpowers);
  }
  offerTreaty(type: number) {
    offerTreaty(type, this.selectedTerritory.owner, this.gameObj, this.currentPlayer, this.superpowersData);
  }
}
