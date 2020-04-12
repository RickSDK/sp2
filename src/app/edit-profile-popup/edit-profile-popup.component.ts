import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var getCheckedValueOfField: any;
declare var setCheckedValueOfField: any;
declare var $: any;

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
  //---------------- edit profile------------------
  changeAwayFlag() {
    this.playClick();
    this.changesMadeFlg = true;
    var checked = getCheckedValueOfField('awayFlg');
    this.serverUser.away_flg = (checked) ? 'Y' : '';
  }
  clearFaces(face: any) {
    this.playClick();
    this.changesMadeFlg = true;
    this.chatFonts.forEach(function (f) {
      if (face != f)
        setCheckedValueOfField("face" + f.id, false);
    });

  }
  clearColors(color: any) {
    this.playClick();
    this.changesMadeFlg = true;
    this.chatColors.forEach(function (c) {
      if (color != c)
        setCheckedValueOfField("color" + c.id, false);
    });
  }
  saveProfilePressed() {

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
    //this.loadUserDataForUser('uploadImage', src);
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
      }
      if (this.segmentIdx == 3) {
        $('#awayMessage').val(this.serverUser.away_msg);
      }
    } else {
      this.closePopup('profileEditPopup');
    }
  }
}

function imageIsLoaded(e) {
  $('#myImg').attr('src', e.target.result);
};
