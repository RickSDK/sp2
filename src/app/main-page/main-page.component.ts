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
  public yourRankName: string = '';
  public yourNextRankName: string = '';
  public yourNextRankDesc: string = '';
  public showVideoPlayerFlg = false;
  public showLoginFlg = true;
  public emailInValidFlg = true;
  public emailEnteredFlg = false;
  public email = '';
  public guestNum = 0;
  public currentVideo: any;
  public adsbygoogle: any;

  public videos = [
    { seconds: 41, src: 'http://www.superpowersgame.com/superpowers480.mov' },
    { seconds: 325, src: 'http://www.superpowersgame.com/videos/SPGamePlay480.mov' },
    { seconds: 24, src: 'http://www.superpowersgame.com/videos/homescreen.mov' },
  ];


  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.hostname = getHostname();

    setTimeout(() => {
      flexSprite();
      (this.adsbygoogle = (window as any).adsbygoogle || []).push({});
    }, 1000);


    if (0) {
      //reset user to new recruit
      this.user = userObjFromUser();
      localStorage.rank = 0;
      this.user.rank = 0;
      localStorage.campaignId = '';
      localStorage.videoIntroWatched = '';
      localStorage.videoGamePlayWatched = '';
      localStorage.videoIconWatched = '';
      saveUserObj(this.user);
      this.user = userObjFromUser();
      this.showAlertPopup('user reset!');
    }

    this.user = userObjFromUser();

    if (this.user.userId > 0)
      this.getUserData();
    else {
      if (this.user.rank < 2)
        this.displaySPPopup('initPopup');
    }
    this.paintMainScreen();

    // flexSprite();
    this.singleGameId = localStorage.currentGameId;
    this.showHomeButtonFlg = localStorage.showHomeButtonFlg != 'Y';
    //getIPInfo(localStorage.userName, localStorage.password);
  }
  paintMainScreen() {
    this.user = userObjFromUser();
    if (this.superpowersData && this.superpowersData.ranks) {
      this.yourRankName = this.superpowersData.ranks[this.user.rank].name;
      this.yourNextRankName = this.superpowersData.ranks[this.user.rank + 1].name;
      this.yourNextRankDesc = this.superpowersData.ranks[this.user.rank].name;
    }
    // guestnum
    // 0 = guest
    // 1 = signin
    // 2 = gameplay video watched
    // 3 = single player completed
    // 4 = add icon video watched
    // 5 = multiplayer video watched
    //---------------
    this.guestNum = 0;

    if (localStorage.videoIntroWatched == 'Y')
      this.guestNum = 1;

    if (localStorage.videoGamePlayWatched == 'Y')
      this.guestNum = 2;

    if (this.user.rank > 1) {

      if (this.user.rank == 2) {
        this.guestNum = 3;
        if (localStorage.videoIconWatched == 'Y')
          this.guestNum = 4;
      }
      if (this.user.rank > 2)
        this.guestNum = 5;
    }
    if (this.guestNum == 1)
      this.showAlertPopup('Watch the Gameplay Video and then complete a Single Player game.');



  }
  playVideo(num: number) {
    this.showVideoPlayerFlg = true;
    setTimeout(() => {
      this.startPlayingVideo(num);
    }, 500);
  }
  startPlayingVideo(num: number) {
    this.currentVideo = <HTMLVideoElement>document.getElementById('mainVideo');
    if (num == 1)
      localStorage.videoIntroWatched = 'Y';
    if (num == 2)
      localStorage.videoGamePlayWatched = 'Y';
    if (num == 3)
      localStorage.videoIconWatched = 'Y';
    var vid = this.videos[num - 1];
    if (this.currentVideo) {
      this.currentVideo.src = vid.src;
      this.currentVideo.play();
      /*
      setTimeout(() => {
        this.turnOffVideo();
      }, vid.seconds * 1000);*/
    }
  }

  turnOffVideo() {
    console.log('off!');
    this.currentVideo.pause();
    this.showVideoPlayerFlg = false;
    this.paintMainScreen();
  }
  validateField(email: string) {
    this.showLoginFlg = email.length == 0;
    this.emailInValidFlg = email.length == 0;
    this.email = email;
  }
  emailEntered(login: any) {
    console.log(this.email);
    //this.emailEnteredFlg = true;
    this.playClick();
    login.show(this.email);
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

    this.paintMainScreen();

  }

  multiplayGameClicked(login: any) {
    if (this.user.userId > 0 && this.user.rank >= 2)
      this.router.navigate(['/multiplayer']);
    else
      login.show();
  }
  singlePlayerGame() {
    if (this.singleGameId > 0)
      this.displaySPPopup('continueGamePopup');
    else
      this.router.navigate(['/campaign']);
  }
  startSPGame(option: number) {
    this.closePopup('continueGamePopup');
    if (option == 1)
      this.router.navigate(['/board']);
    else {
      localStorage.currentGameId = '';
      this.router.navigate(['/campaign']);
    }
  }
  userUpdated($event) {
    this.user = userObjFromUser();
    console.log('User updated from emit!', this.user);
    this.paintMainScreen();
  }
  /*
  flexSprite(width: number) {
    if (this.expandFlg)
      width++;
    else
      width--;
    var e = document.getElementById('spLogo');
    console.log('e',e);
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
  }*/
}

var width = 100;
var expandFlg = false;
function flexSprite() {
  if (expandFlg)
    width += .1;
  else
    width -= .1;
  var e = document.getElementById('spLogo');
  if (e) {
    e.style.width = width + '%';
    if (width < 75) {
      expandFlg = true;
    }
    if (width > 99)
      expandFlg = false;
    requestAnimationFrame(flexSprite);
  }
}