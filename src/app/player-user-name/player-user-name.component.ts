import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-player-user-name',
  templateUrl: './player-user-name.component.html',
  styleUrls: ['./player-user-name.component.scss']
})
export class PlayerUserNameComponent implements OnInit {
  @Input('gameObj') gameObj: any;
  @Input('player') player: any;
  @Input('detailsFlg') detailsFlg: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
