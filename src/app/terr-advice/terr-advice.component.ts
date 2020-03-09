import { Component, OnInit, Input } from '@angular/core';

declare var playClick: any;
declare var playerOfNation: any;
declare var changeTreaty: any;
declare var refreshTerritory: any;
declare var displayLeaderAndAdvisorInfo: any;
declare var showAlertPopup: any;
declare var popupMessage: any;
declare var logItem: any;

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
    return { 'background-color': color };
  }
  declareWar() {
    playClick();
    var p2 = playerOfNation(this.selectedTerritory.owner, this.gameObj);
    changeTreaty(this.currentPlayer, p2, 0, this.gameObj, this.superpowersData.superpowers);
    refreshTerritory(this.selectedTerritory, this.gameObj, this.superpowersData.units, this.currentPlayer, this.superpowersData.superpowers, this.currentPlayer);
    displayLeaderAndAdvisorInfo(this.selectedTerritory, this.currentPlayer, this.currentPlayer, this.user, this.gameObj, this.superpowersData.superpowers);
  }
  offerTreaty(type: number) {
    playClick();
    var p2 = playerOfNation(this.selectedTerritory.owner, this.gameObj);
    var p1TopFlg = (this.currentPlayer.nation == this.gameObj.top1Nation || this.currentPlayer.nation == this.gameObj.top2Nation);
    var p2TopFlg = (p2.nation == this.gameObj.top1Nation || p2.nation == this.gameObj.top2Nation);
    if (p1TopFlg && p2TopFlg && type == 3) {
      showAlertPopup('Sorry, top 2 players cannot ally.', 1);
      return;
    }
    this.currentPlayer.diplomacyFlg = true;
    this.attemptDiplomacy(this.currentPlayer, p2, type);
  }
  attemptDiplomacy(player: any, player2: any, type: number) {
    if (type == 2) {
      var msg = 'Peace treaty offered to ' + this.superpowersData.superpowers[player2.nation];
      popupMessage(player, msg, player2, true);
      logItem(this.gameObj, player, 'Diplomacy', msg);
      player2.offers.push(player.nation);
    }
    if (type == 3) {
      var msg = 'Alliance offered to ' + this.superpowersData.superpowers[player2.nation];
      popupMessage(player, msg, player2, true);
      player2.offers.push(player.nation);
      logItem(this.gameObj, player, 'Diplomacy', msg);
    }
  }
}
