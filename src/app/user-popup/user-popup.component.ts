import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { EditProfilePopupComponent } from '../edit-profile-popup/edit-profile-popup.component';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';
import { UserNotificationsPopupComponent } from '../user-notifications-popup/user-notifications-popup.component';

declare var $: any;
declare var userObjFromUser: any;
declare var playClick: any;
declare var valueOfInput: any;
declare var getGameScores: any;
declare var logOutUser: any;
declare var saveUserObj: any;
declare var userFromLine: any;
declare var imageSrcFromObj: any;
declare var awardNameForNum: any;
declare var nowYear: any;
declare var displayFixedPopup: any;

@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.scss']
})
export class UserPopupComponent extends BaseComponent implements OnInit {
  @Input('user') user: any;
  @Output() messageEvent = new EventEmitter<string>();
  @ViewChild(EditProfilePopupComponent) editProfilePopupComponent: EditProfilePopupComponent;
  @ViewChild(UserNotificationsPopupComponent) userNotificationsPopupComponent: UserNotificationsPopupComponent;

  public editUserImageFlg = false;
  public editUseNameFlg = false;
  public nextRank = 1;
  public displayUser: any;
  public serverUser: any;
  public personalInfoObj: any;
  public profileCustomizationObj: any;
  public profileEmailObj: any;
  public adminObj: any;
  public regularGamesObj: any;
  public matchmakingObj: any;
  public awardsObj: any;
  public currentGamesObj: any;
  public recentRegularGamesObj: any;
  public recentMMGamesObj: any;
  public savedRegularGamesObj: any;
  public savedMMGamesObj: any;
  public selfProfileFlg = false;
  public recentGamesPagingObj = { index: 1, lastIndex: 1, total: 0 }
  public recentMMPagingObj = { index: 1, lastIndex: 1, total: 0 }
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
  public yourRankName:string = '';
  public yourNextRankName:string = '';
  public yourNextRankDesc:string = '';

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    // this.user = userObjFromUser();
  }
  show(displayUser: any) {
    this.displayUser = displayUser;
    if (!displayUser.rank && displayUser.userId>0) {
      this.displayUser.rank = 2;
      this.displayUser.imgSrc = imageSrcFromObj();
    }
    if(displayUser.rank && displayUser.rank>0 && this.superpowersData) {
      this.yourRankName = this.superpowersData.ranks[displayUser.rank].name;
      this.yourNextRankName = this.superpowersData.ranks[displayUser.rank+1].name;
      this.yourNextRankDesc = this.superpowersData.ranks[displayUser.rank].name;
    }

    var nextRank = this.numberVal(this.user.rank) + 1;
    if (nextRank > 18)
      nextRank = 18;
    this.nextRank = nextRank;

    this.gameScores = getGameScores();
    if (this.displayUser.userId > 0) {
      this.loadingFlg = true;
      this.loadUserDataFromServer(this.displayUser);
    } else {
      this.selfProfileFlg = (displayUser.userName == this.user.userName);
    }
    $("#userPopup").modal();
  }
  editProfileImageButtonClicked() {
    if (this.selfProfileFlg) {
      if (this.displayUser.userId > 0)
        this.editServerProfileSettings();
      else
        this.editUserImageFlg = !this.editUserImageFlg;
    }
  }
  editUserEmailSettings() {
    this.playClick();
    this.closeModal('#userPopup');
    displayFixedPopup('notificationsPopup', true);
    this.userNotificationsPopupComponent.initChild();
  }
  editServerProfileSettings() {
    this.playClick();
    this.closeModal('#userPopup');
    displayFixedPopup('profileEditPopup', true);
    this.editProfilePopupComponent.initChild();
  }
  saveNotificationsPressed() {

  }
  loadUserDataFromServer(displayUser: any) {
    const url = this.getHostname() + "/webUserInfo.php";
    const postData = this.getPostDataFromObj({
      user_login: this.user.userName,
      loginId: this.user.userId,
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
          this.selfProfileFlg = (this.displayUser.userName == this.user.userName);
          this.displayUser.imgSrc = imageSrcFromObj(this.serverUser.graphic, this.serverUser.avatar);
          this.displayUser.rank = this.serverUser.rank;

          this.personalInfoObj = { title: 'Personal Info', rows: [], icon: 'fa-user' };
          this.personalInfoObj.rows.push({ name: 'Username', value: this.serverUser.name })
          this.personalInfoObj.rows.push({ name: 'Created', value: this.serverUser.created })
          this.personalInfoObj.rows.push({ name: 'City', value: this.serverUser.city })
          if (this.serverUser.country == 'United States')
            this.personalInfoObj.rows.push({ name: 'State', value: this.serverUser.state })
          this.personalInfoObj.rows.push({ name: 'Country', value: this.serverUser.country })
          this.personalInfoObj.rows.push({ name: 'Last Login', value: this.serverUser.last_login_time + ' hr ago' })
          this.personalInfoObj.flag = this.serverUser.flag;
          this.personalInfoObj.nation = this.serverUser.country;

          this.profileCustomizationObj = { title: 'Profile Customization', rows: [], editFlg: true, icon: 'fa-user' };
          this.profileCustomizationObj.rows.push({ name: 'Chat Color', value: this.serverUser.chat_color })
          this.profileCustomizationObj.rows.push({ name: 'Chat Font', value: this.serverUser.chat_font })
          this.profileCustomizationObj.rows.push({ name: 'Away Flag', value: this.serverUser.away_flg })
          this.profileCustomizationObj.rows.push({ name: 'Away Message', value: this.serverUser.away_msg })
          this.profileCustomizationObj.rows.push({ name: 'Graphic', value: this.serverUser.graphic })
          this.profileCustomizationObj.rows.push({ name: 'Avatar', value: this.serverUser.avatar })
          this.profileCustomizationObj.rows.push({ name: 'Message', value: this.serverUser.message })

          this.profileEmailObj = { title: 'Email & Text Options', rows: [], editFlg: true, icon: 'fa-mobile' };
          this.profileEmailObj.rows.push({ name: 'Confirm Email?', value: this.serverUser.confirmEmailFlg })
          this.profileEmailObj.rows.push({ name: 'Email Notifications?', value: this.serverUser.email_flg })
          this.profileEmailObj.rows.push({ name: 'Confirm Text?', value: this.serverUser.confirmTextFlg })
          this.profileEmailObj.rows.push({ name: 'Text Notifications?', value: this.serverUser.textFlg })

          this.adminObj = { title: 'Admin View', rows: [], editFlg: false, icon: 'fa-lock' };
          this.adminObj.rows.push({ name: 'user_id', value: this.serverUser.user_id })
          this.adminObj.rows.push({ name: 'email', value: this.serverUser.email })
          this.adminObj.rows.push({ name: 'text_msg', value: this.serverUser.text_msg })
          this.adminObj.rows.push({ name: 'confirmEmailFlg', value: this.serverUser.confirmEmailFlg })
          this.adminObj.rows.push({ name: 'confirmTextFlg', value: this.serverUser.confirmTextFlg })
          this.adminObj.rows.push({ name: 'textFlg', value: this.serverUser.textFlg })
          this.adminObj.rows.push({ name: 'ip', value: this.serverUser.ip })

          this.regularGamesObj = { title: 'Regular Games Stats', rows: [], editFlg: false, icon: 'fa-list' };
          this.regularGamesObj.rows.push({ name: 'Games', value: this.serverUser.games })
          this.regularGamesObj.rows.push({ name: 'Wins', value: this.serverUser.wins })
          this.regularGamesObj.rows.push({ name: 'Losses', value: this.serverUser.losses })
          this.regularGamesObj.rows.push({ name: 'Last-10', value: this.serverUser.last10 })
          this.regularGamesObj.rows.push({ name: 'Rank', value: this.serverUser.rank })
          this.regularGamesObj.rows.push({ name: 'Points', value: this.serverUser.rating })
          this.regularGamesObj.rows.push({ name: 'Streak', value: this.serverUser.streak })
          this.regularGamesObj.rows.push({ name: 'Wins this Year', value: this.serverUser.winsThisYear })
          this.regularGamesObj.rows.push({ name: 'Longest Win Streak', value: this.serverUser.winning_streak })
          this.regularGamesObj.rows.push({ name: 'Longest Losing Streak', value: this.serverUser.losing_streak })
          this.regularGamesObj.rows.push({ name: 'Currently Playing', value: this.serverUser.game_count })

          this.matchmakingObj = { title: 'Matchmaking Stats', rows: [], editFlg: false, icon: 'fa-trophy' };
          var leagues = ['none', 'Bronze', 'Silver', 'Gold', 'Platinum'];
          this.matchmakingObj.rows.push({ name: 'League', value: leagues[this.serverUser.ladder.ladder] })
          this.matchmakingObj.rows.push({ name: 'Points', value: this.serverUser.ladder.points })
          this.matchmakingObj.rows.push({ name: 'Wins', value: this.serverUser.ladder.wins })
          this.matchmakingObj.rows.push({ name: 'Losses', value: this.serverUser.ladder.losses })
          this.matchmakingObj.rows.push({ name: 'Streak', value: this.serverUser.ladder.streak })
          this.matchmakingObj.rows.push({ name: 'Last-10', value: this.serverUser.ladder.last10 })
          this.matchmakingObj.rows.push({ name: '# Playing', value: this.serverUser.ladder.games_playing })
          this.matchmakingObj.rows.push({ name: 'Max', value: this.serverUser.ladder.games_max })
          this.matchmakingObj.rows.push({ name: 'Longest Win Streak', value: this.serverUser.ladder.winning_streak })
          this.matchmakingObj.rows.push({ name: 'Longest Lose Streak', value: this.serverUser.ladder.losing_streak })

          var year = nowYear();
          this.awardsObj = { title: year + ' Awards', rows: [], editFlg: false, icon: 'fa-certificate', type: 1 };
          this.serverUser.awards.forEach(award => {
            var name = awardNameForNum(award.awardId);
            var src = "assets/graphics/awards/award" + award.awardId + ".png"
            this.awardsObj.rows.push({ name: '', src: src, value: name })
          });

          this.currentGamesObj = { title: 'Current Games', rows: [], editFlg: false, icon: 'fa-play', type: 2 };
          this.serverUser.currentGames.forEach(game => {
            this.currentGamesObj.rows.push(game)
          });

          this.recentRegularGamesObj = { title: 'Recent Regular Games', rows: [], editFlg: false, icon: 'fa-stop', type: 3 };
          this.recentMMGamesObj = { title: 'Recent Matchmaking Games', rows: [], editFlg: false, icon: 'fa-stop', type: 3 };
          this.serverUser.last10Games.forEach(game => {
            if (game.name.substring(0, 4) == '-mm-')
              this.recentMMGamesObj.rows.push(game);
            else
              this.recentRegularGamesObj.rows.push(game)
          });

          this.savedRegularGamesObj = { title: 'Saved Games', rows: [], editFlg: false, icon: 'fa-floppy-o', type: 3 };
          this.savedMMGamesObj = { title: 'Saved Games', rows: [], editFlg: false, icon: 'fa-floppy-o', type: 3 };
          this.serverUser.savedGames.forEach(game => {
            if (game.name.substring(0, 4) == '-mm-')
              this.savedMMGamesObj.rows.push(game);
            else
              this.savedRegularGamesObj.rows.push(game)
          });
          if (this.user.userId == 10)
            console.log('serverUser!', this.serverUser);
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
  deleteAllGames() {
    this.gameScores = [];
    localStorage.setItem("gameScores", JSON.stringify(this.gameScores));
  }
  deleteThisGame(delGame: any) {
    var gameScores = [];
    this.gameScores.forEach(game => {
      if (game.id != delGame.id)
        gameScores.push(game);
    });
    this.gameScores = gameScores;
    localStorage.setItem("gameScores", JSON.stringify(gameScores));
  }
  openRanksModal() {
    this.closeModal('#userPopup');
    $('#ranksPopup').modal();
  }
  changeImage(image) {
    this.user.avatar = image;
    this.user.imgSrc = "assets/graphics/avatars/" + image;
    this.updateUserProfile();
  }
  clearValue(event: any) {
    event.target.value = '';
  }
  updateUsername() {
    localStorage.userName = valueOfInput('userName');
    this.user.userName = localStorage.userName;
    this.updateUserProfile();
  }
  updateUserProfile() {
    playClick();
    saveUserObj(this.user);
    this.editUserImageFlg = false;
    this.editUseNameFlg = false;
    this.user = userObjFromUser();
    this.messageEvent.emit('done');
    this.closeModal('#userPopup');
  }
  userLogout() {
    logOutUser();

    this.messageEvent.emit('done');
    this.closeModal('#userPopup');
    this.router.navigate(['']);
  }
  editUserName() {
    if (this.displayUser.userId > 0) {
      //     this.openRanksModal();
      return;
    }
    playClick();
    if (this.user.userId == 0)
      this.editUseNameFlg = !this.editUseNameFlg;
    else
      this.playSound('error.mp3');
  }

}
