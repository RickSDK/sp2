import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var mailFromLine: any;

@Component({
  selector: 'app-mail-popup',
  templateUrl: './mail-popup.component.html',
  styleUrls: ['./mail-popup.component.scss']
})
export class MailPopupComponent extends BaseComponent implements OnInit {
  @Input('user') user: any;
  public displayMessages = [];

  constructor() { super(); }

  ngOnInit(): void {
  }
  show() {
    this.getData();
    this.openModal('#mailPopup');
  }

  getData() {
    var url = this.getHostname() + "/spSendMail.php";
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'readBox', type: 'inbox' });
    console.log('postData', postData);
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        //console.log('data', data);
        var items = data.split("<a>");
        var displayMessages = [];
        items.forEach(function (line) {
          var message = mailFromLine(line);
          //console.log(message);

          if (message && message.row_id > 0)
            displayMessages.push(message);
        });
        this.displayMessages = displayMessages;
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
}

