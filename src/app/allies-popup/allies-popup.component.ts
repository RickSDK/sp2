import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;

@Component({
  selector: 'app-allies-popup',
  templateUrl: './allies-popup.component.html',
  styleUrls: ['./allies-popup.component.scss']
})
export class AlliesPopupComponent extends BaseComponent implements OnInit {
  public showInfoFlg = false;

  constructor() { super(); }

  ngOnInit(): void {
  }

  show(gameObj:any, ableToTakeThisTurn:any, currentPlayer:any, user:any) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    this.openModal('#alliesPopup');
  }

}
