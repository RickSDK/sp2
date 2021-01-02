import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent extends BaseComponent implements OnInit {
  public buttonIdx = 0;
  public buttonList = [
  	{name: 'Info', icon: 'fa-info-circle'},
  	{name: 'Overview', icon: 'fa-eye'},
  	{name: 'Rules', icon: 'fa-book'},
  	{name: 'Nations', icon: 'fa-globe'},
  	{name: 'More', icon: 'fa-plus'},
    ];
    public overviewList = [
      {piece: 2, name: 'Infantry', desc: 'Superpowers is a turn based game you can play solo or against other people. Playing against others is when the real fun begins!'},
      {piece: 3, name: 'Tank', desc: 'The game is FREE, there is nothing to download to get started. Simply click the "Single Player" on the previous screen to get the ball rolling.'},
      {piece: 1, name: 'Artillery', desc: 'The object is quite simple... take over the world! Become the leader of the world\'s biggest Superpower.'},
      {piece: 14, name: 'Nuke', desc: 'Turns consist of 2 parts: Purchase & Combat. "Purchase" phase is where you buy stuff, and "Combat" is where... well you get the idea.'},
      {piece: 11, name: 'Leader', desc: 'Once you have proven your valor in a single-player game, you are free to join our online community. Play at your own pace. You have 24 hours to take your turn, but all day to study the map!'},
      {piece: 10, name: 'General', desc: 'Multi-player turns only take about 1 minute per day, and games progress over time. Try to rank up and reach the level of Grand General!'},
      {piece: 24, name: 'Missile Launcher', desc: 'Give it a try! We are always looking for new online players to join the fun.'}
    ]
  public superpowers = ['United States','European Union','Russian Federation','Imperial Japan','Communist China','Middle-East Federation','African Coalition','Latin Alliance'];

  constructor() { super(); }

  ngOnInit(): void {
  }

}

