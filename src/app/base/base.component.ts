import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var playSound: any;
declare var getSuperpowersData: any;
declare var ngUnitSrc: any;
declare var displayFixedPopup: any;

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  public superpowersData: any;
  public gameObj: any;
  public ableToTakeThisTurn: boolean;
  public currentPlayer: any;
  public user: any;
  public segmentIdx = 0;
  public adminFlg = false;
  public infoFlg = false;
  public selectedUnit: any;
  public unitDetailFlg = false;

  constructor() {
    this.superpowersData = getSuperpowersData();
    //console.log('superpowersData', this.superpowersData);
  }

  ngOnInit(): void { }

  //-----img---
  ngUnitSrc(piece: number, nation = 1) {
    return ngUnitSrc(piece, nation);
  }
  //-----ngStyles---
  ngStyleLogs(nation: number, deadFlg = false) {
    if (nation == 99)
      return { 'background-color': '#7df', 'color': 'black' };
    if (deadFlg)
      return { 'background-color': '#777', 'color': 'black' };

    var colors = ['#ffc', '#ccf', '#ccc', '#db6', '#fcc', '#cfc', '#ffc', '#fcf', '#cff', '#666'];
    var color = colors[nation];
    return { 'background-color': color, 'color': 'black' };
  }
  //-----ngClasses---
  ngClassSegment(num: number, buttonIdx: number) {
    if (num == buttonIdx)
      return 'btn btn-primary roundButton';
    else
      return 'btn btn-light roundButton';
  }

  //-----views---
  initView(gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any) {
    this.gameObj = gameObj;
    this.ableToTakeThisTurn = ableToTakeThisTurn;
    this.currentPlayer = currentPlayer;
    this.user = user;
    this.adminFlg = (user && user.userName == 'Rick');
    //console.log('gameObj', this.gameObj);
  }
  openModal(id: string) {
    this.segmentIdx = 0;
    playSound('open.mp3', 0, false);
    $(id).on('hidden.bs.modal', function () {
      playSound('open.mp3', 0, false);
    });
    $(id).modal();
  }
  closeModal(id: string) {
    $(id).modal('toggle');
  }
  showUnitPopup(unit: any) {
    let piece = unit.piece || unit.id;
    this.selectedUnit = this.superpowersData.units[piece];
    displayFixedPopup('unitPopup');
  }
}
