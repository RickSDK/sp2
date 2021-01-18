import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { splitAtColon } from '@angular/compiler/src/util';

declare var $: any;
declare var messageFromLine: any;
declare var userObjFromUser: any;
declare var changeClass: any;

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.scss']
})
export class ChatPopupComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public recipients = ['All', 'Allies', 'Player'];
  public recipient = this.recipients[0];
  public recipientId = 0;
  public recipientNation = 1;
  public recipientNationId = 0;
  public chatCount = 0;
  public usersOnline: string;
  public chatMessages = [];
  public alivePlayers = [];
  public isMobileFlg = true;
  public editPostMode = false;
  public chatId = 0;
  public editMode = false;
  public yourPlayer: any;
  public gameId = 1;
  public bugFlg = false;
  public filterNation: number = 0;
  public allMessages: any;
  public yourNation = 0;

  constructor() { super(); }

  ngOnInit(): void {

  }
  show(gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any, yourPlayer: any, bugFlg = false) {
    this.user = user;
    this.bugFlg = bugFlg;
    changeClass('chatButton', 'btn btn-primary tight roundButton');
    this.isMobileFlg = (window.innerWidth < 500);
    if (gameObj) {
      if (!user) {
        user = userObjFromUser();
      }
      this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
      this.yourPlayer = yourPlayer;
      if (this.yourPlayer && this.yourPlayer.nation)
        this.yourNation = this.yourPlayer.nation;

      var alivePlayers = [];
      gameObj.players.forEach(player => {
        if (player.alive && !player.cpu)
          alivePlayers.push(player);
      });
      this.alivePlayers = alivePlayers;
      this.gameId = this.gameObj.id
    } else {
      this.gameId = 1;
    }
    this.loadChatMessages('');

    this.openModal('#chatPopup');
  }
  changeFilter(num: number) {
    this.filterNation = num;
    this.filterChatMessages();
  }
  filterChatMessages() {
    var messages = [];
    this.allMessages.forEach(msg => {
      if (this.filterNation == 0 || this.filterNation == msg.nation || msg.nation == this.yourNation)
        messages.push(msg);
    });
    this.chatMessages = messages;
  }
  loadChatMessages(noLimitFlg: string) {
    const url = this.getHostname() + "/webChat.php";
    const postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, game_id: this.gameId, noLimitFlg: noLimitFlg });

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        var items = data.split("<b>");
        var basics = items[0].split("|");
        this.chatCount = this.numberVal(basics[2]);
        var messages = items[1].split("<br>");
        this.usersOnline = items[2].split('|').join(', ');
        var chatMessages = [];
        messages.forEach(function (msg) {
          if (msg.length > 3)
            chatMessages.push(messageFromLine(msg));
        });
        this.chatMessages = chatMessages;
        this.allMessages = chatMessages;
        this.messageEvent.emit('refresh');
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });

  }
  postChat(num: number) {
    var message1 = this.databaseSafeValueOfInput("msgField");
    var message2 = this.databaseSafeValueOfInput("msgArea");
    var message = message1 || message2;
    var bugFlg = (this.bugFlg) ? 'Y' : '';
    if (!message || message.length == 0) {
      this.showAlertPopup('no message', 1);
      return;
    }
    $('#msgField').val('');
    $('#msgArea').val('');

    if (this.bugFlg)
      message = '**Bug Alert** ' + message;
    var treaties = '';
    if (this.gameId > 1 && this.yourPlayer)
      this.yourPlayer.treaties.join('+');

    var url = this.getHostname() + "/webChat.php";
    const postData = this.getPostDataFromObj({
      user_login: this.user.userName,
      code: this.user.code,
      game_id: this.gameId,
      action: 'postMessage',
      message: message,
      treaties: treaties,
      recipient: this.recipient,
      chatId: this.chatId,
      nation: this.recipientNation,
      bugFlg: bugFlg
    });
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        if (this.verifyServerResponse(data)) {
          this.loadChatMessages('');
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  replyToChat(chat: any) {
    if (chat.name == this.user.userName) {
      if (!this.editPostMode) {
        $('#msgField').val('');
        $('#msgArea').val('');
      }
      this.chatId = chat.rowId;
    } else {
      if (this.gameId == 1) {
        $('#msgField').val('@' + chat.name + ': ');
        $('#msgArea').val('@' + chat.name + ': ');
      }
      this.editPostMode = false;
      this.chatId = 0;
      this.recipient = 'Player';
      this.recipientNation = chat.nation;
    }
  }
  replyToPlayer(player: any) {
    this.recipientNation = player.nation;
    this.recipientId = 2;
    this.recipient = this.recipients[this.recipientId];
  }
  changeRecpient() {
    this.recipientId++;
    if (this.recipientId > 2)
      this.recipientId = 0;
    this.recipientNation = 0;
    this.recipient = this.recipients[this.recipientId];
    if (this.recipientId == 2)
      this.recipientNation = this.alivePlayers[this.recipientNationId].nation;
  }
  showOlderMessages() {
    this.loadChatMessages('Y');
  }
  changePlayer() {
    this.recipientNationId++;
    if (this.recipientNationId >= this.alivePlayers.length)
      this.recipientNationId = 0;
    this.recipientNation = this.alivePlayers[this.recipientNationId].nation;
  }
  chooseChatPlayer(nation: number) {
    this.recipientNation = nation;
  }
  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  editPost(chat: any) {
    this.editPostMode = !this.editPostMode;
    if (this.editPostMode) {
      var chatId = this.chatId;
      this.chatMessages.forEach(function (msg) {
        if (msg.rowId == chatId) {
          $('#msgArea').val(msg.message);
          $('#msgField').val(msg.message);
        }

      });
    } else {
      $('#msgField').val('');
      $('#msgArea').val('');
    }

  }
  deletePost(chat: any) {
    const url = this.getHostname() + "/webChat.php";
    const postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, action: 'deleteMessage', chatId: chat.rowId });
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        console.log('data', data);
        if (this.verifyServerResponse(data)) {
          this.loadChatMessages('');
        }
      })
      .catch(error => {
        this.showAlertPopup('Possible error: ' + error, 1);
      });
  }


}
