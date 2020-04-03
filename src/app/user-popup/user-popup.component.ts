import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';

declare var $: any;
declare var userObjFromUser: any;
declare var playClick: any;
declare var valueOfInput: any;
declare var getGameScores: any;
declare var logOutUser: any;

@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.scss']
})
export class UserPopupComponent extends BaseComponent implements OnInit {
  @Input('user') user: any;
  @Output() messageEvent = new EventEmitter<string>();
  public editUserImageFlg = false;
  public editUseNameFlg = false;
  public localAvatars = [
    'avatar1.jpg',
    'avatar2.jpg',
    'avatar3.jpg',
    'avatar4.jpg',
    'avatar5.jpg',
    'avatar6.jpg',
    'avatar7.jpg',
    'avatar8.jpg'
  ];
  public gameScores = [];

  constructor(private router: Router) { super(); }

  ngOnInit(): void {

  }
  show() {
    $("#userPopup").modal();
    this.gameScores = getGameScores();
  }
  openRanksModal() {
    this.closeModal('#userPopup');
    $('#ranksPopup').modal();
  }
  changeImage(image) {
    playClick();
    localStorage.avatar = image;
    this.updateUserProfile();
  }
  clearValue(event: any) {
    event.target.value = '';
  }
  updateUsername() {
    playClick();
    this.editUseNameFlg = false;
    localStorage.userName = valueOfInput('userName');
    this.updateUserProfile();
  }
  updateUserProfile() {
    this.user = userObjFromUser();
    this.messageEvent.emit('done');
  }
  userLogout() {
    logOutUser();

    this.messageEvent.emit('done');
    this.closeModal('#userPopup');
    this.router.navigate(['']);
  }
}
