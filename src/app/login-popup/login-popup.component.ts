import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var getHostname: any;
declare var userObjFromUser: any;
declare var valueOfInput: any;
declare var showAlertPopup: any;

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent extends BaseComponent implements OnInit {
  public hostname: string;
  public user: any;
  public showLoginFlg = true;
  public requestSentFlg = false;
  public email = '';
  public username = '';
  public password = '';
  public password2 = '';

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.hostname = getHostname();
    this.user = userObjFromUser();
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
    this.username = valueOfInput('emailField');
    this.password = valueOfInput('passwordField');
    showAlertPopup('not working yet', 1);
    if (0) {
      this.showLoginFlg = false;
      this.requestSentFlg = true;
      $("#loginPopup").modal('hide');
      this.router.navigate(['/multiplayer']);
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
