import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';
import { UserPopupComponent } from '../user-popup/user-popup.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

declare var userObjFromUser: any;
declare var getMultObjFromLine: any;
declare var gameFromLine: any;
declare var createNewGameFromInitObj: any;
declare var objPiecesFrom: any;
declare var spVersion: any;
declare var googleAds: any;
declare var $: any;

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss']
})
export class MultiplayerComponent extends BaseComponent implements OnInit {
  @ViewChild(UserPopupComponent) userPopupComp: UserPopupComponent;
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
  public multiPlayerObj: any;
  public buttonAction: string;
  public buttonActionMessage: string;
  public playerId: number;
  public spVersion = spVersion();
  public teams = ['1', '2', 'R'];
  public teamIdx = 0;
  public selectedTeam = this.teams[0];

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    googleAds();
    this.user = userObjFromUser();
    this.adminFlg = (this.user.userId == 10);
    this.loadGames();
  }
  showPlayer(player: any) {
    this.userPopupComp.show(player);
  }
  changeTeam() {
    this.teamIdx++;
    if (this.teamIdx > 2)
      this.teamIdx = 0;
    this.selectedTeam = this.teams[this.teamIdx];
  }
  selectGame(game) {
    if (1 || this.user.userName == 'Rick')
      console.log(game);
    if (game.status == 'Open') {
      this.playSound('error.mp3');
      return;
    }
    this.playClick();
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
          var gameToStart;
          this.multiPlayerObj = getMultObjFromLine(basics);
          var accountSitGameName;
          //console.log(this.multiPlayerObj);
          if (this.multiPlayerObj.urgentCount > 0)
            this.showAlertPopup('You have an urgent piece of mail!', 1);

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
          this.multiPlayerObj.usersOnline = items[2];
          var accountSitTotal = 0;
          var slowResponseFlg = false
          for (var x = 0; x < games.length; x++) {
            var game = games[x];
            if (game.length > 10) {
              var gameOb = gameFromLine(game, this.user.userName);
              if (gameOb.accountSitFlg) {
                accountSitTotal++;
                accountSitGameName = gameOb.name;
              }
              if (gameOb.slowResponseFlg)
                slowResponseFlg = true;
              if (gameOb.status == 'Picking Nations') {
                console.log('start this!', gameOb);
                gameToStart = gameOb;
              }
              fullGameList.push(gameOb);
              //console.log(gameOb);
            }
          } // <-- for

          if (accountSitTotal > 0)
            this.showAlertPopup('You are able to account sit in game: ' + accountSitGameName);
          else if (slowResponseFlg)
            this.showAlertPopup('You have run out of time in one of your games. Please take it asap.');

          this.fullGameList = fullGameList;
          if (gameToStart && gameToStart.gameId > 0) {
            setTimeout(() => {
              this.startThisMultiplayerGame(gameToStart);
            }, 500);
          }
          this.filterGames(0);

        }
        //        console.log(data);
      })
      .catch(error => {
        this.loadingFlg = false;
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  startThisMultiplayerGame(game: any) {
    console.log('starting!', game);
    var gameObj = createNewGameFromInitObj(game, this.superpowersData.units);
    console.log('started this game:', gameObj);
    var turn = gameObj.players[0].id;
    if (!turn || turn == 0) {
      this.showAlertPopup('no turn!', 1);
      return;
    }
    var gameData = objPiecesFrom(gameObj);
    console.log('Starting up the game!!!', gameData);
    this.selectedGame = game;
    this.createWebServiceCall('gameAFoot', gameData, turn);
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
    if (game.status == 'Open')
      return 'btn btn-success roundButton';
    if (game.status == 'Complete')
      return 'btn btn-secondary roundButton';
    if (game.turn == this.user.userName)
      return 'btn btn-warning roundButton glowYellow';

    if (game.accountSitFlg)
      return 'btn btn-primary roundButton glowBlue';

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
        this.selectedTeam = 'R';
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
      localStorage.chatFlg = (game.chatFlg) ? 'Y' : 'N';
      this.router.navigate(['/board'], { queryParams: { 'id': game.gameId } });
    }
  }
  joinAcceptButtonPressed() {
    this.playClick();
    this.closePopup('joinConfirmationPopup');
    this.createWebServiceCall('join', null, 0);
  }
  changeTeamOfPlayer(game: any, player: any) {
    var newTeam = player.team;
    if (player.team == '1')
      newTeam = '2';
    if (player.team == '2')
      newTeam = 'R';
    if (player.team == 'R')
      newTeam = '1';
    player.team = newTeam;

    const url = this.getHostname() + "/webSuperpowers.php";
    $.post(url,
      {
        userId: this.user.userId,
        code: this.user.code,
        action: 'changePlayerTeam',
        gameId: game.gameId,
        playerId: player.playerId,
        team: newTeam
      },
      function (data, status) {
        console.log('data', data);
      });

  }
  createWebServiceCall(action: string, gameData: any, turn: number) {
    var url = this.getHostname() + "/web_join_game2.php";
    var nation = this.selectedNation;
    if (!this.selectedGame) {
      this.showAlertPopup('no game!', 1);
      console.log('no game!!!');
      return;
    }
    console.log('game', this.selectedGame);
    if (this.selectedGame.auto_assign_flg)
      nation = 0;

    var objMain = '';
    var logs = '';
    var players = '';
    var territories = '';
    var units = '';
    if (gameData) {
      objMain = JSON.stringify(gameData.objMain)
      logs = JSON.stringify(gameData.logs)
      players = JSON.stringify(gameData.players)
      territories = JSON.stringify(gameData.territories)
      units = JSON.stringify(gameData.units)
    }

    var postData = this.getPostDataFromObj({
      user_login: this.user.userName,
      code: this.user.code,
      action: action,
      game_id: this.selectedGame.gameId,
      nation: nation,
      team: this.selectedTeam,
      playerId: this.playerId,
      turn: turn,
      objMain: objMain,
      logs: logs,
      players: players,
      territories: territories,
      units: units
    });
    console.log('postData', postData);
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        console.log('data', data);
        if (this.verifyServerResponse(data)) {
          this.showAlertPopup('success');
          this.loadGames();
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  removePlayerFromGame(game: any, player: any) {
    this.buttonAction = 'removePlayer';
    this.selectedGame = game;
    this.playerId = player.id;
    this.buttonActionMessage = 'Remove ' + player.name + ' from this game?';
    this.displayFixedPopup('actionConfirmationPopup');

  }
  openGameButtonPressed(game: any, action: string) {
    this.playClick();
    this.buttonAction = action;
    this.selectedGame = game;
    if (action == 'start') {
      this.buttonActionMessage = 'Start this game?';
      var numPlayers = 0;
      game.players.forEach(player => {
        if (player.name != 'Computer')
          numPlayers++;
      });
      if (numPlayers < 2) {
        this.showAlertPopup('You need at least 2 human players to start a game.', 1);
        return;
      }
    }
    if (action == 'add_computer')
      this.buttonActionMessage = 'Add a computer player to this game?';
    if (action == 'cancelGame')
      this.buttonActionMessage = 'Delete this game?';
    if (action == 'leaveGame')
      this.buttonActionMessage = 'Leave this game?';

    this.displayFixedPopup('actionConfirmationPopup');
  }
  confirmButtonPressed() {
    this.playClick();
    this.createWebServiceCall(this.buttonAction, null, 0);
    this.closePopup('actionConfirmationPopup');
  }
  cycleNationsButtonPressed() {
    this.nationPointer++;
    if (this.nationPointer >= this.availableNations.length)
      this.nationPointer = 0;
    this.selectedNation = this.availableNations[this.nationPointer];
  }
  teamButtonClicked = function () {
    this.playClick();
    if (this.selectedTeam == '2')
      this.selectedTeam = 'R';
    else if (this.selectedTeam == '1')
      this.selectedTeam = '2';
    else if (this.selectedTeam == 'R')
      this.selectedTeam = '1';
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
