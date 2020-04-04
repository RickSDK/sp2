import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var messageFromLine: any;

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.scss']
})
export class ChatPopupComponent extends BaseComponent implements OnInit {
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

  constructor() { super(); }

  ngOnInit(): void {

  }
  show(gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any, isMobileFlg: boolean) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    this.isMobileFlg = (window.innerWidth < 500);

    var alivePlayers = [];
    gameObj.players.forEach(player => {
      if (player.alive && !player.cpu)
        alivePlayers.push(player);
    });
    this.alivePlayers = alivePlayers;


    this.loadChatMessages('');

    this.openModal('#chatPopup');
  }
  loadChatMessages(noLimitFlg: string) {
    const url = this.getHostname() + "/webChat.php";
    const postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, game_id: this.gameObj.id, noLimitFlg: noLimitFlg });

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        var items = data.split("<b>");
        var basics = items[0].split("|");
        console.log(data);
        this.chatCount = this.numberVal(basics[2]);
        var messages = items[1].split("<br>");
        this.usersOnline = items[2];
        var chatMessages = [];
        messages.forEach(function (msg) {
          if (msg.length > 3)
            chatMessages.push(messageFromLine(msg));
        });
        this.chatMessages = chatMessages;
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });

  }
  postChat(num: number) {
    this.showAlertPopup('not coded yet');
  }
  replyToChat(chat: any) {
    if (chat.name == this.user.userName) {
      if (!this.editPostMode)
        $('#msgField').val('');
      this.chatId = chat.rowId;
    } else {
      //			$('#msgField').val('');
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
        if (msg.rowId == chatId)
          $('#msgField').val(msg.message);
      });
    } else
      $('#msgField').val('');
  }
  deletePost(chat: any) {
    //startSpinner('Working...', '150px');
    /*
      var url = getHostname()+"/webChat.php";
        $.post(url,
        {
            user_login: $scope.user.userName || 'test',
            code: $scope.user.code,
            action: 'deleteMessage',
            chatId: chat.rowId,
        },
        function(data, status){
          stopSpinner();
          console.log(data);
      if(verifyServerResponse(status, data)) {
        updateChatMessages('N');
      }
        });*/
  }


}
