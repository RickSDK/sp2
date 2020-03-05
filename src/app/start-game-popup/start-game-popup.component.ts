import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;
declare var getHostname: any;
declare var userObjFromUser: any;

declare var $: any;

@Component({
  selector: 'app-start-game-popup',
  templateUrl: './start-game-popup.component.html',
  styleUrls: ['./start-game-popup.component.scss']
})
export class StartGamePopupComponent implements OnInit {
  public hostname:string;
  public user:any;

  constructor(private router: Router) { }

  ngOnInit(): void {
  	this.hostname = getHostname();
  	this.user = userObjFromUser();
  }
  show() {
    $("#startGamePopup").modal();
  }
  resumeGame() {
  	$("#startGamePopup").modal('hide');
  	this.router.navigate(['/board']);
  }

}
