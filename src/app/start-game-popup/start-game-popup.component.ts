import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var getHostname: any;
declare var userObjFromUser: any;

declare var $: any;

@Component({
  selector: 'app-start-game-popup',
  templateUrl: './start-game-popup.component.html',
  styleUrls: ['./start-game-popup.component.scss']
})
export class StartGamePopupComponent extends BaseComponent implements OnInit {
  public hostname: string;
  public user: any;
  public gameType: any;
  public fogIdx = 0;
  public difficultyIdx = 1;
  public campaignId = 1;
  public gameTypeObj: any;
  public numPlayers = 4;
  public gameTypes = [];
  public players = [];
  public game: any;
  public nations = [1, 2, 3, 4, 5, 6, 7, 8];
  public yourNation = 0;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.hostname = getHostname();
    this.user = userObjFromUser();
    this.gameTypeObj = { name: 'test', desc: 'test' };
    this.game = { name: 'test', type: 'test' };
  }
  show() {
    this.difficultyIdx = 1;
    this.yourNation = 2;
    this.segmentIdx = 0;
    this.campaignId = localStorage.currentCampaign || 0;
    $("#startGamePopup").modal();
  }
  changeSegmentIdx(num: number) {
    this.segmentIdx = num;
    this.nations = [1, 2, 3, 4, 5, 6, 7, 8];
    this.yourNation = 1;
    if (this.segmentIdx == 2) {
      this.yourNation = 11;
      this.numPlayers = 4;
      this.nations = [11, 12, 13, 14];
    }
  }
  changeNumPlayers() {
    if (this.segmentIdx != 2)
      this.numPlayers++;
    if (this.numPlayers > 8)
      this.numPlayers = 4;
  }
  startGame() {
    if (this.yourNation == 0) {
      if (this.segmentIdx == 2)
        this.yourNation = Math.floor((Math.random() * 4) + 11);
      else
        this.yourNation = Math.floor((Math.random() * 8) + 1);
    }

    localStorage.startingNation = this.yourNation;
    localStorage.difficultyNum = this.difficultyIdx - 1;
    localStorage.hardFog = (this.fogIdx == 2) ? "Y" : "N";
    localStorage.fogOfWar = (this.fogIdx > 0) ? "Y" : "N";
    var types = ['diplomacy', 'freeforall', 'ww2']
    localStorage.customGameType = types[this.segmentIdx];
    localStorage.gameTypeName = types[this.segmentIdx];
    localStorage.gameType = this.segmentIdx;
    localStorage.numPlayers = this.numPlayers;

    $("#startGamePopup").modal('hide');
    this.router.navigate(['/board']);
  }

}
