import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var playSound: any;
declare var getSuperpowersData: any;
declare var ngUnitSrc: any;
declare var displayFixedPopup: any;
declare var showAlertPopup: any;
declare var userObjFromUser: any;
declare var playClick: any;
declare var ngClassGameTypeMain: any;
declare var getHostname: any;
declare var getPostDataFromObj: any;
declare var verifyServerResponse: any;
declare var closePopup: any;
declare var numberVal: any;
declare var databaseSafeValueOfInput: any;
declare var playSound: any;
declare var spVersion: any;

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
  public loadingFlg = false;
  public appVersion: string;

  constructor() {
    this.superpowersData = getSuperpowersData();
    this.appVersion = spVersion();
    //console.log('superpowersData', this.superpowersData);
  }

  ngOnInit(): void {  }

  //-----img---
  ngUnitSrc(piece: number, nation = 1) {
    return ngUnitSrc(piece, nation);
  }
  //-----ngStyles---
  ngStyleLogs2(nation: number, deadFlg = false) {
    var bg = this.ngStyleLogs(nation, deadFlg);
    bg['border'] = '1px solid black';
    bg['padding'] = '5px';
    bg['border-radius'] = '10px';
    return bg;
  }
  playClick() {
    playClick();
  }
  userUpdated($event) {
    console.log('User updated from emit!')
    this.user = userObjFromUser();
  }
  getHostname() {
    return getHostname();
  }
  getPostDataFromObj(obj: any) {
    return getPostDataFromObj(obj);
  }
  verifyServerResponse(data: any) {
    return verifyServerResponse('success', data);
  }
  ngStyleLogs(nation: number, deadFlg = false) {
    if (nation == 99)
      return { 'background-color': '#7df', 'color': 'black' };
    if (deadFlg)
      return { 'background-color': '#777', 'color': 'black' };

    var colors = ['#ffc', '#ccf', '#ccc', '#db6', '#fcc', '#cfc', '#ffc', '#fcf', '#cff', '#666'];
    var color = colors[nation];
    return { 'background-color': color, 'color': 'black' };
  }
  ngStyleActivity(num: number) {
    if (num == 3)
      return { 'background-color': '#0f0' }
    if (num == 2)
      return { 'background-color': 'yellow' }
    if (num == 1)
      return { 'background-color': 'red' }
    else
      return { 'background-color': 'black' }
  }
  //-----ngClasses---
  ngClassSegment(num: number, buttonIdx: number) {
    if (num == buttonIdx)
      return 'btn btn-primary roundButton';
    else
      return 'btn btn-light roundButton';
  }
  ngClassGameType(gameType: string) {
    return ngClassGameTypeMain(gameType);
  }
  ngClassUnit(num1: number, num2: number) {
    if (num1 == num2)
      return 'shadowedYellow';
    else
      return 'shadowed';
  }
  ngClassClickableFlag(num1: number, num2: number) {
    if (num1 == num2)
      return 'shadowedYellow flagBig';
    else
      return 'shadowed flagCapital';
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
    $(id).modal('hide');
  }
  showUnitPopup(unit: any) {
    var piece = 1;
    if (unit > 0)
      piece = unit;
    else
      piece = unit.piece || unit.id;
    this.selectedUnit = this.superpowersData.units[piece];
    displayFixedPopup('unitPopup');
  }
  displaySPPopup(id: string) {
    displayFixedPopup(id);
  }
  displayFixedPopup(id: string, flg = false) {
    displayFixedPopup(id, flg);
  }
  closePopup(id: string) {
    closePopup(id);
  }
  showAlertPopup(msg: string, num = 0) {
    showAlertPopup(msg, num);
  }
  numberVal(val: any) {
    return numberVal(val);
  }
  databaseSafeValueOfInput(id: string) {
    return databaseSafeValueOfInput(id);
  }
  playSound(id: string) {
    playSound(id);
  }
}
