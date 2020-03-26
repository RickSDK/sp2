import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var offerTreaty: any;

@Component({
  selector: 'app-allies-view',
  templateUrl: './allies-view.component.html',
  styleUrls: ['./allies-view.component.scss']
})
export class AlliesViewComponent extends BaseComponent implements OnInit {
  @Input('gameObj') gameObj: any;
  @Input('displayPlayers') displayPlayers: any;
  @Input('displayTeams') displayTeams: any;
  @Input('ableToTakeThisTurn') ableToTakeThisTurn: any;
  @Input('currentPlayer') currentPlayer: any;

  constructor() { super(); }

  ngOnInit(): void {
  }
  offerTreaty(type: number, nation: number) {
    offerTreaty(type, nation, this.gameObj, this.currentPlayer, this.superpowersData);
  }
}
