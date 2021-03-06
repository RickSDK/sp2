import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
	@Output() messageEvent = new EventEmitter<string>();
	@Input('adminModeFlg') adminModeFlg: string;
	public units = [];
	public casList = [];
	public user: any;
	public loadingFlg = true;
	public unitList = [];
	public userStrategies = [];
	public selectedStrategy: any;
	public showUnitPriorityFlg = false;
	public classTypes = [
		'Land Units',
		'Air Units',
		'Sea Units',
		'Special Units 1',
		'Special Units 2',
		'Special Units 3',
		'Special Units 4',
	];
	public rankTypes = [
		'',
		'',
		'',
		'Sergeant',
		'Warrant Officer',
		'Lieutenant',
		'Brig General',
	];
	//  public buttonIdx:number;
	public selectedUnit: any;

	public buttonList = [
		{ name: 'Land', icon: 'fa-truck', title: 'Land' },
		{ name: 'Air', icon: 'fa-fighter-jet', title: 'Air' },
		{ name: 'Sea', icon: 'fa-anchor', title: 'Sea' },
		{ name: 'Sp1', icon: 'fa-star', title: 'Special' },
		{ name: 'Sp2', icon: 'fa-star' },
		{ name: 'Sp3', icon: 'fa-star' },
		{ name: 'Sp4', icon: 'fa-star' },
	];
	constructor() { super(); }

	ngOnInit(): void {
		this.units = populateUnits();
		this.selectButton(0);
		this.user = userObjFromUser();
	}
	show() {
		//	this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
		this.openModal('#unitsPopup');
		this.segmentIdx = 0;
		var casList = [];
		this.units.forEach(unit => {
			if (unit.cas > 0 && unit.cas < 99)
				casList.push(unit);
		});
		this.casList = casList;
		this.casList.sort(function (a, b) { return a.cas - b.cas; });
		console.log(this.casList);

	}
	selectButton(idx) {
		this.segmentIdx = idx;
		this.unitList = [];
		if (idx == 0) {
			this.unitList.push(this.units[1]);
			this.unitList.push(this.units[2]);
			this.unitList.push(this.units[3]);
			this.unitList.push(this.units[10]);
			this.unitList.push(this.units[11]);
			this.unitList.push(this.units[15]);
			this.unitList.push(this.units[19]);
		}
		if (idx == 1) {
			this.unitList.push(this.units[6]);
			this.unitList.push(this.units[7]);
			this.unitList.push(this.units[13]);
			this.unitList.push(this.units[14]);
			this.unitList.push(this.units[52]);
		}
		if (idx == 2) {
			this.unitList.push(this.units[4]);
			this.unitList.push(this.units[5]);
			this.unitList.push(this.units[8]);
			this.unitList.push(this.units[9]);
			this.unitList.push(this.units[12]);
		}
		if (idx > 2) {
			for (var i = 1; i <= 8; i++) {
				this.unitList.push(this.units[(idx - 3) * 8 + i + 19]);
			}
		}
		this.selectUnit(this.unitList[0]);
	}
	selectUnit(unit) {
		this.selectedUnit = unit;
		this.selectedUnit.targetDesc = 'whoa';
		this.loadStrategyItems(this.selectedUnit.id);
	}
	ngUnitSrc(piece, nation = 0) {
		if (!piece || piece == 0) {
			return "assets/graphics/units/piece1.png";
		}
		if (piece == 11 && nation > 0)
			return "assets/graphics/units/leader" + nation + ".png";
		if (piece < 100)
			return "assets/graphics/units/piece" + piece + "u.png";
		else
			return "assets/graphics/units/piece" + piece + ".gif";
	}
	loadStrategyItems(id) {
		this.loadingFlg = true;
		const url = getHostname() + "/webSuperpowers.php";
		var body = JSON.stringify({ user_login: 'test', code: 'x', action: 'userStrategy', id: id });

		const postData = {
			method: 'POST',
			headers: new Headers(),
			body: body
		};
		fetch(url, postData).then((resp) => resp.text())
			.then((data) => {
				this.loadingFlg = false;
				var items = data.split("<a>");
				var userStrategies = [];
				items.forEach(function (item) {
					if (item.length > 10) {
						var c = item.split("|");
						if (c.length > 2)
							userStrategies.push({ id: c[0], userName: c[1], rank: c[2], graphic: userGraphicFromLine(c[3]), row_id: c[4], desc: c[5] });
					}
				});
				this.userStrategies = userStrategies;
				this.messageEvent.emit('refresh');
			})
			.catch(error => {
				this.loadingFlg = false;
			});
	}
	uploadStrategyPressed() {
		var strategyText = this.databaseSafeValueOfInput('strategyText');
		if (strategyText.length == 0) {
			this.showAlertPopup('no strategyText', 1);
			return;
		}
		this.playClick();
		this.playSound('Cheer.mp3');
		$('#strategyText').val('');

		const url = this.getHostname() + "/webSuperpowers.php";
		const postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'uploadStrategy', unitId: this.selectedUnit.id, strategyText: strategyText });
		console.log(postData);

		fetch(url, postData).then((resp) => resp.text())
			.then((data) => {
				if (this.verifyServerResponse(data)) {
					this.loadStrategyItems(this.selectedUnit.id);
				}
			})
			.catch(error => {
				this.showAlertPopup('Unable to reach server: ' + error, 1);
			});


	}
	deleteStratButtonPressed(strategy: any) {
		this.playClick();
		this.selectedStrategy = strategy;
		this.displayFixedPopup('confirmationPopup');
		console.log(strategy);
	}
	deleteStratConfirmed() {
		this.playClick();
		this.closePopup('confirmationPopup');
		const url = this.getHostname() + "/webSuperpowers.php";
		const postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'deleteStrategy', id: this.selectedStrategy.row_id });

		fetch(url, postData).then((resp) => resp.text())
			.then((data) => {
				console.log(data);
				if (this.verifyServerResponse(data)) {
					this.loadStrategyItems(this.selectedUnit.id);
				}
			})
			.catch(error => {
				this.showAlertPopup('Unable to reach server: ' + error, 1);
			});

	}

}
