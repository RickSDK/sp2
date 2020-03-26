import { Component, OnInit, Input } from '@angular/core';

declare var displayFixedPopup: any;
declare var $: any;

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {
  @Input('gameObj') gameObj: any;

  constructor() { }

  ngOnInit(): void {
  }
  surrenderButtonPressed() {
    displayFixedPopup('surrenderPopup');
    $('#gamePlayersPopup').modal('hide');
  }
}
