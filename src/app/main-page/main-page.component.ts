import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';

declare var getHostname: any;
declare var userObjFromUser: any;
declare var parseServerDataIntoUserObj: any;
declare var spVersion: any;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent extends BaseComponent implements OnInit {
  public userRank = 0;
  public myEMPCount = 0;
  public forumCount = 0;
  public hostname: string;
  public user: any;
  public expandFlg = false;
  public singleGameId: number;
  
  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    //localStorage.rank=0; //<-- reset rank
    this.hostname = getHostname();
    this.user = userObjFromUser();
    this.flexSprite(100);
    this.singleGameId = localStorage.currentGameId;
    localStorage.loadGameId = 0; // clear out any multiplayer game
    if (this.user.userId > 0)
      this.getUserData();
    else {
      this.displaySPPopup('initPopup');
    }
  }
  getUserData() {
    const url = getHostname() + "/spApiText.php";
    const postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, action: 'getUserData' });
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        if (this.verifyServerResponse(data))
          this.paserUserData(data);
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  paserUserData(data) {
    this.user = parseServerDataIntoUserObj(data);
 
    localStorage.lastForumLogin = this.user.forum_last_login;
    //  if(this.user.gold_member_flg=='Y' && localStorage.gold_member_flg != 'Y') {
    //     playSound('tada.mp3', 0, $scope.muteSound);
    //    localStorage.gold_member_flg = 'Y';
    //    $scope.gold_member_flg = 'Y';
    //displayFixedPopup('upgradePopup');
    //  }

    var existingEMPCount = this.numberVal(localStorage.existingEMPCount);
    this.user.newEmpFlg = (existingEMPCount != this.user.empCount);
    if (this.user.newEmpFlg) {
      localStorage.existingEMPCount = this.user.empCount;
    }
    var existingRank = this.numberVal(localStorage.rank);
    this.user.newRankFlg = (existingRank != this.user.rank);
    if (this.user.newRankFlg) {
      this.playSound('tada.mp3');
      localStorage.rank = this.user.rank;
    }
    if (this.user.gamesTurn > 0 || this.user.newGameCount > 0 || this.user.endGameCount > 0 || this.user.newEmpFlg || this.user.newRankFl) {
      this.displaySPPopup('initPopup');
    }
    if (this.user.forumCount > 0 || this.user.mailCount > 0) {

    }
    if (this.user.urgentCount > 0)
      this.showAlertPopup('Urgent Message Waiting!');
 
  }
  multiplayGameClicked(login: any) {
    if (this.user.userId > 0)
      this.router.navigate(['/multiplayer']);
    else
      login.show();
  }
  singlePlayerGame(startGame: any) {
    if (this.singleGameId > 0)
      this.router.navigate(['/board']);
    else
      startGame.show();
  }
  userUpdated($event) {
    this.user = userObjFromUser();
    console.log('User updated from emit!', this.user);
  }
  flexSprite(width: number) {
    if (this.expandFlg)
      width++;
    else
      width--;
    var e = document.getElementById('spLogo');
    if (e) {
      e.style.width = width + '%';
      if (width < 75 || width > 99) {
        this.expandFlg = !this.expandFlg;
      }
      //window.requestAnimationFrame(flexSprite);
      setTimeout(() => {
        this.flexSprite(width);
      }, 80);
    }
  }
}
