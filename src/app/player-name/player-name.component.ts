import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-player-name',
  templateUrl: './player-name.component.html',
  styleUrls: ['./player-name.component.scss']
})
export class PlayerNameComponent implements OnInit {
  @Input('player') player: any;

  constructor() { }

  ngOnInit(): void {
  }
  ngStyleMarker(num: number) {
    if (num == 3)
      return { 'color': '#0f0' }
    if (num == 2)
      return { 'color': 'yellow' }
    if (num == 1)
      return { 'color': 'red' }
    else
      return { 'color': 'black' }
  }
}
