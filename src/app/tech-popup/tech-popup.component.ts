import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var getTechs: any;
declare var userObjFromUser: any;

@Component({
  selector: 'app-tech-popup',
  templateUrl: './tech-popup.component.html',
  styleUrls: ['./tech-popup.component.scss']
})
export class TechPopupComponent implements OnInit {
  public technology = [];
  public players = [];
  public user:any;
  public infoFlg=false;
  public descFlg=false;
  public adminFlg=true;
  
  constructor() { }

  ngOnInit(): void {
  	this.technology = getTechs();
  	this.user = userObjFromUser();
  	this.adminFlg = this.user.userName=='Rick';
  	if(this.players.length==0)
  		this.descFlg=true;
  }
  show() {
    $("#techPopup").modal();
  }

}
