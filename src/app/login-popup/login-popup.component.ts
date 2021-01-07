import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var userObjFromUser: any;
declare var showAlertPopup: any;
declare var getIPInfo: any;
declare var parseServerDataIntoUserObj: any;

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  // public hostname: string;
  public user: any;
  public showLoginFlg = true;
  public requestSentFlg = false;
  public email = '';
  public userName = '';
  public password = '';
  public password2 = '';

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    //  this.hostname = getHostname();
    this.user = userObjFromUser();
    this.userName = '';
    this.email = '';
  }
  show(email: string) {
    $("#loginPopup").modal();
    this.showLoginFlg = true;
    this.requestSentFlg = false;
    this.email = email || '';
    if (email && email.length > 0) {
      this.userName = '';
      this.showLoginFlg = false;
    }
  }
  clearValue(event: any) {
    event.target.value = '';
  }
  loginPressed() {
    this.userName = this.databaseSafeValueOfInput('emailField');
    this.password = this.databaseSafeValueOfInput('passwordField');

    if (!this.userName || this.userName.length == 0) {
      this.showAlertPopup('Username/Email is blank!', 1);
      return;
    }
    if (!this.password || this.password.length == 0) {
      this.showAlertPopup('Password is blank!', 1);
      return;
    }

    
    this.showLoginFlg = false;
    this.requestSentFlg = true;

    localStorage.userName = this.userName;
    localStorage.password = this.password;

    const url = this.getHostname() + "/spApiText.php";
    const postData = this.getPostDataFromObj({ Username: this.userName, Password: this.password, action: 'login' });

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        if (this.verifyServerResponse(data)) {
          this.successCallback(data);
        } else {
          $("#loginPopup").modal('hide');
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  successCallback(data: any) {
    if (this.verifyServerResponse(data)) {
      var userObj = parseServerDataIntoUserObj(data);
      localStorage.userName = userObj.userName;
      getIPInfo(localStorage.userName, localStorage.password);
      localStorage.rank = userObj.rank;
      showAlertPopup('Success');
      this.messageEvent.emit('done');
      $("#loginPopup").modal('hide');
    }
  }
  forgotPasswordPressed() {
    showAlertPopup('not working yet', 1);
  }
  createFormButtonPressed() {
    if (this.user.rank < 2) {
      showAlertPopup('Sorry! You must first complete the Single Player campaign before signing up for multiplayer.', 1);
      return;
    }
    this.showLoginFlg = !this.showLoginFlg;
  }
  createNewPressed() {
    var emailField2 = this.databaseSafeValueOfInput('emailField2');
    var firstName = this.databaseSafeValueOfInput('firstName');
    var password1 = this.databaseSafeValueOfInput('password1');
    var password2 = this.databaseSafeValueOfInput('password2');
    if (!emailField2.length || !firstName.length || password1.length == 0 || password2.length == 0) {
      this.showAlertPopup('Value is blank!', 1);
      return;
    }
    console.log(emailField2, firstName, password1, password2);
    if (firstName.toLowerCase() == 'guest') {
      this.showAlertPopup('Choose your username. Don\'t use "Guest"', 1);
      return;
    }
    if (password1 != password2) {
      this.showAlertPopup('Passwords do not match.', 1);
      return;
    }

    localStorage.userName = firstName;
    localStorage.password = password1;

    var obj = { Username: firstName, email: emailField2, Password: password1, action: 'createAccount', avatar: this.user.avatar, appName: 'v4' };
    console.log(obj);

    var url = this.getHostname() + "/spApiText.php";
    var postData = this.getPostDataFromObj(obj);

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        if (this.verifyServerResponse(data)) {
          this.accountCreatedResponse();
          getIPInfo(localStorage.userName, localStorage.password);
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });

  }
  accountCreatedResponse() {
    var ip = 'ip';
    var data = 'success|' + localStorage.userName + '|2|N|0|0|0||0|12|0|0|0|0|' + ip + '|soldier.JPG|0|0|0|0|0|0|' + this.user.avatar + '|';
    var userObj = parseServerDataIntoUserObj(data);
    console.log(userObj)
    getIPInfo(userObj.userName, localStorage.password);
    showAlertPopup('Success');
    this.messageEvent.emit('done');
    $("#loginPopup").modal('hide');
  }

}
