import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';

declare var $: any;
declare var userObjFromUser: any;
declare var playClick: any;
declare var valueOfInput: any;
declare var getGameScores: any;
declare var logOutUser: any;
declare var saveUserObj: any;
declare var userFromLine: any;
declare var imageSrcFromObj: any;

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
  public nextRank = 1;
  public displayUser: any;
  public serverUser: any;
  public personalInfoObj:any;
  public selfProfileFlg = true;
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
   // this.user = userObjFromUser();
  }
  show(user: any) {
    this.displayUser = user;
    this.selfProfileFlg = (user.userId == 0 || user.name == this.user.userName);
    if(!user.rank) {
      this.displayUser.rank = 2;
      this.displayUser.imgSrc = imageSrcFromObj();
    }
    console.log(this.displayUser);
    var nextRank = this.numberVal(this.user.rank) + 1;
    if (nextRank > 18)
      nextRank = 18;
    this.nextRank = nextRank;
    console.log('nextRank', nextRank);

    $("#userPopup").modal();
    this.gameScores = getGameScores();
    if (this.displayUser.userId > 0) {
      this.loadingFlg = true;
      this.loadUserDataFromServer(this.displayUser);
    }
  }
  editProfileImageButtonClicked() {
    if(this.selfProfileFlg)
      this.editUserImageFlg = !this.editUserImageFlg;
  }
  loadUserDataFromServer(displayUser: any) {
    const url = this.getHostname() + "/webUserInfo.php";
    const postData = this.getPostDataFromObj({
      user_login: this.user.userName,
      code: this.user.code,
      userId: displayUser.userId,
      action: '',
      completedGamesLimit: 100,
      gameId: 0
    });

    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        if (this.verifyServerResponse(data)) {
          this.loadingFlg = false;
          this.serverUser = userFromLine(data);
          this.displayUser.userName = this.serverUser.name;
          this.displayUser.imgSrc = imageSrcFromObj(this.serverUser.graphic, this.serverUser.avatar);
          this.displayUser.rank = this.serverUser.rank;
    
          this.personalInfoObj = { title: 'Personal Info', rows: [] };
          this.personalInfoObj.rows.push({name: 'Username', value: this.serverUser.name})
          this.personalInfoObj.rows.push({name: 'Created', value: this.serverUser.created})
          this.personalInfoObj.rows.push({name: 'City', value: this.serverUser.city})
          this.personalInfoObj.rows.push({name: 'State', value: this.serverUser.state})
          this.personalInfoObj.rows.push({name: 'Country', value: this.serverUser.country})
          this.personalInfoObj.rows.push({name: 'Last Login', value: this.serverUser.last_login_time+' hr ago'})
          console.log('serverUser!', this.serverUser);
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  openRanksModal() {
    this.closeModal('#userPopup');
    $('#ranksPopup').modal();
  }
  changeImage(image) {
    playClick();
    this.user.avatar = image;
    this.user.imgSrc = "assets/graphics/avatars/" + image;
    saveUserObj(this.user);
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
    this.closeModal('#userPopup');
    this.messageEvent.emit('done');
  }
  userLogout() {
    logOutUser();

    this.messageEvent.emit('done');
    this.closeModal('#userPopup');
    this.router.navigate(['']);
  }
  editUserName() {
    playClick();
    if(!this.selfProfileFlg) {
 //     this.openRanksModal();
      return;
    }
    if (this.user.userId == 0)
      this.editUseNameFlg = !this.editUseNameFlg;
    else
      this.playSound('error.mp3');
  }
}
