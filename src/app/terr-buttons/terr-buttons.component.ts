import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var playClick: any;
@Component({
  selector: 'app-terr-buttons',
  templateUrl: './terr-buttons.component.html',
  styleUrls: ['./terr-buttons.component.scss']
})
export class TerrButtonsComponent implements OnInit {
  @Input('selectedTerritory') selectedTerritory: any;
  @Input('currentPlayer') currentPlayer: any;
  @Input('superpowersData') superpowersData: any;
  @Input('gameObj') gameObj: any;
  @Input('user') user: any;
  @Input('ableToTakeThisTurn') ableToTakeThisTurn: any;

  @Output() messageEvent = new EventEmitter<string>();
  
  public allyNation = 1;
  public infoFlg = false;
  public loadingFlg = false;
  public optionType = 'home';
  public allies = [];

  constructor() { }

  ngOnInit(): void {
  }
  changeOptionType(type: string) {
    playClick();
    this.optionType = type;
    this.messageEvent.emit(type); 
  }
}
