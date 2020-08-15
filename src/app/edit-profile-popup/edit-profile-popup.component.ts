import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

declare var getCheckedValueOfField: any;
declare var setCheckedValueOfField: any;
declare var $: any;
declare var saveUserObj: any;
declare var imageSrcFromObj: any;

@Component({
  selector: 'app-edit-profile-popup',
  templateUrl: './edit-profile-popup.component.html',
  styleUrls: ['./edit-profile-popup.component.scss']
})
export class EditProfilePopupComponent extends BaseComponent implements OnInit {
  @Input('serverUser') serverUser: any;
  @Input('user') user: any;

  public changesMadeFlg = false;
  public loadImageNum = 0;
  public fileToUpload: File = null;
  public away_flg = false;
  public chat_color = '';
  public chat_font = '';
  public graphicButtonIdx = 0;
  public avatar = '';
  public imgSrc = '';  
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

  public chatColors = [
    { id: 1, color: "#FF8888", name: "red" },
    { id: 2, color: "#FFCC00", name: "orange" },
    { id: 3, color: "#FFFF00", name: "yellow" },
    { id: 4, color: "#88FF88", name: "green" },
    { id: 5, color: "#00FFFF", name: "cyan" },
    { id: 6, color: "#8888FF", name: "blue" },
    { id: 7, color: "#FF00FF", name: "magenta" },
    { id: 8, color: "#FFFFFF", name: "white" },
  ];
  public chatFonts = [
    { id: 1, face: "Arial" },
    { id: 2, face: "Helvetica" },
    { id: 3, face: "Times New Roman" },
    { id: 4, face: "Times" },
    { id: 5, face: "Courier New" },
    { id: 6, face: "Courier" },
    { id: 7, face: "Verdana" },
    { id: 8, face: "Georgia" },
    { id: 9, face: "Palatino" },
    { id: 10, face: "Garamond" },
    { id: 11, face: "Bookman" },
    { id: 12, face: "Comic Sans MS" },
    { id: 13, face: "Trebuchet MS" },
    { id: 14, face: "Arial Black" },
    { id: 15, face: "Impact" },
  ];
  constructor() { super(); }

  ngOnInit(): void {
  }
  initChild(num=0) {
    this.changesMadeFlg = false;
    this.loadImageNum = 0;
    this.segmentIdx = num;
    this.away_flg = this.serverUser.away_flg;
    this.chat_color = this.serverUser.chat_color;
    this.chat_font = this.serverUser.chat_font;
    this.avatar = this.serverUser.avatar;
    this.imgSrc = imageSrcFromObj(this.serverUser.graphic, this.serverUser.avatar);
    this.graphicButtonIdx = (this.serverUser.avatar.length>1)?0:1;
  }
  //---------------- edit profile------------------
  clearFaces(face: any) {
    this.playClick();
    this.clearFacesExceptFor(face.face);
    this.changesMadeFlg = (this.chat_color != this.serverUser.chat_color || this.chat_font != this.serverUser.chat_font);
  }
  clearFacesExceptFor(face: string) {
    this.chat_font = face;
    this.chatFonts.forEach(function (f) {
        setCheckedValueOfField("face" + f.id, (face == f.face));
    });
  }
  clearColors(color: any) {
    this.playClick();
    this.clearColorsExceptForColor(color.color);
    this.changesMadeFlg = (this.chat_color != this.serverUser.chat_color || this.chat_font != this.serverUser.chat_font);
  }
  clearColorsExceptForColor(color: string) {
    this.chat_color = color;
    this.chatColors.forEach(function (c) {
        setCheckedValueOfField("color" + c.id, (color == c.color));
    });
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    var reader = new FileReader();
    reader.onload = imageIsLoaded;
    reader.readAsDataURL(this.fileToUpload);
    this.loadImageNum = 2;
    this.changesMadeFlg = true;
  }
  uploadImagePressed() {
    var src = $('#myImg').attr('src');
    console.log('bytes: ', src.length);
    if(src.length>400000) {
      this.showAlertPopup('file too large. please shrink it down and then upload it again.', 1);
      return;
    }
    var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'uploadImage', data: src });
    this.executeWebService(postData);
  }
  changeAwayFlag() {
    this.playClick();
    var checked = getCheckedValueOfField('awayFlg');
    this.away_flg = checked;
    var serverAwayFlg = (this.serverUser.away_flg == 'Y');
    var awayMessage = $('#awayMessage').val();
    this.changesMadeFlg = (this.away_flg != serverAwayFlg || (this.away_flg && awayMessage != this.serverUser.away_msg));
    //  this.serverUser.away_flg = (checked) ? 'Y' : '';
  }
  changeImage(image) {
    this.avatar = image;
    this.imgSrc = "assets/graphics/avatars/" + image;
    this.changesMadeFlg = (this.avatar != this.serverUser.avatar);
  }
  cancelButtonPressed() {
    this.playClick();
    if (this.changesMadeFlg) {
      this.changesMadeFlg = false;
      if (this.segmentIdx == 0) {
        this.loadImageNum = 0;
        this.changesMadeFlg = false;
        $('#myImg').attr('src', this.user.imgSrc);
      }
      if (this.segmentIdx == 1) {
        $('#profileMessage').val(this.serverUser.message);
      }
      if (this.segmentIdx == 2) {
        this.clearFacesExceptFor(this.serverUser.chat_font);
        this.clearColorsExceptForColor(this.serverUser.chat_color);
      }
      if (this.segmentIdx == 3) {
        $('#awayMessage').val(this.serverUser.away_msg);
        this.away_flg = this.serverUser.away_flg == 'Y';
        setCheckedValueOfField('awayFlg', this.away_flg);
      }
      if (this.segmentIdx == 4) {
        $('#password1').val('');
        $('#password2').val('');
        $('#password3').val('');
      }
    } else {
      this.closePopup('profileEditPopup');
    }
  }
  saveProfilePressed() {
    if(this.segmentIdx == 0) {
      var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'changeAvatar', avatar: this.avatar });
      this.executeWebService(postData);  
    }
    if (this.segmentIdx == 1) {
      var profileMessage = $('#profileMessage').val();
      if (profileMessage.length == 0) {
        this.showAlertPopup('Profile Message is blank!', 1);
        return;
      }
      var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'updateMessage', message: profileMessage });
      this.executeWebService(postData);
    }
    if (this.segmentIdx == 2) {
      var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'updateChat', chat_color: this.chat_color, chat_font: this.chat_font });
      this.executeWebService(postData);
    } //<-- seg 2
    if (this.segmentIdx == 3) {
      var awayMessage = $('#awayMessage').val();
      var checked = getCheckedValueOfField('awayFlg');
      if (checked && awayMessage.length == 0) {
        this.showAlertPopup('Away Message is blank!', 1);
        return;
      }
      var awayFlg = (checked) ? 'Y' : '';
      var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'updateAwayMessage', message: awayMessage, awayFlg: awayFlg });
      this.executeWebService(postData);
    } //<-- seg 3
    if (this.segmentIdx == 4) {
      var password1 = $('#password1').val();
      var password2 = $('#password2').val();
      var password3 = $('#password3').val();
      if (password1.length == 0 || password2.length == 0 || password3.length == 0) {
        this.showAlertPopup('field is blank!', 1);
        return;
      }
      if (password2 != password3) {
        this.showAlertPopup('password fields do not match!', 1);
        return;
      }
      if (password1 != localStorage.password) {
        this.showAlertPopup('old password does not match your saved password!', 1);
        return;
      }
      var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'changePassword', passwordNew: password2 });

      this.executeWebService(postData, password2);
    } //<-- seg 4
  }
  executeWebService(postData: any, newPassword = '') {
    this.closePopup('profileEditPopup');
    const url = this.getHostname() + "/webUserInfo2.php";
    console.log(postData);
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        console.log(data);
        if (this.verifyServerResponse(data)) {
          if (newPassword && newPassword.length > 0) {
            localStorage.password = newPassword;
            this.user.code = btoa(newPassword);
            saveUserObj(this.user);
          }
          this.showAlertPopup('success!');
        }
      })
      .catch(error => {
        this.showAlertPopup('Unable to reach server: ' + error, 1);
      });
  }
}

function imageIsLoaded(e) {
  $('#myImg').attr('src', e.target.result);
};
