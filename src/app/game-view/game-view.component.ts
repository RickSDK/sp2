import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var displayFixedPopup: any;
declare var $: any;

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent extends BaseComponent implements OnInit {
  @Input('gameObj') gameObj: any;
  @Input('ableToTakeThisTurn') ableToTakeThisTurn: any;

  constructor() { super(); }

  ngOnInit(): void {
  }
  surrenderButtonPressed() {
    displayFixedPopup('surrenderPopup');
    $('#gamePlayersPopup').modal('hide');
  }
  computerGo() {
    this.closeModal('#gamePlayersPopup');
    displayFixedPopup('computerTakeTurnPopup');
  }  
  reportBug(id) {
    this.showAlertPopup('not coded yet.', 1);
    $('#gamePlayersPopup').modal('hide');
//    $(id).show(null, null, null, this.user, null);
//    $('#chatPopup').modal('show');
  }
}
