import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var populateUnits: any;
declare var userObjFromUser: any;
declare var getHostname: any;
declare var userGraphicFromLine: any;

@Component({
  selector: 'app-units-popup',
  templateUrl: './units-popup.component.html',
  styleUrls: ['./units-popup.component.scss']
})
export class UnitsPopupComponent extends BaseComponent implements OnInit {
  public units = [];
  public user:any;
  public loadingFlg = true;
  public unitList = [];
  public userStrategies = [];
//  public buttonIdx:number;
  public selectedUnit:any;
  
  public buttonList = [
  	{name: 'Land', icon: 'fa-truck', title: 'Land'},
  	{name: 'Air', icon: 'fa-fighter-jet', title: 'Air'},
  	{name: 'Sea', icon: 'fa-anchor', title: 'Sea'},
  	{name: 'Sp1', icon: 'fa-star', title: 'Special'},
  	{name: 'Sp2', icon: 'fa-star'},
  	{name: 'Sp3', icon: 'fa-star'},
  	{name: 'Sp4', icon: 'fa-star'},
  	];
  constructor() { super(); }

  ngOnInit(): void {
  	this.units = populateUnits();
  	this.selectButton(0);
  	this.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
  }
  show() {
//	this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    this.openModal('#unitsPopup');
    this.segmentIdx = 0;
    
  }
  selectButton(idx) {
  	this.segmentIdx = idx;
  	this.unitList = [];
  	if(idx==0) {
	  	this.unitList.push(this.units[1]);
	  	this.unitList.push(this.units[2]);
	  	this.unitList.push(this.units[3]);
	  	this.unitList.push(this.units[10]);
	  	this.unitList.push(this.units[11]);
	  	this.unitList.push(this.units[15]);
	  	this.unitList.push(this.units[19]);
  	}
  	if(idx==1) {
	  	this.unitList.push(this.units[6]);
	  	this.unitList.push(this.units[7]);
	  	this.unitList.push(this.units[13]);
	  	this.unitList.push(this.units[14]);
	  	this.unitList.push(this.units[52]);
  	}
  	if(idx==2) {
	  	this.unitList.push(this.units[4]);
	  	this.unitList.push(this.units[5]);
	  	this.unitList.push(this.units[8]);
	  	this.unitList.push(this.units[9]);
	  	this.unitList.push(this.units[12]);
  	}
  	if(idx>2) {
  		for(var i=1; i<=8; i++) {
		  	this.unitList.push(this.units[(idx-3)*8+i+19]);
  		}
  	}
  	this.selectUnit(this.unitList[0]);
  }
  selectUnit(unit) {
	  this.selectedUnit=unit;
	  this.selectedUnit.targetDesc = 'whoa';
  	this.loadStrategyItems(this.selectedUnit.id);
  }
  ngUnitSrc(piece, nation=0) {
		if(!piece || piece==0) {
			return "assets/graphics/units/piece1.png";
		}
		if(piece==11 && nation>0)
			return "assets/graphics/units/leader"+nation+".png";
		if(piece<100)
			return "assets/graphics/units/piece"+piece+"u.png";
		else
			return "assets/graphics/units/piece"+piece+".gif";
  }
  uploadStrategyPressed(unit) {
  }
  loadStrategyItems(id) {
  	this.loadingFlg = true;
  	const url = getHostname()+"/webSuperpowers.php";
  	var body = JSON.stringify({user_login: 'test', code: 'x', action: 'userStrategy', id: id});
  	
  	const postData = {
	    method: 'POST', 
	    headers: new Headers(),
	    body: body
    	};
  	fetch(url, postData).then( (resp) => resp.text())
  	.then( (data)=>{ 
	  	this.loadingFlg = false;
		var items = data.split("<a>");
		var userStrategies = [];
		items.forEach(function(item) {
			if(item.length>50) {
				var c = item.split("|");
				userStrategies.push({id: c[0], userName: c[1], rank: c[2], graphic: userGraphicFromLine(c[3]), row_id: c[4], desc: c[5]});
			}
		});
		this.userStrategies = userStrategies;
 	}) 
  	.catch(error=> { 
	  	this.loadingFlg = false;
  	} );
    
    /*
  	fetch(url, postData).then( (resp) => resp.json())
  	.then(data=>{ 
 	  	//this.showPopup('busyPopup');
 	  	console.log('postGameRequest', JSON.stringify(data));
 	  	//alert(JSON.stringify(data));
 	}) 
  	.catch(error=> { console.log('json error!'+error); } );
  	*/
  }

}
