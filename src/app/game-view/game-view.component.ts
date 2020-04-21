import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var displayFixedPopup: any;
declare var $: any;
declare var userObjFromUser: any;
declare var getCurrentPlayer: any;
declare var saveGame: any;

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent extends BaseComponent implements OnInit {
  @Input('gameObj') gameObj: any;
  @Input('ableToTakeThisTurn') ableToTakeThisTurn: any;
  public user: any;
  public createdDay = '';

  constructor() { super(); }

  ngOnInit(): void {
    this.user = userObjFromUser();
    this.createdDay = this.gameObj.created.split(' ')[0];
  }
  surrenderButtonPressed() {
    displayFixedPopup('surrenderPopup');
    $('#gamePlayersPopup').modal('hide');
  }
  computerGo() {
    this.closeModal('#gamePlayersPopup');
    displayFixedPopup('computerTakeTurnPopup');
  }
  reportBug() {
    this.playClick();
    this.infoFlg = !this.infoFlg;
  }
  postChat() {
    var message = this.databaseSafeValueOfInput("msgField");
    if (message.length == 0) {
      this.showAlertPopup('no message', 1);
      return;
    }
    $('#msgField').val('');

    var url = this.getHostname() + "/webChat.php";
    const postData = this.getPostDataFromObj({
      user_login: this.user.userName,
      code: this.user.code,
      game_id: this.gameObj.id,
      action: 'postMessage',
      message: '**Bug Alert** ' + message,
      recipient: 'All',
      bugFlg: 'Y'
    });
    console.log(postData);

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        if (this.verifyServerResponse(data)) {
          this.infoFlg = false;
          this.closeModal('#gamePlayersPopup');
          this.showAlertPopup('Bug message has been submitted. Thanks!');
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });

  }
  adminSaveGame() {
    this.playClick();
    var currentPlayer = getCurrentPlayer(this.gameObj);
    saveGame(this.gameObj, this.user, currentPlayer);
    this.showAlertPopup('saved');
  }
  turnAllPlayersHuman() {
    this.playClick();
    console.log('turnAllPlayersHuman');
    this.gameObj.players.forEach(player => {
      if (player.userId != '30')
        player.cpu = false;
    });
  }
}
