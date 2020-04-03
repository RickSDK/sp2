import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var leaderFromLine: any;

@Component({
  selector: 'app-game-standings',
  templateUrl: './game-standings.component.html',
  styleUrls: ['./game-standings.component.scss']
})
export class GameStandingsComponent extends BaseComponent implements OnInit {
  @Input('user') user: any;
  public fullPlayerList = [];
  public hotStreakList = [];
  public coldStreakList = [];
  public loadingFlg = true;

  constructor() { super(); }

  ngOnInit(): void {
  }
  show() {
    this.openModal('#gameStandingsPopup');
    this.loadLeagueData();
  }

  loadLeagueData() {

    const url = this.getHostname() + "/webLeaders.php";
    const postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, type: '1', action: '' });

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        var items = data.split("<br>");
 
        var leaders = items[2].split('<li>');
        var hotStreakList = [];
        var coldStreakList = [];
        this.fullPlayerList = [];

        for (var x = 0; x < leaders.length; x++) {
          var line = leaders[x];
          var player = leaderFromLine(line);
          if (player.name.length > 0) {
            if (player.days_old <= 3) {
              this.fullPlayerList.push(player);
              if (player.stk > 0)
                hotStreakList.push(player);
              if (player.stk < 0)
                coldStreakList.push(player);
            }
          }
        }
        this.hotStreakList = hotStreakList.sort(function (a, b) { return a.stk - b.stk; }).slice(0, 5);
        this.coldStreakList = coldStreakList.sort(function (a, b) { return a.stk - b.stk; }).slice(0, 5);

        this.loadingFlg = false;
      })
      .catch(error => {
        this.loadingFlg = false;
        this.showAlertPopup('Network API Error! See console logs.', 1);
        console.log('executeTextApi Error', error);
      });
  }



}
