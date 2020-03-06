import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;

@Component({
  selector: 'app-tech-popup',
  templateUrl: './tech-popup.component.html',
  styleUrls: ['./tech-popup.component.scss']
})
export class TechPopupComponent extends BaseComponent implements OnInit {
  public descFlg=false;
  
  constructor() { super(); }

  ngOnInit(): void {
  }
  show(gameObj:any, ableToTakeThisTurn:any, currentPlayer:any, user:any) {
    this.descFlg = (!gameObj);
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    this.openModal('#techPopup');
  }
}
