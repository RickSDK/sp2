import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { analyzeAndValidateNgModules } from '@angular/compiler';

declare var loadSVGs: any;
//declare var getGameTerritories: any;
//declare var populateUnits: any;
declare var refreshBoard: any;
declare var refreshTerritory: any;
declare var isMobile: any;
declare var numberVal: any;
declare var hideArrow: any;
declare var ngUnitSrc: any;
declare var startSpinner: any;
declare var updateProgressBar: any;
declare var stopSpinner: any;
declare var getHostname: any;
declare var userObjFromUser: any;
declare var createNewGameSimple: any;
declare var loadSinglePlayerGame: any;
declare var unitsForTerr: any;
declare var playersPanelMoved: any;
declare var saveGame: any;
declare var scrubGameObj: any;
declare var getYourPlayer: any;
declare var militaryAdvisorPopup: any;
declare var closePopup: any;
declare var getCurrentPlayer: any;
declare var showAlertPopup: any;
declare var getDisplayUnitCount: any;
declare var unitOfId: any;
declare var playSound: any;
declare var displayFixedPopup: any;
declare var playVoiceSound: any;
declare var changeClass: any;
declare var playClick: any;
//---board.js
declare var displayLeaderAndAdvisorInfo: any;
declare var getDisplayQueueFromQueue: any;
declare var highlightCapital: any;
declare var scrubUnitsOfPlayer: any;
declare var resetPlayerUnits: any;
//---spLib.js
declare var scrollToCapital: any;

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss']
})
export class BoardComponent extends BaseComponent implements OnInit {
	public svgs = [];
	public hostname: string;
	public user: any;
	public loadingFlg = true;
	public showControls = false;
	public historyMode = false;
	public historyRound = 1;
	public gameObj: any;
	public currentPlayer: any;
	public yourPlayer = { userName: 'Ted', nation: 3 };
	public ableToTakeThisTurn = true;
	public uploadMultiplayerFlg = false;
	public progress = 0;
	public isMobileFlg = true;
	public spriteInMotionFlg = false;
	public spritePieceId = 2;
	public technologyPurchases = [];

	constructor() { super(); }

	ngOnInit(): void {
		this.hostname = getHostname();
		this.user = userObjFromUser();
		this.user.rank = 1;
		this.svgs = loadSVGs();
		this.initBoard();
	}
	//----------------load board------------------
	initBoard() {
		startSpinner('Loading Game', '100px');
		updateProgressBar(20);
		if (localStorage.loadGameId && localStorage.loadGameId > 0) {
			console.log('+++ multiplayer....', localStorage.loadGameId);
		} else {
			if ((localStorage.currentGameId && localStorage.currentGameId > 0)) {
				//load game
				console.log('+++ load single player....', localStorage.currentGameId);
				this.gameObj = loadSinglePlayerGame();
			} else {
				//new game
				if (numberVal(localStorage.startingNation) == 0)
					localStorage.startingNation = 2;
				var startingNation = localStorage.startingNation;
				console.log('+++ new single player....', startingNation);
				var type = (localStorage.gameType == 1) ? 'freeforall' : 'diplomacy';
				var id = 3;
				var numPlayers = 4;
				var attack = 6;
				var name = (this.user.rank == 0) ? 'Basic Training' : 'Single Player Game';
				if (this.user.rank == 0)
					type = "basicTraining";

				var pObj = {};
				if (localStorage.customGame == 'Y') {
					type = localStorage.customGameType;
					numPlayers = localStorage.customNumPlayers;
					pObj = JSON.parse(localStorage.customGamePlayers);
				}
				this.gameObj = createNewGameSimple(type, numPlayers, name, startingNation, pObj);
				//				this.gameObj = createNewGame(id, type, numPlayers, name, attack, this.gUnits, startingNation, localStorage.fogOfWar, this.user.rank, localStorage.customGame, pObj, localStorage.hardFog);
				//				this.gameObj.difficultyNum = localStorage.difficultyNum || 1;
				saveGame(this.gameObj, this.user, this.currentPlayer);
				localStorage.currentGameId = this.gameObj.id;
			}
		}
		scrubGameObj(this.gameObj, this.superpowersData.units);
		console.log('gameObj', this.gameObj);
		setTimeout(() => { this.loadBoard(); }, 500);
	}
	loadBoard() {
		updateProgressBar(70);
		var e = document.getElementById('terr1');
		if (e) {
			this.yourPlayer = getYourPlayer(this.gameObj, this.user.userName);
			console.log('yourPlayer', this.yourPlayer);
			for (var x = 0; x < this.gameObj.territories.length; x++) {
				var terr = this.gameObj.territories[x];
				refreshTerritory(terr, this.gameObj, this.superpowersData.units, this.currentPlayer, this.superpowersData.superpowers, this.yourPlayer);
			}
			refreshBoard(this.gameObj.territories);
			var left = window.innerWidth - 55;
			if (left > 1282) {
				this.isMobileFlg = false;
				setTimeout(() => { playersPanelMoved(); }, 500);
			}
			setTimeout(() => { this.startTheAction(); }, 500);
		} else {
			console.log('board not loaded!!!');
		}
	}
	startTheAction() {
		this.loadingFlg = false;
		this.showControls = true;

		///----------------------here!!!
		this.currentPlayer = getCurrentPlayer(this.gameObj);
		console.log('currentPlayer', this.currentPlayer);
		this.currentPlayer.news = [];

		updateProgressBar(100);
		stopSpinner();
		if (this.currentPlayer.nation == this.yourPlayer.nation)
			this.displayHelpMessages();
	}
	//----------------load board------------------
	displayHelpMessages() {
		scrollToCapital(this.yourPlayer.nation);
		if (this.gameObj.round == 1 && this.currentPlayer.placedInf < 3)
			militaryAdvisorPopup('New Game! You are starting as ' + this.superpowersData.superpowers[this.yourPlayer.nation] + '. First place 3 infantry by clicking on your territories.', 21); //23
	
	
			//militaryAdvisorPopup('New Game! You are starting as ' + this.superpowersData.superpowers[this.yourPlayer.nation] + '. The countries displayed on the side are your CPU players you will be up against.', 21); //23
		//this.initializePlayer(this.currentPlayer); //<-- delete this!!
		//sidelinePopup
	}
	playGameButtonPressed() {
		console.log('clicked');
		closePopup('advisorPopup');
		this.initializePlayer(this.currentPlayer);
	}
	initializePlayer(player: any) {
		if (player.id != this.currentPlayer.id)
			this.currentPlayer = player;
		this.showControls = !player.cpu;
		console.log('+++-------------------------player: ', this.superpowersData.superpowers[player.nation]);
		player.diplomacyFlg = false;
		player.diplomacyWarningFlg = false;
		player.generalIsCargo = false;
		player.status = 'Purchase';
		player.techsBoughtThisTurn = 0;
		this.gameObj.currentNation = player.nation;
		this.gameObj.actionButtonMessage = (player.status == 'Purchase') ? 'Purchase Complete' : 'Complete Turn';
		//cleanupTreaties(player);
		//cleanupCargo();
		scrollToCapital(player.nation);
		//highlightCapital(player.nation);
		player.techPurchasedThisTurn = false;
		player.techCount = 1;
		this.gameObj.unitPurchases = [];
		player.allies = []; //<---- figure out allies!!


		if (this.gameObj.gameOver) {
			console.log('game over!!');
			return;
		}

		resetPlayerUnits(player, this.gameObj); //<------------------------------------------------- clean player units

		if (this.gameObj.multiPlayerFlg && this.yourPlayer && this.yourPlayer.nation > 0) {
			this.ableToTakeThisTurn = (this.user.userName == player.userName);
		} else
			this.ableToTakeThisTurn = (this.gameObj.viewingNation == player.nation && !player.cpu);
		if (!this.gameObj.multiPlayerFlg)
			this.ableToTakeThisTurn = !player.cpu;

		//	if(this.adminMode && this.user.userName=='Rick') {
		//		this.ableToTakeThisTurn=true; // admin mode only!!!
		//		this.yourPlayer=this.currentPlayer;
		//	}
		if (this.gameObj.multiPlayerFlg && !player.cpu) {
			if (this.user.userName == player.userName && this.gameObj.mmFlg)
				player.empCount = 0;
			//		if(userCanSkip(player.nation))
			//			checkEMPAndTimer(player, this.ableToTakeThisTurn);
		}
		//	if (this.gameObj.multiPlayerFlg && this.gameObj.turboFlg && !this.ableToTakeThisTurn)
		//		startUpBackgroundViewer();
		/*
		if (this.currentPlayer.status == 'Place Units') {
			showConfirmationPopup('Player is stuck in Place Units phase. Press "OK" to continue the game.', 'forceEndTurn');
		}
		if (player.status == gStatusPurchase && !practiceMode) {
			this.techPurchasedThisTurn = false;
			
			setLastRoundsOfPeaceAndWar(player);
			var numFactories = cleanUpTerritories(player, player.cpu); //<------------------ clean territories
			if (player.cpu && player.income <= 5 && this.gameObj.round > 12 && !this.gameObj.multiPlayerFlg) {
				numFactories = 0;
			}
			player.treatiesAtStart = player.treaties.slice(0);
			checkTreatyOffers(player, player.cpu);
			if (numFactories == 0 && this.gameObj.round > 6) {
				logItem(this.currentPlayer, 'Eliminated', this.superpowersData.superpowers[player.nation] + ' eliminated.');
				var voiceId = numberVal(player.nation) + 60;
				playVoiceSound(voiceId, this.muteSound);
				showAlertPopup(this.superpowersData.superpowers[player.nation] + ' surrendered!', 1)
				player.alive = false;
				player.status = 'Place Units';
				removeAlliancesForNation(player.nation);
				setTimeout(function () { endTurn(player); }, 1500);
				return;
			}
		}
		player.allies = alliesFromTreaties(player);
		if (player && player.territories && player.territories.length > 0) {
			if (player.mainBaseID > 0)
				player.mainBase = this.gameObj.territories[player.mainBaseID - 1];
			else
				player.mainBase = player.territories[0];
		}
		player.secondaryTargetId = player.secondaryTargetId || 0;
		if (player.cpu) {
			console.log('player.cpu!');
			disableCompleteButtons();
			disableButton('actionButton', true);
			setTimeout(function () { computerGo(); }, 2000);
		} else {
			if (this.user.rank == 0 && numberVal(localStorage.practiceStep) < 3) {
			} else
				militaryAdvisory(player);
		}
*/

	}
	terrClicked(popup: any, terr: any, gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any) {
		if (this.gameObj.round == 1 && this.currentPlayer.placedInf < 3) {
			if (terr.treatyStatus < 4 || terr.nation == 99)
				showAlertPopup('Click on one of your ' + this.superpowersData.superpowers[this.yourPlayer.nation] + ' territories to place an infantry.', 1);
			else {
				this.addUnitToTerr(terr, 2, true, true);
				this.currentPlayer.placedInf++;
				if (this.currentPlayer.placedInf >= 3)
					displayFixedPopup('infantry3Confirm');
			}

			return;
		}
		hideArrow();
		if (currentPlayer.status == 'Purchase')
			changeClass('completeTurnButton', 'glowButton');

		refreshTerritory(terr, this.gameObj, this.superpowersData.units, this.currentPlayer, this.superpowersData.superpowers, this.yourPlayer);
		displayLeaderAndAdvisorInfo(terr, currentPlayer, this.yourPlayer, user, gameObj, this.superpowersData.superpowers);
//		terr.units = unitsForTerr(terr, gameObj.units);
		terr.displayQueue = getDisplayQueueFromQueue(terr, this.gameObj);
		popup.show(terr, currentPlayer, gameObj, ableToTakeThisTurn, user);
	}
	redoMoves() {

	}
	acceptInfantryPlacement() {
		closePopup('infantry3Confirm');
		highlightCapital(this.currentPlayer.nation);
		playVoiceSound(22);
	}
	addUnitToTerr(terr: any, piece: number, allowMovesFlg: boolean, refreshFlg: boolean) {
		if (piece == 52)
			allowMovesFlg = true;
		var nation = terr.owner;
		var newId = this.gameObj.unitId || this.gameObj.units.length;
		if (piece == 12) {
			//			console.log(this.gameObj.superBCForm);
			var unit = unitOfId(newId, nation, piece, terr.id, this.superpowersData.units, allowMovesFlg);
			var names = ['Titan', 'Bismark', 'Enterprise', 'Cowboy', 'Terminator', 'Ball-Buster', 'Behemuth', 'Gargantia', 'TLC', 'Peacemaker', 'Bubba Gump', 'Miami Vice', 'MVP', 'The Kracken', 'Flint Beastwood', 'Rager', 'Annihilation', 'Extermination', 'Massacre', 'All-Seaing', 'Monkey-Sea Monkey-Do', 'Seaing is Believing', 'Mother of Sea'];
			var nameId = Math.floor((Math.random() * names.length));
			unit.sbName = names[nameId];
			unit.att = 4 + this.gameObj.superBCForm.att;
			unit.att2 = 4 + this.gameObj.superBCForm.att;
			unit.def = 4 + this.gameObj.superBCForm.def;
			unit.def2 = 4 + this.gameObj.superBCForm.def;
			unit.numAtt = 1 + this.gameObj.superBCForm.numAtt;
			unit.numAtt2 = 1 + this.gameObj.superBCForm.numAtt;
			unit.numDef = 1 + this.gameObj.superBCForm.numDef;
			unit.adCount = this.gameObj.superBCForm.adCount;
			unit.bcHp = 1 + this.gameObj.superBCForm.hp;
			unit.damage = 0;
			console.log('sbc created!', unit);
			this.gameObj.units.push(unit);
		} else {
			var unit = unitOfId(newId, nation, piece, terr.id, this.superpowersData.units, allowMovesFlg);
			this.gameObj.units.push(unit);
		}
		this.gameObj.unitId++;
		if (piece == 15 || piece == 19) {
			terr.factoryCount++;
		}
		if (refreshFlg) {
			refreshTerritory(terr, this.gameObj, this.superpowersData.units, this.currentPlayer, this.superpowersData.superpowers, this.yourPlayer);
		} else {
			terr.unitCount++;
			terr.displayUnitCount = getDisplayUnitCount(terr, this.gameObj.fogOfWar, this.gameObj.hardFog);
		}
		this.annimateUnit(piece, terr);
	}
	annimateUnit(piece: number, terr: any) {
		playSound('Swoosh.mp3', 0, false);
		if (this.spriteInMotionFlg) {
			console.log('sprite blocked!');
			return;
		}
		this.spriteInMotionFlg = true;
		this.spritePieceId = piece;
		var e = document.getElementById('sprite');
		if (e) {
			e.style.display = 'block';
			e.style.left = terr.x + 'px';
			e.style.top = (terr.y + 100).toString() + 'px';
			e.style.height = '100px';
			this.zoomSprite(100);
		}
	}
	zoomSprite(height: number) {
		height -= 2;
		var e = document.getElementById('sprite');
		if (e) {
			e.style.height = height + 'px';
			if (height <= 0) {
				this.spriteInMotionFlg = false;
				e.style.display = 'none';
			} else {
				setTimeout(() => {
					this.zoomSprite(height);
				}, 10);
			}
		}
	}
	arrowsButtonClicked() {
		playersPanelMoved();
	}
	svgClick() {
	}
	dismissArrow() {
		hideArrow();
	}
	ngUnitSrc(piece, nation = 0) {
		return ngUnitSrc(piece, nation = 0);
	}
	completeTurnButtonPressed() {
		if (this.gameObj.round == 1 && this.currentPlayer.placedInf < 3) {
			showAlertPopup('Place your 3 infantry first.', 1);
			return;
		}
		if (this.user.rank < 2 && this.gameObj.round == 1 && this.currentPlayer.money >= 20 && this.currentPlayer.status == 'Purchase') {
			showAlertPopup('Conduct purchases first. Click on your capital, ' + this.superpowersData.superpowers[this.currentPlayer.nation] + '.', 1);
			return;
		}
		playClick();
		changeClass('completeTurnButton', 'btn btn-success roundButton');
		if (this.currentPlayer.status == 'Purchase') {
			this.currentPlayer.status = 'Attack';
			scrubUnitsOfPlayer(this.currentPlayer, this.gameObj, this.superpowersData.units); // in case of tech
			this.logPurchases(this.currentPlayer);
			this.gameObj.actionButtonMessage = 'Complete Turn';
			saveGame(this.gameObj, this.user, this.currentPlayer);
			//displayHelpPopupMessages();
		}
	}
	logPurchases(player: any) {
		var unitHash = {};
		var techs = [];
		var newPurchaseUnits = [];
		this.technologyPurchases = [];
		//		this.gameObj.unitPurchases.forEach(function (pUnit) {
		for (var x = 0; x < this.gameObj.unitPurchases.length; x++) {
			var pUnit = this.gameObj.unitPurchases[x];
			var id = parseInt(pUnit.piece);
			if (id != 52 && (id < 16 || id > 18))
				newPurchaseUnits.push(pUnit);
			if (id === 16)
				this.purchaseTechnology(19, player);
			if (id === 17)
				this.purchaseTechnology(20, player);
			if (id === 18) {
				this.currentPlayer.techPurchasedThisTurn = true;
				var techId = this.purchaseTechnology(0, player);
				var tech = this.superpowersData.techs[techId - 1];
				var i = Math.floor((tech.id - 1) / 3);
				var techpieces = [6, 1, 5, 19, 7, 13];
				this.technologyPurchases.push({ name: tech.name, i: i, piece: techpieces[i], desc: tech.desc });
				techs.push(tech.name);
			}
			if (id == 52) {
				//				removeEMPFromServer();
				//				this.currentPlayer.empPurchaseRd=this.gameObj.round;
				//				createNewUnit(pUnit, true);
			}
			if (unitHash[id])
				unitHash[id]++;
			else
				unitHash[id] = 1;
		}
		//		});
		this.gameObj.unitPurchases = newPurchaseUnits;
		var gUnits = this.superpowersData.units;
		var units = [];
		var k = Object.keys(unitHash);
		k.forEach(function (unitId) {
			var count = unitHash[unitId];
			var piece = gUnits[unitId];
			if (piece.id == 18)
				displayFixedPopup('technologyPopup');
			units.push(count + ' ' + piece.name);
		});
		this.logItem(player, 'Purchases', units.join(', '));
		console.log('!!', this.gameObj.logs);
	}
	logItem(player: any, type: string, message: string, details = '', terrId = 0, nation = 0, ft = '', dr = '', enemy = '') {
		var id = this.gameObj.logId || 0;
		id++;
		this.gameObj.logId = id;
		var bRounds = 0;
		if (details && details.length > 0) {
			var pieces = details.split('|');
			var lid = 1;
			var attackingUnits = this.arrayObjOfLine(pieces[0], lid);
			lid += attackingUnits.length;
			var defendingUnits = this.arrayObjOfLine(pieces[1], lid);
			lid += defendingUnits.length;
			var attackingCas = this.arrayObjOfLine(pieces[2], lid);
			lid += attackingCas.length;
			var defendingCas = this.arrayObjOfLine(pieces[3], lid);
			var medicHealedCount = pieces[4];
			if (details.length > 5)
				bRounds = parseInt(pieces[5]);
		}
		var log = {
			id: id, round: this.gameObj.round, nation: player.nation, type: type, enemy: enemy, message: message,
			attackingUnits: attackingUnits, defendingUnits: defendingUnits, attackingCas: attackingCas, defendingCas: defendingCas,
			medicHealedCount: medicHealedCount, bRounds: bRounds, t: terrId, o: nation, ft: ft, dr: dr
		};
		this.gameObj.logs.push(log);
	}
	arrayObjOfLine(line, id) {
		var finList = [];
		if (line) {
			var units = line.split('+');
			units.forEach(function (unit) {
				finList.push({ id: id, piece: unit });
				id++;
			});
		}
		return finList;
	}
	purchaseTechnology(num: number, player: any) {
		if (player.tech.length == 0)
			player.tech = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
		if (num == 0)
			num = this.getRandomTech(player);
		if (num == 0)
			return;

		player.tech[num - 1] = true;
		this.logItem(player, 'Technology', this.superpowersData.techs[num - 1].name);
		if (num == 17) {
			console.log('Air defense!!!!!');
			this.gameObj.airDefenseTech[player.nation] = true;
			this.refreshPlayerTerritories(player);
		}
		return num;
	}
	refreshPlayerTerritories(player: any) {
		this.gameObj.territories.forEach(function (terr) {
			if (terr.owner == player.nation) {
				refreshTerritory(terr);
			}
		});
	}
	getRandomTech(player) {
		for (var x = 0; x <= 100; x++) {
			var diceRoll = Math.floor((Math.random() * 6) + 1);
			var tech = diceRoll * 3 - 2;
			if (!player.tech[tech - 1])
				return tech;
			tech++;
			if (!player.tech[tech - 1])
				return tech;
			tech++;
			if (!player.tech[tech - 1])
				return tech;
		}
		return 0;
	}

	scrollToNation(nation) {
		scrollToCapital(nation);
	}
	ngClassFlag = function (terr) {
		var flagShadow = ' hoverShadowed';
		if (terr.territoryType == 'Ally' || terr.territoryType == 'Your Empire')
			flagShadow = ' flagAlly';
		if (terr.territoryType == 'Enemy!')
			flagShadow = ' flagEnemy';
		var hover = isMobile() ? '' : flagShadow;
		if (terr.capital && terr.id < 79)
			return "flagCapital" + hover;
		else
			return "flag " + hover;
	}
	ngStyleHalo = function (terr, x, y) {
		return { 'top': (terr.y + y).toString() + 'px', 'left': (terr.x + x).toString() + 'px' }
	}
	ngClassHalo = function (terr) {
		var flagShadow = ' haloNone';
		if (terr.territoryType == 'Ally' || terr.territoryType == 'Your Empire')
			flagShadow = ' haloAlly';
		if (terr.territoryType == 'Enemy!')
			flagShadow = ' haloEnemy';
		if (terr.capital && terr.id < 79)
			return "haloCapital " + flagShadow;
		else
			return "halo " + flagShadow;
	}
	ngStyleNameLabel = function (terr) {
		var offset = 0;
		if (terr.capital && terr.id < 79)
			offset -= 13;
		if (terr.name.length > 8 && (terr.name.includes(' ') || terr.name.includes('-')))
			offset -= 13;
		if (terr.id == 111 || terr.id == 112)
			offset = 57;
		return { 'top': (terr.y + 60 + offset).toString() + 'px', 'left': (terr.x - 22).toString() + 'px' }
	}
	changeSVGColor = function (flg, id, nation) {
		if (window.innerWidth < 500)
			return;
		var n = document.getElementById('name' + id);
		if (n) {
			if (flg)
				n.style.display = 'block';
			else
				n.style.display = 'none';
		}
		var f = document.getElementById('svg' + id);
		if (f) {
			var colors = ['#ffffc0', 'blue', 'gray', '#cc8800', 'red', 'green', 'yellow', 'magenta', 'cyan'];
			var color = colors[numberVal(nation)];
			if (flg) {
				f.style.fill = color;
				f.style.stroke = 'black';
			} else {
				f.style.stroke = 'none';
				f.style.fill = 'transparent';
			}
		}
	}

}
