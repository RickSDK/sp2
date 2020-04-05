import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';

declare var $: any;
//declare var getHostname: any;
declare var userObjFromUser: any;
declare var valueOfInput: any;
declare var showAlertPopup: any;
declare var verifyServerResponse: any;
declare var executeTextApi: any;
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
    this.userName = this.user.userName;
    this.email = '';
  }
  show() {
    $("#loginPopup").modal();
    this.showLoginFlg = true;
    this.requestSentFlg = false;
  }
  clearValue(event: any) {
    event.target.value = '';
  }
  loginPressed() {
    this.userName = this.databaseSafeValueOfInput('emailField');
    this.password = this.databaseSafeValueOfInput('passwordField');
    if (!this.userName || !this.password || this.userName.length == 0 || this.password.length == 0) {
      this.showAlertPopup('Value is blank!', 1);
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
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  successCallback(data: any) {
    if (this.verifyServerResponse(data)) {
      var userObj = parseServerDataIntoUserObj(data, true);
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
      showAlertPopup('Sorry! You must first win a Single Player game before signing up for multiplayer.', 1);
      return;
    }
    this.showLoginFlg = !this.showLoginFlg;
  }
  createNewPressed() {
    showAlertPopup('not working yet', 1);
    //    this.requestSentFlg = true;
  }

}
