import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { exit } from 'process';
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
  @Output() messageEvent = new EventEmitter<string>();
  public maxGames = 0;
  public maxPoints = 0;
  public loadingFlg = true;
  public ipCheck: string;
  public ipViolator: string;
  public ipViolateFlg = false;
  public ipShowPlayersFlg = false;
  public userWaiting: any;
  public availablePlayers = 0;
  public fullLeaderList = [];
  public hotStreakList = [];
  public coldStreakList = [];

  constructor() { super(); }

  ngOnInit(): void {
  }
  show() {
    console.log(this.user);
    this.infoFlg = (this.user.games_max == 0);
    this.maxGames = this.user.games_max;
    this.openModal('#matchmakerStandingsPopup');
    this.loadLeagueData(1);
  }
  joinLeague() {
    this.playClick();
    this.loadingFlg = true;
    var url = this.getHostname() + "/webLeaders.php";
    var postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, action: 'joinLeague' });
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        this.showAlertPopup('Congratulations! you are now in the league! Games will start automatically once enough people are ready.');
        this.closeModal('#matchmakerStandingsPopup');
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  exitLeague() {
    this.playClick();
    this.loadingFlg = true;
    var url = this.getHostname() + "/webLeaders.php";
    var postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, action: 'exitLeague' });
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        this.showAlertPopup('You have left the league. Rejoin at any time.');
        this.closeModal('#matchmakerStandingsPopup');
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  showPlayer(player) {
    this.closeModal('#matchmakerStandingsPopup');
    this.messageEvent.emit(player);
  }
  changeMaxGames(num: number) {
    this.maxGames += num;
    this.playClick();
    var url = this.getHostname() + "/webLeaders.php";
    var postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, action: 'changeMax_games', maxGames: this.maxGames });
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  loadLeagueData(ladder_id: number) {
    this.loadingFlg = true;
    var url = this.getHostname() + "/webLeaders.php";
    var postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, maxGames: this.maxGames, action: '', ladder_id: ladder_id });

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        var items = data.split("<br>");
        var c = items[1].split('|');
        this.maxGames = numberVal(c[0]);
        var leagueId = numberVal(c[1]);

        var leaders = items[2].split('<li>');
        var ipHash = {};
        var maxWait = 0;
        this.availablePlayers = 0;
        this.fullLeaderList = [];
        var hotStreakList = [];
        var coldStreakList = [];
        this.ipViolateFlg = false;

        for (var x = 0; x < leaders.length; x++) {
          var line = leaders[x];
          var player = leaderFromLine(line);
          //console.log(player);
          if (player.points > this.maxPoints)
            this.maxPoints = player.points;
          if (player.name.length > 0) {
            if (ipHash[player.ip]) {
              //this.ipCheck = 'ipViolation!!!';
              //this.ipViolateFlg = true;
              //this.ipViolator = player.name;
              //ipHash[player.ip]++;
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
        this.hotStreakList = hotStreakList.sort(function (a, b) { return b.stk - a.stk; }).slice(0, 5);
        this.coldStreakList = coldStreakList.sort(function (a, b) { return a.stk - b.stk; }).slice(0, 5);

        this.loadingFlg = false;
      })
      .catch(error => {
        this.loadingFlg = false;
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  startMMGames(points = 0) {
    this.playClick();
    this.availablePlayers = 1;
    console.log('xxx startMMGames', points);

    var tollarance = 200 - this.fullLeaderList.length;
    if (tollarance < 15)
      tollarance = 15;
    var readyList = [];
    var ipHash = {};
    console.log('xxx tollarance', tollarance);
    this.fullLeaderList.forEach(function (player) {
      //player.ptDiff = Math.abs(player.points - points);
      player.ptDiff = player.games_max - player.games_playing;
      if (player.games_playing == 0)
        player.ptDiff = 5;
      if (player.games_max > player.games_playing && player.days_old <= 1) {
        console.log('player ready: ', player.userName, player.ptDiff, player.userId);
        if (player.ptDiff <= tollarance) {

          var num = numberVal(ipHash[player.ip]);
          if (num == 0)
            ipHash[player.ip] = 0;
          ipHash[player.ip]++;

          if (ipHash[player.ip] == 1)
            readyList.push(player);
          else
            console.log('ip dupe!!', player.name, player.ip);
        }
      }
    });
    console.log(readyList.length + ' players within ' + tollarance + ' points of ' + points);
    readyList.sort(function (a, b) { return b.ptDiff - a.ptDiff; });

    var numPlayers = 8;
    var gameTypes = ["battlebots", "diplomacy", "autobalance", "freeforall", "firefight", "hungerGames", "barbarian", "co-op", "ffa-5", "ffa-6", "ffa-7"];
    var gameType = gameTypes[Math.floor((Math.random() * gameTypes.length))];
    if (gameType == 'co-op')
      numPlayers = 3;
    if (gameType == 'battlebots')
      numPlayers = 4;
    if (gameType == 'ffa-5')
      numPlayers = 5;
    if (gameType == 'ffa-6')
      numPlayers = 6;
    if (gameType == 'ffa-7')
      numPlayers = 7;


    if (readyList.length < numPlayers) {
      this.availablePlayers = readyList.length;
      this.showAlertPopup('Not enough players found! tollarance: ' + tollarance + ', players found: ' + readyList.length, 1);
      return;
    }
    console.log('readyList', readyList);
    var finalList = [];
    for (var x = 0; x < numPlayers; x++) {
      finalList.push(readyList[x].id);
    }
    var fList = finalList.join('|');
    console.log(gameType, numPlayers, fList);
    this.startthisMMGame(fList, gameType); //start_games
  }
  startthisMMGame(pList: string, type: string) {
    const url = this.getHostname() + "/webLadder.php";
    const postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'start_games2', pList: pList, type: type });

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        console.log(data);
        if (this.verifyServerResponse(data)) {
          this.showAlertPopup('Success!');
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }


}
