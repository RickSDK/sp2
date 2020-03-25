import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;

@Component({
  selector: 'app-tech-popup',
  templateUrl: './tech-popup.component.html',
  styleUrls: ['./tech-popup.component.scss']
})
export class TechPopupComponent extends BaseComponent implements OnInit {
	@Input('adminModeFlg') adminModeFlg: string;
  public descFlg=false;
  public techItems = [
    {name: 'Air Power', icon: 'fighter-jet'},
    {name: 'Warheads', icon: 'crosshairs'},
    {name: 'Torpedoes', icon: 'anchor'},
    {name: 'Economy', icon: 'industry'},
    {name: 'Bombers', icon: 'plane'},
    {name: 'Tactical', icon: 'cogs'},
  ]
  
  constructor() { super(); }

  ngOnInit(): void {
  }
  show(gameObj:any, ableToTakeThisTurn:any, currentPlayer:any, user:any) {
    this.descFlg = (!gameObj);
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    this.openModal('#techPopup');
  }
}
