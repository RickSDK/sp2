import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-territories-view',
  templateUrl: './territories-view.component.html',
  styleUrls: ['./territories-view.component.scss']
})
export class TerritoriesViewComponent extends BaseComponent implements OnInit {
  @Input('gameObj') gameObj: any;
  public selectedPlayer: any;

  constructor() { super(); }

  ngOnInit(): void {
    if (this.gameObj.players.length > 0)
      this.selectPlayer(this.gameObj.players[0]);
  }
  selectPlayer(player) {
    this.selectedPlayer = player;
    if (player.territories.length == 0) {
      var territories = [];
      this.gameObj.territories.forEach(terr => {
        if (terr.owner == player.nation && terr.unitCount>0)
          territories.push(terr);
      });
      player.territories = territories;
    }
  }

}
