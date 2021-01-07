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
    this.showCampaignsFlg = this.user.rank <= 2;
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
    console.log(campaign);
    localStorage.currentCampaign = campaign.id;
    if (this.singleGameId > 0)
      this.router.navigate(['/board']);
    else
      startGame.show();
  }
  singlePlayerGame(startGame: any) {
    if (this.user.rank < 2) {
      this.showAlertPopup('Whoa! Complete the Campaign before playing a standard single player game.', 1);
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
    if (this.user.rank > 3)
      this.campaignId = 11; // unlock all

    this.superpowersData.campaigns.forEach(campaign => {
      campaign.lock = (campaign.id > this.campaignId);
    });
  }

}
