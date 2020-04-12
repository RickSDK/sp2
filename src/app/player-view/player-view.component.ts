import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var drawSPGraph: any;

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent extends BaseComponent implements OnInit {
  @Input('gameObj') gameObj: any;
  @Input('incomePlayers') incomePlayers: any;
  @Input('unitPlayers') unitPlayers: any;

  constructor() { super(); }

  ngOnInit(): void {
  }

}
