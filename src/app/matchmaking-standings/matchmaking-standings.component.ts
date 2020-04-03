import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var leaderFromLine: any;
declare var numberVal: any;

@Component({
  selector: 'app-matchmaking-standings',
  templateUrl: './matchmaking-standings.component.html',
  styleUrls: ['./matchmaking-standings.component.scss']
})
export class MatchmakingStandingsComponent extends BaseComponent implements OnInit {
  @Input('user') user: any;
  public maxGames = 0;
  public loadingFlg = true;
  public ipCheck: string;
  public ipViolator: string;
  public userWaiting: string;
  public availablePlayers = 0;
  public fullLeaderList = [];
  public hotStreakList = [];
  public coldStreakList = [];

  constructor() { super(); }

  ngOnInit(): void {
  }
  show() {
    this.openModal('#matchmakerStandingsPopup');
    this.loadLeagueData(1);
  }
  joinLeague() {

  }
  exitLeague() {

  }
  changeMaxGames(num: number) {
    this.maxGames += num;
    this.playClick();
  }
  loadLeagueData(ladder_id: number) {

    const url = this.getHostname() + "/webLeaders.php";
    const postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, maxGames: this.maxGames, action: '', ladder_id: ladder_id });

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        var items = data.split("<br>");
        var c = items[1].split('|');
        this.maxGames = numberVal(c[0]);
        var leagueId = numberVal(c[1]);
        console.log('maxGames', this.maxGames);

        var leaders = items[2].split('<li>');
        var ipHash = {};
        var maxWait = 0;
        this.availablePlayers = 0;
        this.fullLeaderList = [];
        var hotStreakList = [];
        var coldStreakList = [];

        for (var x = 0; x < leaders.length; x++) {
          var line = leaders[x];
          var player = leaderFromLine(line);
  //        console.log(player);
          if (player.name.length > 0) {
            if (ipHash[player.ip]) {
              this.ipCheck = 'ipViolation!!!';
              this.ipViolator = player.name;
              ipHash[player.ip]++;
            } else
              ipHash[player.ip] = 1;
            if (player.games_max > player.games_playing && player.days_old < 2) {
              this.availablePlayers++;
              //					console.log('xxx', player.name, player);
              if (player.hoursWaiting >= maxWait) {
                maxWait = player.hoursWaiting;
                this.userWaiting = player; //
              }
            }
            if (player.days_old <= 3) {
              this.fullLeaderList.push(player);
              if (player.stk > 0)
                hotStreakList.push(player);
              if (player.stk < 0)
                coldStreakList.push(player);
            }
          }
        }
        this.hotStreakList = hotStreakList.sort(function (a, b) { return a.stk - b.stk; }).slice(0,5);
        this.coldStreakList = coldStreakList.sort(function (a, b) { return a.stk - b.stk; }).slice(0,5);

        this.loadingFlg = false;
      })
      .catch(error => {
        this.loadingFlg = false;
        this.showAlertPopup('Network API Error! See console logs.', 1);
        console.log('executeTextApi Error', error);
      });
  }


}
