import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';

declare var getHostname: any;
declare var userObjFromUser: any;
declare var parseServerDataIntoUserObj: any;
declare var changeClass: any;
declare var saveUserObj: any;

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
  public showHomeButtonFlg = true;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.hostname = getHostname();
    this.user = userObjFromUser();
    if (0) {
      //reset user to new recruit
      localStorage.rank = 0;
      this.user.rank = 0;
      saveUserObj(this.user);
      this.user = userObjFromUser();

    }
    console.log(this.user);
    //this.flexSprite(100);
    flexSprite();
    this.singleGameId = localStorage.currentGameId;
    this.showHomeButtonFlg = localStorage.showHomeButtonFlg != 'Y';
    //getIPInfo(localStorage.userName, localStorage.password);
    /*
    changeClass('splash1', 'splash-screen');
    changeClass('splash2', 'splash-screen');
    setTimeout(() => {
      this.disolveSplash('splash-fade');
    }, 2000);
    setTimeout(() => {
      this.disolveSplash('splash-off');
    }, 3000);
    */
    if (this.user.userId > 0)
      this.getUserData();
    else {
      this.displaySPPopup('initPopup');
    }
  }
  disolveSplash(className: string) {
    changeClass('splash1', className);
    changeClass('splash2', className);
  }
  getUserData() {
    const url = getHostname() + "/spApiText.php";
    const postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, action: 'getUserData' });
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        if (this.verifyServerResponse(data)) {
          this.paserUserData(data);
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  paserUserData(data) {
    this.user = parseServerDataIntoUserObj(data);
    //console.log(this.user);

    localStorage.lastForumLogin = this.user.forum_last_login;

    var existingEMPCount = this.numberVal(localStorage.existingEMPCount);
    this.user.newEmpFlg = (existingEMPCount < this.user.empCount);
    if (existingEMPCount != this.user.empCount) {
      localStorage.existingEMPCount = this.user.empCount;
    }
    var existingRank = this.numberVal(localStorage.rank);
    this.user.newRankFlg = (existingRank < this.user.rank);

    if (this.user.awayFlg)
      this.showAlertPopup('Your Away Message is turned on! Click your profile to turn it off.', 1);

    if (existingRank != this.user.newRankFlg) {
      if (this.user.newRankFlg)
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
      requestAnimationFrame(flexSprite);
      //     setTimeout(() => {
      //      this.flexSprite(width);
      //     }, 80);
    }
  }
}

var width = 100;
var expandFlg = false;
function flexSprite() {
  if (expandFlg)
    width+=.1;
  else
    width-=.1;
  var e = document.getElementById('spLogo');
  if (e) {
    e.style.width = width + '%';
    if (width < 75) {
      expandFlg = true;
    }
    if(width > 99)
      expandFlg = false;
    requestAnimationFrame(flexSprite);
  }
}