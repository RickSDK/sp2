import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var getHostname:any;
declare var userObjFromUser:any;
declare var playSound:any;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public userRank=0;
  public myEMPCount=0;
  public forumCount=0;
  public hostname:string;
  public singleButton = {img: 'basicTrainButton.png', title: 'Basic Training'}; //basicTrainButton.png
  public user:any;
  
  constructor(private router: Router) { console.log('constructor'); }

  ngOnInit(): void {
  	this.hostname = getHostname();
  	this.user = userObjFromUser();
  	console.log('ngOnInit', this.user);
  }
  multiplayGameClicked(login:any) {
	if(this.user.username != 'Guest')
	  	login.show();
	else
		this.router.navigate(['/multiplayer']);

  }
  singlePlayerGame(startGame:any) {
//  	playSound('open.mp3', 0, false);
  	startGame.show();
  }
}
