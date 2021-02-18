import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var userObjFromUser: any;
declare var setCheckedValueOfField: any;
declare var getCheckedTextValueOfField: any;

@Component({
  selector: 'app-user-notifications-popup',
  templateUrl: './user-notifications-popup.component.html',
  styleUrls: ['./user-notifications-popup.component.scss']
})
export class UserNotificationsPopupComponent extends BaseComponent implements OnInit {
  @Input('serverUser') serverUser: any;
  public segmentIdx = 0;
  public changesMadeFlg = false;
  public textSentFlg = false;
  public emailSentFlg = false;

  constructor() { super(); }

  ngOnInit(): void {
  }
  initChild() {
    this.user = userObjFromUser();
    this.changesMadeFlg = false;
    this.segmentIdx = this.numberVal(this.serverUser.providerNum);
    this.emailSentFlg = false;
    this.textSentFlg = false;
    if (this.serverUser.confirmEmailFlg)
      setCheckedValueOfField('emailFlg', this.serverUser.email_flg == 'Y');
    if (this.serverUser.confirmTextFlg)
      setCheckedValueOfField('textFlg', this.serverUser.textFlg == 'Y');

    }
  submitUpdates() {
    this.playClick();
    var email = this.databaseSafeValueOfInput("email");
    var phone = this.databaseSafeValueOfInput("phone");
    var emailFlg =  getCheckedTextValueOfField('emailFlg');
    var textFlg =  getCheckedTextValueOfField('textFlg');
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'updateContactInfo', email: email, phone: phone, providerNum: this.segmentIdx, emailFlg: emailFlg, textFlg: textFlg });
    this.executeWebService(postData);
    this.changesMadeFlg = false;
  }
  changeSegment(num: number) {
    this.playClick();
    this.segmentIdx = num;
    this.changesMadeFlg = true;
  }
  valuesChanged() {
    this.playClick();
    this.changesMadeFlg = true;
  }
  confirmEmailPressed() {
    this.playClick();
    this.displayFixedPopup('confirmEmailPopup');
  }
  confirmTextPressed() {
    this.playClick();
    this.displayFixedPopup('confirmTextPopup');
  }
  sendEmailCode() {
    this.playClick();
    var num = Math.floor((Math.random() * 1000));
    var code2 = num + 2000;
    this.sendEmailToUser(this.serverUser.email, code2);
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'generateEmailCode', data: num });
    this.executeWebService(postData);
    this.emailSentFlg = true;
  }
  sendEmailToUser(email: string, code: number) {
    var url = 'https://www.appdigity.com/pages/emailSP.php';
    var postData = this.getPostDataFromObj({ email: email, code: code });
    console.log('1x', postData);
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        console.log('2x', data);
 //       if (this.verifyServerResponse(data)) {
 //       }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  authorizeEmailCodePressed() {
    this.playClick();
    var emailCode = this.databaseSafeValueOfInput("emailCode");
		if(emailCode.length!=4) {
			this.showAlertPopup('Invalid code', 1);
			return;
		}
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'authorizeEmailCode', data: emailCode });
    this.executeWebService(postData);
    this.closePopup('confirmEmailPopup');
    this.closePopup('notificationsPopup');
  }
  sendTextCode() {
    this.playClick();
		var num=Math.floor((Math.random() * 1000));
		var code2=num+2000;
		this.sendEmailToUser(this.serverUser.text_msg, code2);
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'generateTextCode', data: num });
    this.executeWebService(postData);
    this.textSentFlg = true;
  }
  authorizeTextCodePressed() {
    this.playClick();
    var textCode = this.databaseSafeValueOfInput("textCode");
		if(textCode.length!=4) {
			this.showAlertPopup('Invalid code', 1);
			return;
		}
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'authorizeTextCode', data: textCode });
    this.executeWebService(postData);
    this.closePopup('confirmTextPopup');
    this.closePopup('notificationsPopup');
  }
  executeWebService(postData: any) {
    const url = this.getHostname() + "/webUserInfo2.php";
    console.log('1', postData);
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        console.log('2', data);
        if (this.verifyServerResponse(data)) {
          this.showAlertPopup('success!');
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }

}
