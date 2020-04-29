import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var mailFromLine: any;
declare var $: any;

@Component({
  selector: 'app-mail-popup',
  templateUrl: './mail-popup.component.html',
  styleUrls: ['./mail-popup.component.scss']
})
export class MailPopupComponent extends BaseComponent implements OnInit {
  @Input('user') user: any;
  public displayMessages = [];
  public buttonIdx = 0;
  public drilldownFlg = false;
  public mailBoxName = '';
  public mailBoxNameIcon = 'fa-envelope';
  public row_id = 0;
  public showFormFlg = false;
  public newPostFlg = false;
  public userNames = ['Rick', 'Bob', 'Sally'];
  public selectedItem: any;
  public urgentFlg = false;
  public urgentFa = 'fa fa-square-o';

  constructor() { super(); }

  ngOnInit(): void {
  }
  show() {
    this.changeMailbox(0);
    this.openModal('#mailPopup');
  }
  changeMailbox(num: number) {
    this.buttonIdx = num;
    this.playClick();

    this.drilldownFlg = false;
    this.getData('readBox', 0);
  }
  backToTop() {
    this.playClick();
    this.drilldownFlg = false;
    this.showFormFlg = false;
    this.getData('readBox', 0);
  }
  readMailItem(item: any) {
    if (this.drilldownFlg)
      return;
    this.selectedItem = item;
    this.drilldownFlg = true;
    this.showFormFlg = true;
    this.newPostFlg = false;
    this.getData('readPost', item.row_id);
  }
  startNewPost() {
    this.playClick();
    this.drilldownFlg = true;
    this.displayMessages = [];
    this.showFormFlg = true;
    this.newPostFlg = true;
    this.getUserNames();
  }
  toggleUrgent() {
    this.urgentFlg = !this.urgentFlg;
    this.urgentFa = (this.urgentFlg) ? 'fa-check-square-o' : 'fa fa-square-o';
  }
  postMessage() {
    this.playClick();
    var messageBody = this.databaseSafeValueOfInput('messageBody');
    if (messageBody.length == 0) {
      this.showAlertPopup('Message is blank!', 1);
      return;
    }
    var row_id = 0;
    var messageTitle = '';
    var to = '';
    var urgent = '';

    if (this.newPostFlg) {
      to = this.databaseSafeValueOfInput('toUserName');
      urgent = (this.urgentFlg) ? 'Y' : '';
      messageTitle = this.databaseSafeValueOfInput('messageTitle');
      if (messageTitle.length == 0) {
        this.showAlertPopup('Title is blank!', 1);
        return;
      }
      $('#messageTitle').val('');
    } else {
      messageTitle = this.selectedItem.title;
      row_id = this.selectedItem.row_id;
    }

    $('#messageBody').val('');
    this.showFormFlg = false;
    var url = this.getHostname() + "/spSendMail.php";
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, title: messageTitle, message: messageBody, action: 'send', row_id: row_id, to: to, urgent: urgent });
    console.log('postData', postData);

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        console.log(data);
        if (this.verifyServerResponse(data)) {
          this.showAlertPopup('message sent');
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });

  }
  deletePost(message: any) {
    console.log(message);
    this.getData('delete', message.row_id);
  }
  getData(action: string, row_id: number) {
    this.row_id = row_id;
    var url = this.getHostname() + "/spSendMail.php";
    this.mailBoxName = (this.buttonIdx == 0) ? 'inbox' : 'sentBox';
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: action, type: this.mailBoxName, row_id: row_id });
    //console.log('postData', postData);
    this.displayMessages = [];
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        //console.log('data', data);
        var items = data.split("<a>");
        var displayMessages = [];
        items.forEach(function (line) {
          var message = mailFromLine(line);
          console.log(message);
          if (message && message.row_id > 0)
            displayMessages.push(message);
        });
        this.displayMessages = displayMessages;
        if(action == 'delete')
          this.backToTop();
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  getUserNames() {
    var url = this.getHostname() + "/spSendMail.php";
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'getUsernames' });
    //console.log('postData', postData);
    this.userNames = [];
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        //console.log('data', data);
        var items = data.split("|");
        var userNames = [];
        items.forEach(function (line) {
          userNames.push(line);
        });
        this.userNames = userNames;
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }

}

