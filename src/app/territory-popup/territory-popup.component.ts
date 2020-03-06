import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var ngUnitSrc: any;
declare var populateUnits: any;
declare var getSuperpowersData: any;

@Component({
  selector: 'app-territory-popup',
  templateUrl: './territory-popup.component.html',
  styleUrls: ['./territory-popup.component.scss']
})
export class TerritoryPopupComponent implements OnInit {
  public selectedTerritory:any;
  public currentPlayer:any;
  public gameObj:any;
  public optionType:string;
  public ableToTakeThisTurn = true;
  public showLeaderMessage = true;
  public showInfoFlg = false;
  public unitDetailFlg = false;
  public superpowersData:any;
  
  constructor() {  }

  ngOnInit(): void {
  }
  show(terr, currentPlayer, gameObj) {
    $("#territoryPopup").modal();
    this.selectedTerritory = terr;
    this.currentPlayer = currentPlayer;
    this.gameObj = gameObj;
    
    this.superpowersData = getSuperpowersData();
    this.optionType = 'none';
    console.log(terr.name, terr);
  }
  ngUnitSrc(piece, nation) {
  	return ngUnitSrc(piece, nation);
  }
  ngStyleUnitTop(optionType) {
	if(optionType=='production')
		return {'max-width': '40px', 'max-height': '30px'};
	else
		return {'max-width': '100px', 'max-height': '60px'};
  }
  ngStyleLogs(nation) {
	var colors=['#ffc','#ccf','#ccc','#db6','#fcc','#cfc','#ffc','#fcf','#cff','#666'];
	var color=colors[nation];
	return {'background-color': color};
  }
}
