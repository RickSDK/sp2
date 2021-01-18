import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';

declare var userObjFromUser: any;
declare var saveUserObj: any;

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent extends BaseComponent implements OnInit {
  public showVideoPlayerFlg = false;
  public showCampaignsFlg = false;
  public currentVideo: any;
  public guestNum = 0;
  public campaignId = 1;
  public singleGameId = localStorage.currentGameId;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.user = userObjFromUser();
    this.showCampaignsFlg = false;
    this.paintMainScreen();
  }
  enterUsernamePressed() {
    var userName = this.databaseSafeValueOfInput('userName');
    if (!userName.length || userName.length == 0) {
      this.showAlertPopup('Value is blank!', 1);
      return;
    }
    if (userName == 'Guest') {
      this.showAlertPopup('userName cannot be Guest!', 1);
      return;
    }

    localStorage.userName = userName;
    this.user.userName = userName;
    saveUserObj(this.user);
    this.user = userObjFromUser();
    this.paintMainScreen();
  }
  ngClassCampButton(campaign: any) {
    if (campaign.lock)
      return 'btn btn-secondary roundButton';
    if (campaign.id == this.campaignId)
      return 'btn btn-success roundButton';

    return 'btn btn-primary roundButton';
  }
  selectCampaign(campaign: any, startGame: any) {
    if (campaign.lock) {
      this.showAlertPopup('Sorry, this Campaign is locked. Complete the previous campaign first.', 1);
      return;
    }
    localStorage.currentCampaign = campaign.id;
    if (this.singleGameId > 0)
      this.router.navigate(['/board']);
    else
      startGame.show();
  }
  singlePlayerGame(startGame: any) {
    if (!this.user.rank || this.user.rank < 1) {
      this.showAlertPopup('Whoa! You have no idea what you are doing yet! Complete the Campaign before playing a standard single player game.', 1);
      return;
    }
    if (this.user.rank == 1) {
      this.showAlertPopup('You must be Private 1st Class to unlock this option. Complete Campaign #8 get promoted.', 1);
      return;
    }
    localStorage.currentCampaign = 0;
    if (this.singleGameId > 0)
      this.router.navigate(['/board']);
    else
      startGame.show();
  }
  paintMainScreen() {
    this.user = userObjFromUser();
    this.campaignId = localStorage.campaignId || 1;
    console.log('campaignId', this.campaignId, this.user.rank);
    if (this.campaignId > 1 && this.campaignId <= 8)
      this.showCampaignsFlg = true;

    if (this.user.rank < 1)
      this.campaignId = 1;
    if (this.user.rank >= 3)
      this.campaignId = 11; // unlock all

    if (this.campaignId > 1 && this.user.rank < 1) {
      this.fixUserToRank(1);
    }
    if (this.campaignId > 8 && this.user.rank < 2) {
      this.fixUserToRank(2);
    }
    if (this.campaignId > 10 && this.user.rank < 3) {
      this.fixUserToRank(3);
    }

    this.superpowersData.campaigns.forEach(campaign => {
      campaign.lock = (campaign.id > this.campaignId);
    });
  }
  fixUserToRank(rank: number) {
    this.showAlertPopup('Whoa! out of sync!');
    localStorage.rank = rank;
    this.user.rank = rank;
    saveUserObj(this.user);
    this.user = userObjFromUser();
    console.log('xxx', this.user);

  }

}
