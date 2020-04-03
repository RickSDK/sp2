import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

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
  public selectedGame = 0;
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

  constructor() { super(); }

  ngOnInit(): void {
    this.user = userObjFromUser();
    this.loadGames();
  }
  selectGame(game) {
    this.selectedGame = (this.selectedGame == game) ? 0 : game;
  }
  enterGame(game) {
    this.showAlertPopup('Not coded yet', 1);
  }
  refreshGames($event) {
    console.log('refresh games!');
  }

  loadGames() {

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
          var c = basics.split('|');
          var multiPlayerObj = getMultObjFromLine(basics);
          var newGame = c[11];
          var oldGame = c[12];
          var gameResult = c[13];
          var minutes = c[14];
          console.log('basics', basics, multiPlayerObj);
          /*
                    if (oldGame.length > 0) {
                      if (gameResult == 'Win')
                        playSound('Cheer.mp3', 0, $scope.muteSound);
                      else
                        playSound('CrowdBoo.mp3', 0, $scope.muteSound);
                      displayFixedPopup('newGamePopup');
                      $scope.newGame = false;
                      $scope.gameName = oldGame;
                      $scope.gameResult = gameResult;
                    } else if (newGame.length > 0) {
                      playSound('tada.mp3', 0, $scope.muteSound);
                      displayFixedPopup('newGamePopup');
                      $scope.gameName = newGame;
                      $scope.newGame = true;
                    }*/
          var games = items[1].split("<a>");
          for (var x = 0; x < games.length; x++) {
            var game = games[x];
            if (game.length > 10) {
              var gameOb = gameFromLine(game, this.user.userName);
              fullGameList.push(gameOb);
              console.log(gameOb);
            }
          } // <-- for
          this.fullGameList = fullGameList;
          this.filterGames(0);

        }
        //        console.log(data);
      })
      .catch(error => {
        this.loadingFlg = false;
        this.showAlertPopup('Network API Error! See console logs.', 1);
        console.log('executeTextApi Error', error);
      });
  }
  filterGames(num: number) {
    this.buttonIdx = num;
    var gameList = [];
    this.fullGameList.forEach(game => {
      if (num == 0 && game.inGame)
        gameList.push(game);
      if (num == 1 && game.status == 'Open')
        gameList.push(game);
      if (num == 2 && game.status == 'Playing')
        gameList.push(game);
      if (num == 3 && game.status == 'Complete')
        gameList.push(game);
      if (num == 4 && game.mmFlg)
        gameList.push(game);
    });
    this.gameList = gameList;
  }
  ngClassGameButton(game: any) {
    if (game.mmFlg)
      return 'btn btn-info roundButton';
    if (game.turn == this.user.userName)
      return 'btn btn-warning roundButton';
    if (game.status == 'Open')
      return 'btn btn-success roundButton';
    if (game.status == 'Complete')
      return 'btn btn-secondary roundButton';
    if (game.status == 'Playing')
      return 'btn btn-primary roundButton';
  }
  ngClassGame(game) {
    if (game.mmFlg)
      return 'darkBlueBg';
    else
      return 'darkPurpleBg';

  }

}
