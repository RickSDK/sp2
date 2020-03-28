import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var userObjFromUser: any;
declare var playClick: any;
declare var valueOfInput: any;

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
  ]

  constructor() { super(); }

  ngOnInit(): void {
  }
  show() {
    $("#userPopup").modal();
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
    localStorage.username = valueOfInput('userName');
    this.updateUserProfile();
  }
  updateUserProfile() {
    this.user = userObjFromUser();
    this.messageEvent.emit('done'); 
  }
}
