import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var getGameTypesObj: any;
declare var numPlayersPerType: any;
declare var databaseSafeValueOfInput: any;
declare var getCheckedValueOfField: any;
declare var getHostname: any;
declare var getPostDataFromObj: any;
declare var verifyServerResponse: any;

@Component({
  selector: 'app-create-game-popup',
  templateUrl: './create-game-popup.component.html',
  styleUrls: ['./create-game-popup.component.scss']
})
export class CreateGamePopupComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  @Input('user') user: any;
  public gameTypes: any;
  public gameType: any;
  public selectedNation = 1;
  public gameTypeIdx = 0;
  public numberPlayers = 8;
  public autoAssignFlg = true;
  public fogIdx = 0;
  public game = { name: 'test' };
  public sendingFlg = false;
  public teams = ['1', '2', 'R'];
  public teamIdx = 0;
  public selectedTeam = this.teams[0];

  constructor() { super(); }

  ngOnInit(): void {
    this.gameTypes = getGameTypesObj();
    this.gameType = this.gameTypes[0];

  }
  show() {
    this.openModal('#createGamePopup');
    this.sendingFlg = false;
  }
  changeAutoAssign() {
    this.playClick();
    this.autoAssignFlg = !this.autoAssignFlg;
  }
  changeTeam() {
    this.teamIdx++;
    if (this.teamIdx > 2)
      this.teamIdx = 0;
    this.selectedTeam = this.teams[this.teamIdx];
  }
  changeNation() {
    this.playClick();
    this.selectedNation++;
    if (this.gameType.type == 'ww2') {
      if (this.selectedNation > 14)
        this.selectedNation = 11;
    } else {
      if (this.selectedNation > 8)
        this.selectedNation = 1;
    }
  }
  changeType() {
    this.playClick();
    this.gameTypeIdx++;
    if (this.gameTypeIdx >= this.gameTypes.length)
      this.gameTypeIdx = 0;
    this.gameType = this.gameTypes[this.gameTypeIdx];
    this.checkNumberOfPlayers();
  }
  loadType(gameType) {
    this.gameType = gameType;
    this.checkNumberOfPlayers();
  }
  changeNumPlayers() {
    this.playClick();
    this.numberPlayers++;
    if (this.numberPlayers > 8)
      this.numberPlayers = 2;
    this.checkNumberOfPlayers();

  }
  checkNumberOfPlayers() {
    if (this.gameType.type == 'ww2')
      this.selectedNation = 11;
    else
      this.selectedNation = 1;
    var numPlayersForGame = numPlayersPerType(this.gameType.type);
    if (this.numberPlayers > numPlayersForGame.max)
      this.numberPlayers = numPlayersForGame.max;
    if (this.numberPlayers < numPlayersForGame.min)
      this.numberPlayers = numPlayersForGame.min;

  }
  createGameButtonPressed() {
    this.playClick();
    var nameField = databaseSafeValueOfInput('nameField');
    if (nameField.length == 0) {
      this.showAlertPopup('Name field is blank', 1);
      return;
    }
    var password = '';
    if (getCheckedValueOfField('privateOpt')) {
      password = databaseSafeValueOfInput('passField');
      if (password.length == 0) {
        this.showAlertPopup('Password field is blank', 1);
        return;
      }
    }
    var fogOfWar = (this.fogIdx > 0) ? 'Y' : 'N';
    var hardFog = (this.fogIdx > 1) ? 'Y' : 'N';
    var autoAssign = getCheckedValueOfField('autoAssign') ? 'Y' : 'N';
    var autoStart = getCheckedValueOfField('autoStart') ? 'Y' : 'N';
    var autoSkip = getCheckedValueOfField('autoSkip') ? 'Y' : 'N';
    var noSpecs = getCheckedValueOfField('noSpecs') ? 'Y' : 'N';
    var noStats = getCheckedValueOfField('noStats') ? 'Y' : 'N';
    var officersOnly = getCheckedValueOfField('officersOnly') ? 'Y' : 'N';
    var noGenerals = getCheckedValueOfField('noGenerals') ? 'Y' : 'N';
    var sameRank = getCheckedValueOfField('sameRank') ? 'Y' : 'N';
    var turboFlg = getCheckedValueOfField('turboFlg') ? 'Y' : 'N';
    var hostRank = this.user.rank;
    var attackRound = '6';
    var newEngineFlg = 'Y';
    var minRank = 0;
    var maxRank = 0;
    if (officersOnly == 'Y')
      minRank = 7;
    if (noGenerals == 'Y')
      maxRank = 13;
    if (sameRank == 'Y') {
      minRank = hostRank;
      maxRank = hostRank;
    }
    if (nameField.indexOf("'") > -1) {
      nameField = nameField.replace("'", "");
    }
    var nation = this.selectedNation;
    if (autoAssign == 'Y')
      nation = 0;


    var components = [nameField, this.gameType.type, this.numberPlayers, attackRound, fogOfWar, autoAssign
      , autoStart, autoSkip, noSpecs, noStats, newEngineFlg, minRank, maxRank, hostRank, password, hardFog, turboFlg, nation];
    var data = components.join('|');
    this.sendingFlg = true;
    this.createGame(data, nation);
  }
  createGame(dataLine: string, nation: number) {

    const url = getHostname() + "/web_join_game2.php";
    const postData = getPostDataFromObj({ user_login: localStorage.userName, code: this.user.code, data: dataLine, action: 'createGame', nation: nation, team: this.selectedTeam });

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        if (verifyServerResponse('success', data)) {
          this.showAlertPopup('Success!');
          this.messageEvent.emit('done');
        } else {
          this.showAlertPopup('Error! ' + data);
        }
        $("#createGamePopup").modal('hide');
        this.sendingFlg = false;
      })
      .catch(error => {
        $("#createGamePopup").modal('hide');
        this.sendingFlg = false;
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
}
