import { Component, OnInit, Input } from '@angular/core';

declare var numberVal: any;

@Component({
  selector: 'app-player-name',
  templateUrl: './player-name.component.html',
  styleUrls: ['./player-name.component.scss']
})
export class PlayerNameComponent implements OnInit {
  @Input('player') player: any;
  public titles = ['Gone', 'Logged in once in the past week', 'Logged in 5 of the past 7 days', 'Logs in every day'];
  public activity = 0;
  public title = this.titles[this.activity];

  constructor() { }

  ngOnInit(): void {
    var act = this.player.activity || this.player.activity_level;
    var activity = numberVal(act);
    this.title = this.titles[activity];
  }
  ngStyleMarker(player: any) {
    var act = player.activity || player.activity_level;
    var activity = numberVal(act);
 
    if (activity == 3)
      return { 'color': '#0f0' }
    if (activity == 2)
      return { 'color': 'yellow' }
    if (activity == 1)
      return { 'color': 'red' }
    else
      return { 'color': 'black' }
  }
}
