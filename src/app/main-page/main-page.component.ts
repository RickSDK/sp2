import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';

declare var getHostname: any;
declare var userObjFromUser: any;
declare var userUpdateFromWeb: any;

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
    console.log(this.user);
    this.flexSprite(100);
    this.singleGameId = localStorage.currentGameId;
    localStorage.loadGameId = 0; // clear out any multiplayer game
    if (this.user.userId > 0)
      this.getUserData();
  }
  getUserData() {
    const url = getHostname() + "/spApiText.php";
    const postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, action: 'getUserData' });

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        this.user = userUpdateFromWeb(data, true);
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: '+error, 1);
      });

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
