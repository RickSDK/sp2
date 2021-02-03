import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Game } from '../classes/game';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent extends BaseComponent implements OnInit {
  @Input('game') game: Game;
  @Input('user') user: any;
  @Output() messageEvent = new EventEmitter<any>();
  @Output() openGamePressed = new EventEmitter<{ game: any, action: string }>();
  @Output() editPlayerPressed = new EventEmitter<{ game: any, player: any, action: string }>();

  constructor() { super(); }

  ngOnInit(): void {
  }
  enterGame(game: Game) {
    this.messageEvent.emit(game);
  }
  showGameDetails(game: Game) {
    console.log(game);
    game.showDetailsFlg = !game.showDetailsFlg;
  }
  editPlayer(game: Game, player: any, action: string) {
    //changeTeamOfPlayer
    //removePlayerFromGame
    this.editPlayerPressed.emit({ game: game, player: player, action: action });
  }
  showGame(game) {
    console.log(game);
  }
  openGameButtonPressed(game: Game, action: string) {
    this.openGamePressed.emit({ game: game, action: action });
  }
  ngStyleGameBg(game: any) {
    if (game.status == 'Complete')
      return { 'background-color': '#ccc' }
    else if (game.status == 'Open')
      return { 'background-color': '#cfc' }
    else
      return { 'background-color': 'white' }
  }
  ngClassGameButton(game: any) {
    if (game.status == 'Open')
      return 'btn btn-success roundButton';
    if (game.status == 'Complete')
      return 'btn btn-secondary roundButton';
    if (game.turn == this.user.userName)
      return 'btn btn-warning roundButton glowYellow';

    if (game.accountSitFlg)
      return 'btn btn-primary roundButton glowBlue';

    if (game.status == 'Playing')
      return 'btn btn-primary roundButton';
    if (game.mmFlg)
      return 'btn btn-info roundButton';
  }
  ngClassGame(game) {
    if (game.mmFlg)
      return 'darkBlueBg';
    else
      return 'darkPurpleBg';

  }
}
