import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';

declare var userObjFromUser: any;
declare var getMultObjFromLine: any;
declare var gameFromLine: any;

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss']
})
export class MultiplayerComponent extends BaseComponent implements OnInit {
  public user: any;
  public buttonIdx = 0;
  public selectedGame: any;
  public selectedGameNum = 0;
  public nationPointer = 0;
  public gameList = [];
  public fullGameList = [];
  public titles = [
    { icon: 'fa-star', title: 'My Games' },
    { icon: 'fa-plus', title: 'Open Games' },
    { icon: 'fa-play', title: 'Games in Progress' },
    { icon: 'fa-stop', title: 'Recently Completed Games' },
    { icon: 'fa-trophy', title: 'Matchmaking Games' },
    { icon: 'fa-bug', title: 'Bug Games' },
    { icon: 'fa-clock-o', title: 'Late Games' },
  ];
  public loadingFlg = true;
  public adminFlg = false;
  public count0 = 0;
  public count1 = 0;
  public count2 = 0;
  public count3 = 0;
  public count4 = 0;
  public count5 = 0;
  public count6 = 0;
  public availableNations = [];
  public selectedNation = 1;
  public teamName: string;
  public multiPlayerObj:any;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.user = userObjFromUser();
    this.adminFlg = (this.user.userId == 10);
    this.loadGames();
  }
  selectGame(game) {
    this.selectedGameNum = (this.selectedGameNum == game) ? 0 : game;
    this.closePopup('joinConfirmationPopup');
  }
  refreshGames($event) {
    console.log('refresh games!');
    this.loadGames();
  }

  loadGames() {
    this.loadingFlg = true;
    this.fullGameList = [];
    const url = this.getHostname() + "/web_games3.php";
    const postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, version: 'none' });

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        this.loadingFlg = false;
        if (this.verifyServerResponse(data)) {
          var fullGameList = [];
          var items = data.split("<b>");
          var basics = items[0];
          this.multiPlayerObj = getMultObjFromLine(basics);
          console.log(this.multiPlayerObj);

          if (this.multiPlayerObj.oldGame.length > 0) {
            if (this.multiPlayerObj.gameResult == 'Win')
              this.playSound('Cheer.mp3');
            else
              this.playSound('CrowdBoo.mp3');
            this.displayFixedPopup('newGamePopup');
          } else if (this.multiPlayerObj.newGame.length > 0) {
            this.playSound('tada.mp3');
            this.displayFixedPopup('newGamePopup');
          }
          var games = items[1].split("<a>");
          this.multiPlayerObj.usersOnline=items[2];
          for (var x = 0; x < games.length; x++) {
            var game = games[x];
            if (game.length > 10) {
              var gameOb = gameFromLine(game, this.user.userName);
              fullGameList.push(gameOb);
              //console.log(gameOb);
            }
          } // <-- for
          this.fullGameList = fullGameList;
          this.filterGames(0);

        }
        //        console.log(data);
      })
      .catch(error => {
        this.loadingFlg = false;
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  filterGames(num: number) {
    this.buttonIdx = num;
    var gameList = [];
    this.count0 = 0;
    this.count1 = 0;
    this.count2 = 0;
    this.count3 = 0;
    this.count4 = 0;
    this.count5 = 0;
    this.count6 = 0;
    this.fullGameList.forEach(game => {
      if (game.inGame) {
        this.count0++;
        if (num == 0)
          gameList.push(game);
      }
      if (game.status == 'Open') {
        this.count1++;
        if (num == 1)
          gameList.push(game);
      }
      if (game.status == 'Playing') {
        this.count2++;
        if (num == 2)
          gameList.push(game);
      }
      if (game.status == 'Complete') {
        this.count3++;
        if (num == 3)
          gameList.push(game);
      }
      if (game.mmFlg) {
        this.count4++;
        if (num == 4)
          gameList.push(game);
      }
      if (game.bugFlg) {
        this.count5++;
        if (num == 5)
          gameList.push(game);
      }
      if (game.status == 'Playing' && (game.turnObj.timeLeft == '-Times up-' || game.turnObj.last_login_time > 36)) {
        this.count6++;
        if (num == 6)
          gameList.push(game);
      }
    });
    this.gameList = gameList;
  }
  ngClassGameButton(game: any) {
    if (game.turn == this.user.userName)
      return 'btn btn-warning roundButton glowYellow';
    if (game.status == 'Open')
      return 'btn btn-success roundButton';
    if (game.status == 'Complete')
      return 'btn btn-secondary roundButton';
    if (game.status == 'Playing')
      return 'btn btn-primary roundButton';
    if (game.mmFlg)
      return 'btn btn-info roundButton';
  }
  ngClassGame(game) {
    if (game.mmFlg)
      return 'darkBlueBg';
    else
      return 'darkPurpleBg';

  }
  enterGame(game) {
    if (game.status == 'Open') {
      if (game.inGame)
        this.showAlertPopup('Waiting for game to start.', 1);
      else {
        if (this.user.userId == 0) {
          this.showAlertPopup('You must login before joining a game.', 1);
          return;
        }
        if (game.numPlayers >= game.size) {
          this.showAlertPopup('Sorry, game is full.', 1);
          return;
        }
        if (game.minRank > 0 && game.minRank == game.maxRank && this.user.rank != game.maxRank) {
          this.showAlertPopup('Sorry, you must be a ' + this.superpowersData.ranks[game.maxRank].name + ' to join this game.', 1);
          return;
        }
        if (game.minRank > 0 && this.user.rank < game.minRank) {
          this.showAlertPopup('Sorry, you must be a ' + this.superpowersData.ranks[game.minRank].name + ' or higher to join this game.', 1);
          return;
        }
        if (game.maxRank > 0 && this.user.rank > game.maxRank) {
          //         this.showAlertPopup('Sorry, you must be a ' + this.superpowersData.ranks[game.maxRank].name + ' or lower to join this game.', 1);
          //        return;
        }
        this.selectedGame = game;
        this.teamName = 'R';
        this.availableNations = populateAvailableNations(game);
        this.nationPointer = 0;
        if (game.auto_assign_flg == 'Y')
          this.selectedNation = 0;
        else
          this.selectedNation = this.availableNations[this.nationPointer];
        this.displaySPPopup("joinConfirmationPopup");
      } //<-- join

    } else {
      // enter game
      localStorage.loadGameId = game.gameId;
      this.router.navigate(['/board']);
    }
  }
  joinAcceptButtonPressed() {
    this.playClick();
    this.closePopup('joinConfirmationPopup');
    console.log('hey');
  }
  cycleNationsButtonPressed() {
    this.nationPointer++;
    if (this.nationPointer >= this.availableNations.length)
      this.nationPointer = 0;
    this.selectedNation = this.availableNations[this.nationPointer];
  }
  teamButtonClicked = function () {
    this.playClick();
    if (this.teamName == '2')
      this.teamName = 'R';
    else if (this.teamName == '1')
      this.teamName = '2';
    else if (this.teamName == 'R')
      this.teamName = '1';
  }
}

function populateAvailableNations(game) {
  var availableNations = [];
  for (var i = 1; i <= 8; i++) {
    if (nationIsAvailable(i, game))
      availableNations.push(i);
  }
  return availableNations;
}
function nationIsAvailable(nation, game) {
  for (var x = 0; x < game.players.length; x++) {
    var player = game.players[x];
    if (player.nation == nation)
      return false;
  }
  return true;
}
