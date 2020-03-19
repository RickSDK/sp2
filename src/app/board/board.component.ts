import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { DiplomacyPopupComponent } from '../diplomacy-popup/diplomacy-popup.component';

declare var $: any;

declare var loadSVGs: any;
declare var refreshBoard: any;
declare var refreshTerritory: any;
declare var isMobile: any;
declare var numberVal: any;
declare var hideArrow: any;
declare var startSpinner: any;
declare var updateProgressBar: any;
declare var stopSpinner: any;
declare var getHostname: any;
declare var userObjFromUser: any;
declare var createNewGameSimple: any;
declare var loadSinglePlayerGame: any;
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
declare var addIncomeForPlayer: any;
declare var getDamageReport: any;
declare var logItem: any;
declare var cleanUpTerritories: any;
declare var removeAlliancesForNation: any;
declare var alliesFromTreaties: any;
declare var whiteoutScreen: any;
//---spLib.js
declare var scrollToCapital: any;
//---computer.js
declare var purchaseCPUUnits: any;
declare var moveCPUUnits: any;
declare var refreshPlayerTerritories: any;
declare var findPrimaryTarget: any;
declare var findSecondaryTarget: any;
declare var findFortification: any;
declare var attemptToAttack: any;
declare var findGoodTargetForTerr: any;
declare var stageAttackBetweenTerritories: any;
declare var fortifyThisTerritory: any;
declare var findMainBaseTarget: any;
declare var findAmphibiousAttacks: any;
declare var respositionMainBase: any;
declare var recallBoats: any;
declare var doCpuDiplomacyRespond: any;
declare var doCpuDiplomacyOffer: any;
declare var declareWarIfNeeded: any;
declare var landDistFromTerr: any;
declare var isUnitOkToMove: any;
declare var findMainBase: any;
declare var allUnitsAttack: any;

//---combat.js
declare var playSoundForPiece: any;
declare var initializeBattle: any;
declare var startBattle: any;
declare var removeCasualties: any;
declare var rollAttackDice: any;
declare var rollDefenderDice: any;

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss']
})
export class BoardComponent extends BaseComponent implements OnInit {
	@ViewChild(DiplomacyPopupComponent) diplomacyModal: DiplomacyPopupComponent;
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
	public spriteObj: any;
	public carrierAddedFlg = false;
	public allowBotToAct = false;
	public adminMode = false;
	public showPanelsFlg = true;
	public hideActionButton = false;
	public displayBattle: any;
	public warAudio = new Audio('assets/sounds/war1.mp3');
	public haltActionFlg = false;
	public haltPurchaseFlg = false;
	public nukeFrameNum = 1;

	constructor() { super(); }

	ngOnInit(): void {
		this.hostname = getHostname();
		this.user = userObjFromUser();
		this.user.rank = 1;
		this.svgs = loadSVGs();
		this.initBoard();
		this.warAudio.loop = true;
	}
	//----------------load board------------------
	initBoard() {
		startSpinner('Loading Game', '100px');
		updateProgressBar(20);
		var loadGameId = numberVal(localStorage.loadGameId);
		var currentGameId = numberVal(localStorage.currentGameId);
		if (loadGameId > 0) {
			console.log('+++ multiplayer....', localStorage.loadGameId);
		} else {
			if ((currentGameId > 0)) {
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
				showAlertPopup('hi' + startingNation);
				this.gameObj = createNewGameSimple(type, numPlayers, name, startingNation, pObj);
				//								this.gameObj = createNewGame(id, type, numPlayers, name, attack, this.gUnits, startingNation, localStorage.fogOfWar, this.user.rank, localStorage.customGame, pObj, localStorage.hardFog);
				//				this.gameObj.difficultyNum = localStorage.difficultyNum || 1;
				showAlertPopup('gameObj' + this.gameObj.id + this.gameObj.name);
				//				saveGame(this.gameObj, this.user, this.currentPlayer);
				//				localStorage.currentGameId = this.gameObj.id;
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
				refreshTerritory(terr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
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
	//----------------load board------------------


	//----------------start turn------------------
	startTheAction() {
		this.loadingFlg = false;
		updateProgressBar(100);
		stopSpinner();
		this.loadCurrentPlayer();
	}
	loadCurrentPlayer() {
		//-------------------- test
		//	this.gameObj.turnId = 3; //<--- test
		this.haltActionFlg = false;
		this.haltPurchaseFlg = false;
		//--------------------end test
		this.currentPlayer = getCurrentPlayer(this.gameObj);
		this.gameObj.currentNation = this.currentPlayer.nation;
		this.gameObj.actionButtonMessage = '';
		this.allowBotToAct = this.currentPlayer.cpu;

		console.log('=======================' + this.superpowersData.superpowers[this.currentPlayer.nation] + '==============');
		if (!this.currentPlayer.news)
			this.currentPlayer.news = [];
		if (!this.currentPlayer.botRequests)
			this.currentPlayer.botRequests = [];
		if (!this.currentPlayer.offers)
			this.currentPlayer.offers = [];
		this.findTargets();

		this.currentPlayer.allies = alliesFromTreaties(this.currentPlayer);
		this.currentPlayer.treatiesAtStart = this.currentPlayer.treaties.slice(0);
		this.currentPlayer.allySpotsOpen = this.gameObj.maxAllies - this.currentPlayer.allies.length;

		if (this.gameObj.gameOver) {
			console.log('game over!!');
			return;
		}
		if (this.gameObj.multiPlayerFlg && this.yourPlayer && this.yourPlayer.nation > 0) {
			this.ableToTakeThisTurn = (this.user.userName == this.currentPlayer.userName);
		} else
			this.ableToTakeThisTurn = (this.gameObj.viewingNation == this.currentPlayer.nation && !this.currentPlayer.cpu);
		if (!this.gameObj.multiPlayerFlg)
			this.ableToTakeThisTurn = !this.currentPlayer.cpu;

		if (this.adminMode && this.user.userName == 'Rick') {
			this.ableToTakeThisTurn = true; // admin mode only!!!
			this.yourPlayer = this.currentPlayer;
		}
		if (this.gameObj.multiPlayerFlg && !this.currentPlayer.cpu) {
			if (this.user.userName == this.currentPlayer.userName && this.gameObj.mmFlg)
				this.currentPlayer.empCount = 0;
			//		if(userCanSkip(player.nation))
			//			checkEMPAndTimer(player, this.ableToTakeThisTurn);
		}
		//	if (this.gameObj.multiPlayerFlg && this.gameObj.turboFlg && !this.ableToTakeThisTurn)
		//		startUpBackgroundViewer();

		if (this.ableToTakeThisTurn)
			this.checkForMessages();
		else
			this.initializePlayer();
	}
	findTargets() {
		var allyRequests = [];
		this.currentPlayer.hotSpotId = 0;
		this.currentPlayer.primaryTargetId = 0;
		this.currentPlayer.secondaryTargetId = 0;
		this.gameObj.territories.forEach(terr => {
			if (terr.requestedTarget == this.currentPlayer.nation) {
				this.currentPlayer.primaryTargetId = terr.id;
				terr.requestedTarget = 0;
				allyRequests.push({ type: 1, terr: terr.id });
			}
			if (terr.requestedHotSpot == this.currentPlayer.nation) {
				this.currentPlayer.hotSpotId = terr.id;
				terr.requestedHotSpot = 0;
				allyRequests.push({ type: 2, terr: terr.id });
			}
		});
		this.currentPlayer.allyRequests = allyRequests;
		if (this.currentPlayer.primaryTargetId == 0)
			this.currentPlayer.primaryTargetId = findPrimaryTarget(this.gameObj, this.currentPlayer);
		this.currentPlayer.secondaryTargetId = findSecondaryTarget(this.gameObj, this.currentPlayer);
		if (this.currentPlayer.hotSpotId == 0)
			this.currentPlayer.hotSpotId = findFortification(this.gameObj, this.currentPlayer);
		this.currentPlayer.mainTargetId = (this.currentPlayer.primaryTargetId > 0) ? this.currentPlayer.primaryTargetId : this.currentPlayer.secondaryTargetId;
		if (this.currentPlayer.mainBaseID == 0)
			this.currentPlayer.mainBaseID = findMainBase(this.gameObj, this.currentPlayer);
	}
	checkForMessages() {
		this.displayHelpMessagesAreClear();
	}
	playGameButtonPressed() {
		closePopup('advisorPopup');
		console.log('playGameButtonPressed');
		this.initializePlayer();
	}
	initializePlayer() {
		this.showControls = !this.currentPlayer.cpu;
		if (this.currentPlayer.status == 'Waiting' || this.currentPlayer.status == 'Purchase')
			this.initializePlayerForPurchase();
		if (this.currentPlayer.status == 'Attack')
			this.initializePlayerForAttack();
	}
	initializePlayerForPurchase() {
		//human & cpu
		this.gameObj.actionButtonMessage = 'Complete Purchase';
		var player = this.currentPlayer;
		this.hideActionButton = false;
		player.carrierAddedFlg = false;
		player.diplomacyFlg = false;
		player.diplomacyWarningFlg = false;
		player.generalIsCargo = false;
		player.status = 'Purchase';
		player.techsBoughtThisTurn = 0;
		player.techPurchasedThisTurn = false;
		this.gameObj.unitPurchases = [];
		this.gameObj.superBCForm.cost = 0;

		resetPlayerUnits(player, this.gameObj); //<------------------------------------------------- clean player units
		var numFactories = cleanUpTerritories(player, player.cpu, this.gameObj); //<------------------ clean territories
		if (player.cpu && player.income <= 5 && this.gameObj.round > 12 && !this.gameObj.multiPlayerFlg) {
			numFactories = 0;
		}
		if (numFactories == 0 && this.gameObj.round > 6) {
			logItem(this.gameObj, this.currentPlayer, 'Eliminated', this.superpowersData.superpowers[player.nation] + ' eliminated.');
			var voiceId = numberVal(player.nation) + 60;
			playVoiceSound(voiceId);
			showAlertPopup(this.superpowersData.superpowers[player.nation] + ' surrendered!', 1)
			player.alive = false;
			player.status = 'Place Units';
			removeAlliancesForNation(player.nation, this.gameObj);
			this.placeUnitsAndEndTurn();
			return;
		}
		this.checkTreatyOffers(player);
		scrollToCapital(this.currentPlayer.nation);

		if (player.cpu)
			this.computerGo();

	}
	initializePlayerForAttack() {
		this.gameObj.actionButtonMessage = 'Complete Turn';
		if (this.allowBotToAct)
			this.computerGo();
	}
	displayHelpMessagesAreClear() {
		//		scrollToCapital(this.yourPlayer.nation);
		if (this.gameObj.round == 1 && this.currentPlayer.placedInf < 3) {
			militaryAdvisorPopup('New Game! You are starting as ' + this.superpowersData.superpowers[this.yourPlayer.nation] + '. First place 3 infantry by clicking on your territories.', 21); //23
			return false;
		}
		if (this.currentPlayer.status == 'Attack')
			militaryAdvisorPopup('Conduct attacks, then press "Complete Turn" button at the top to end your turn.');
		else
			militaryAdvisorPopup('Purchase units and then press "Purchase Complete".');
		return true;
	}
	computerGo() {
		if (this.gameObj.gameOver)
			return;
		this.allowBotToAct = true;
		this.showControls = false;
		cleanUpTerritories(this.currentPlayer, this.currentPlayer.cpu, this.gameObj);
		if (this.currentPlayer.status == 'Purchase')
			this.currentPlayer.status = 'Waiting';

		setTimeout(() => {
			this.computerStarting();
		}, 1500);
	}
	computerStarting() {
		if (this.currentPlayer.status == 'Waiting') {
			this.computerPurchase();
		} else {
			this.computerAttack();
		}
	}
	computerPurchase() {
		purchaseCPUUnits(this.currentPlayer, this.gameObj, this.superpowersData);
		this.currentPlayer.status = 'Purchase';

		if (this.haltPurchaseFlg) {
			this.showControls = true;
			showAlertPopup('purchases done! action halted.');
		} else {
			this.warAudio.play();
			setTimeout(() => {
				this.completingPurchases();
			}, 1500);
		}
	}
	computerAttack() {
		declareWarIfNeeded(this.gameObj, this.currentPlayer, this.superpowersData);

		if (this.currentPlayer.primaryTargetId > 0)
			this.allUnitsAttack(this.currentPlayer.primaryTargetId);
		//this.attemptToAttack(this.currentPlayer.primaryTargetId);

		if (this.gameObj.round != 6) {
			var obj = findAmphibiousAttacks(this.gameObj, this.currentPlayer);
			if (obj) {
				this.doThisBattle(obj);
				if (obj && obj.ampFlg) {
					this.doThisBattle({ attackUnits: obj.ampAttUnits, defUnits: obj.ampDefUnits, t1: obj.ampAttTerr.id, t2: obj.ampDefTerr.id, id: 2, terr: obj.ampDefTerr, attTerr: obj.ampAttTerr });
				}
				refreshTerritory(obj.ampAttTerr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
				refreshTerritory(obj.ampDefTerr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
			}
		}
		if (this.currentPlayer.primaryTargetId != this.currentPlayer.mainBaseID) {
			var obj = findMainBaseTarget(this.gameObj, this.currentPlayer);
			this.doThisBattle(obj);
		}
		if (this.currentPlayer.secondaryTargetId > 0)
			this.attemptToAttack(this.currentPlayer.secondaryTargetId);

		this.attackFromAllTerritories();

		this.advanceMainBase();

		if (this.haltActionFlg) {
			this.showControls = true;//<---testing only!!
			showAlertPopup('action halted!', 1);
			this.warAudio.pause();
		} else {
			this.currentPlayer.status = 'Move';
			setTimeout(() => {
				this.computerMove();
			}, 1500);
		}
	}
	advanceMainBase() {
		var base = this.gameObj.territories[this.currentPlayer.mainBaseID - 1];
		if (base.attackedRound == this.gameObj.round)
			return;
		var target = this.gameObj.territories[this.currentPlayer.mainTargetId - 1];
		var dist = landDistFromTerr(this.currentPlayer.mainBaseID, target.id, 0, this.gameObj);
		var closerTerr;
		base.land.forEach(terrId => {
			var terr = this.gameObj.territories[terrId - 1];
			if (terr.owner == this.currentPlayer.nation) {
				var d = landDistFromTerr(terr.id, target.id, 0, this.gameObj);
				if (d < dist) {
					d = dist;
					closerTerr = terr;
				}
			}
		});
		if (closerTerr)
			this.moveUnitsFromTerrToTerr(base, closerTerr, this.currentPlayer.nation);
	}
	moveUnitsFromTerrToTerr(terr1, terr2, nation) {
		var piece = 2;
		terr1.units.forEach(function (unit) {
			if (isUnitOkToMove(unit, nation)) {
				unit.terr = terr2.id;
				unit.movesLeft = 0;
				piece = unit.piece;
			}
		});
		this.moveSpriteFromTerrToTerr(terr1, terr2, piece);
	}
	attackFromAllTerritories() {
		var logging = false;
		for (var x = 0; x < this.currentPlayer.territories.length; x++) {
			var terr1 = this.currentPlayer.territories[x];
			var terr2 = findGoodTargetForTerr(terr1, this.currentPlayer, this.gameObj, logging);
			if (terr2) {
				var obj = stageAttackBetweenTerritories(terr1, terr2, this.currentPlayer, terr2.defStrength + 10);
				if (logging)
					console.log(terr1.name, terr2.name, obj);
				this.doThisBattle(obj);
			} else if (logging)
				console.log('no target for ' + terr1.name);
		}
	}
	allUnitsAttack(id: number) {
		var obj = allUnitsAttack(id, this.currentPlayer, this.gameObj);
		this.doThisBattle(obj);
	}
	attemptToAttack(id: number) {
		var obj = attemptToAttack(id, this.currentPlayer, this.gameObj);
		console.log('attemptToAttack', id, obj);
		this.doThisBattle(obj);
	}
	doThisBattle(obj: any) {
		if (obj && obj.attackUnits && obj.attackUnits.length > 0) {
			this.moveSpriteBetweenTerrs(obj);
			this.displayBattle = initializeBattle(this.currentPlayer, obj.terr, obj.attackUnits, this.gameObj);
			startBattle(obj.terr, this.currentPlayer, this.gameObj, this.superpowersData);
			this.computerBattleRound(obj);
		}
	}
	computerBattleRound(obj: any) {
		removeCasualties(this.displayBattle, this.gameObj, this.currentPlayer, false, this.superpowersData);
		this.displayBattle.round++;
		rollAttackDice(this.displayBattle);
		rollDefenderDice(this.displayBattle, obj.terr, this.currentPlayer, [obj.attTerr], this.gameObj, this.superpowersData);
		if (this.displayBattle.militaryObj.battleInProgress)
			this.computerBattleRound(obj);
	}
	computerMove() {
		this.warAudio.pause();

		recallBoats(this.gameObj, this.currentPlayer);

		if (this.currentPlayer.hotSpotId > 0)
			fortifyThisTerritory(this.currentPlayer, this.gameObj);

		var obj = moveCPUUnits(this.currentPlayer, this.gameObj, this.superpowersData);
		if (obj.t1 > 0)
			this.moveSpriteBetweenTerrs(obj);

		//		respositionMainBase(this.currentPlayer, this.gameObj);


		refreshPlayerTerritories(this.gameObj, this.currentPlayer, this.superpowersData);

		if (this.currentPlayer.cpu)
			doCpuDiplomacyOffer(this.currentPlayer, this.gameObj, this.superpowersData);
		if (this.haltActionFlg) {
			this.showControls = true;
			showAlertPopup('attacks & moves done!');
		} else {
			this.currentPlayer.status = 'Place Units';
			setTimeout(() => {
				this.placeUnitsAndEndTurn();
			}, 1500);
		}

	}
	completingPurchases() {
		this.currentPlayer.status = 'Attack';
		scrubUnitsOfPlayer(this.currentPlayer, this.gameObj, this.superpowersData.units); // in case of tech
		this.logPurchases(this.currentPlayer);
		saveGame(this.gameObj, this.user, this.currentPlayer);
		this.hideActionButton = !this.hideActionButton;
		this.initializePlayerForAttack();
	}
	diplomacyDone(msg: string) {
		if (this.currentPlayer.offers.length == 0)
			this.gameObj.actionButtonMessage = 'Purchase Complete';
		scrollToCapital(this.currentPlayer.nation);
	}
	checkTreatyOffers(player) {
		if (this.ableToTakeThisTurn && (player.offers.length > 0 || player.news.length > 0 || player.botRequests.length > 0)) {
			this.gameObj.actionButtonMessage = 'Diplomacy';
			this.diplomacyModal.show(this.gameObj, this.ableToTakeThisTurn, this.currentPlayer, this.yourPlayer);
		}
		if (player.cpu)
			doCpuDiplomacyRespond(player, this.gameObj, this.superpowersData);
	}
	terrClicked(popup: any, terr: any, gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any) {
		if (!this.showControls) {
			showAlertPopup('Game Busy. Please wait...', 1);
			return;
		}
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

		refreshTerritory(terr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
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
	createNewPurchaseUnit() {
		var unit = this.getNextUnit();
		if (unit && unit.terr && unit.terr > 0) {
			var terr = this.gameObj.territories[unit.terr - 1];
			this.addUnitToTerr(terr, unit.piece, false, true);
		} else
			console.log('whoa! no unit!!');
	}
	getNextUnit() {
		for (var x = 0; x < this.gameObj.unitPurchases.length; x++) {
			var unit = this.gameObj.unitPurchases[x];
			if (!unit.placeFlg) {
				unit.placeFlg = true;
				return unit;
			}
		}
		return null;
	}
	addUnitToTerr(terr: any, piece: number, allowMovesFlg: boolean, refreshFlg: boolean) {
		if (piece == 52)
			allowMovesFlg = true;
		var nation = terr.owner;
		var newId = this.gameObj.unitId;
		this.gameObj.unitId++;
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
		if (piece == 15 || piece == 19) {
			terr.factoryCount++;
		}
		if (refreshFlg) {
			refreshTerritory(terr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
		} else {
			terr.unitCount++;
			terr.displayUnitCount = getDisplayUnitCount(terr, this.gameObj.fogOfWar, this.gameObj.hardFog);
		}
		this.annimateUnit(piece, terr);
	}
	battleHappened(msg: string) {
		//emitted from terr-popup
		if (this.hideActionButton)
			this.hideActionButton = false;
	}
	moveSpriteFromTerrToTerr(terr1: any, terr2: any, piece: number) {
		this.moveSpriteBetweenTerrs({ t1: terr1.id, t2: terr2.id, id: piece });
		refreshTerritory(terr1, this.gameObj, this.currentPlayer, this.superpowersData, this.currentPlayer);
		setTimeout(() => {
			refreshTerritory(terr2, this.gameObj, this.currentPlayer, this.superpowersData, this.currentPlayer);
		}, 1000);
	}
	moveSpriteBetweenTerrs(obj: any) {
		// {t1: t1, t2: t2, id: id}
		var terr = this.gameObj.territories[obj.t1 - 1];
		var t2 = this.gameObj.territories[obj.t2 - 1];
		this.spriteObj = { top1: terr.y, left1: terr.x, top2: t2.y, left2: t2.x };
		this.spriteInMotionFlg = true;
		this.spritePieceId = obj.id;
		playSoundForPiece(obj.id, this.superpowersData);
		var e = document.getElementById('sprite');
		if (e) {
			e.style.display = 'block';
			e.style.left = (terr.x - 10).toString() + 'px';
			e.style.top = (terr.y + 80).toString() + 'px';
			e.style.height = '30px';
			this.moveSprite(100);
		}
		if (obj.nukeFlg) {
			setTimeout(() => {
				whiteoutScreen();
				playSound('bomb4.mp3');	
				this.positionNuke(t2);			
			}, 1200);
		}

	}
	positionNuke(t2) {
		this.nukeFrameNum = 1;
		var e = document.getElementById('nukeSprite');
		if (e) {
			e.style.height = '200px';
			e.style.left = (t2.x - 80).toString() + 'px';
			e.style.top = (t2.y + 10).toString() + 'px';
		}
		this.annimateNuke(1);
	}
	annimateNuke(num:number) {
		if(num>18) {
			var e = document.getElementById('nukeSprite');
			if (e) {
				e.style.left = '-200px';
			}
			return;
		}
		this.nukeFrameNum = num;
		setTimeout(() => {
			this.annimateNuke(num+1);
		}, 200);
	}
	moveSprite(amount: number) {
		amount -= 1;
		var range = this.spriteObj.left1 - this.spriteObj.left2;
		var left = this.spriteObj.left2 + range * amount / 100;

		var range2 = this.spriteObj.top1 - this.spriteObj.top2;
		var top = this.spriteObj.top2 + range2 * amount / 100;

		var e = document.getElementById('sprite');
		if (e) {
			e.style.left = (left - 10).toString() + 'px';
			e.style.top = (top + 80).toString() + 'px';
			if (amount <= 0) {
				this.spriteInMotionFlg = false;
				e.style.display = 'none';
			} else {
				setTimeout(() => {
					this.moveSprite(amount);
				}, 10);
			}
		}
	}
	annimateUnit(piece: number, terr: any) {
		playSound('Swoosh.mp3', 0, false);
		if (this.spriteInMotionFlg) {
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

	redoPurchase() {
		playClick();
		this.currentPlayer.status = 'Purchase'
		this.gameObj.actionButtonMessage = 'Complete Purchase';
		this.hideActionButton = !this.hideActionButton;
		this.logItem(this.currentPlayer, 'Redoing Purchases', 'Redo');
	}
	completeTurnButtonPressed() {
		if (this.currentPlayer.offers.length > 0) {
			this.diplomacyModal.show(this.gameObj, this.ableToTakeThisTurn, this.currentPlayer, this.yourPlayer);
			return;
		}
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
			this.completingPurchases()
		} else if (this.currentPlayer.status == 'Attack') {
			displayFixedPopup('diplomacyWarningPopup');
		} else if (this.currentPlayer.status == 'Place Units')
			this.placeUnitsAndEndTurn();
	}
	placeUnitsAndEndTurn() {
		playClick();
		closePopup('actionPopup');
		closePopup('diplomacyWarningPopup');
		this.gameObj.actionButtonMessage = '';
		this.currentPlayer.status = 'Place Units';
		var numAddedUnitsToAdd = 0;
		if (!this.carrierAddedFlg) {
			numAddedUnitsToAdd = this.addUnitsToBoard();
			if (!this.allowBotToAct && numAddedUnitsToAdd < 0) {
				this.carrierAddedFlg = true;
				this.gameObj.actionButtonMessage = 'Complete Turn';
				if (numAddedUnitsToAdd == -2) {
					showAlertPopup('Fighters added to water territory. Click on the newly placed units to load them onto carriers.', 1);
				} else
					showAlertPopup('New Carrier or Battleship placed. You can load units onto it or press "Complete Turn".', 1);
				return;
			}
		}
		this.showControls = false;

		//		if($scope.gameObj.multiPlayerFlg)
		//			$scope.uploadMultiplayerStats($scope.currentPlayer.nation);
		//		else
		startSpinner('Saving...', '150px');
		updateProgressBar(30);
		setTimeout(() => {
			this.endTurn();
		}, 1500 + numAddedUnitsToAdd * 100);
	}
	addUnitsToBoard() {
		var numAddedUnitsToAdd = 0;
		var carrierFlg = false;
		var fighterWaterFlg = false;
		var refreshHash = {};
		for (var x = 0; x < this.gameObj.unitPurchases.length; x++) {
			var unit = this.gameObj.unitPurchases[x];
			refreshHash[unit.terr] = 1;
			numAddedUnitsToAdd++;
			if (unit.piece == 8 || unit.piece == 9 || unit.piece == 12)
				carrierFlg = true;
			if (unit.piece == 6 && unit.terr >= 79)
				fighterWaterFlg = true;

			setTimeout(() => {
				this.createNewPurchaseUnit();
			}, numAddedUnitsToAdd * 95);
		}
		if (carrierFlg)
			numAddedUnitsToAdd = -1;
		if (fighterWaterFlg)
			numAddedUnitsToAdd = -2;
		return numAddedUnitsToAdd;
	}
	endTurn() {
		var prevPlayer = this.currentPlayer;
		updateProgressBar(100);
		addIncomeForPlayer(this.currentPlayer, this.gameObj);
		this.currentPlayer.money += this.currentPlayer.income;
		playSound('clink.wav');
		this.currentPlayer.news = [];
		this.currentPlayer.botRequests = [];
		this.currentPlayer.requestedHotSpot = 0;
		this.currentPlayer.requestedTarget = 0;
		var damageReport = getDamageReport(this.currentPlayer, this.gameObj, this.superpowersData);
		this.currentPlayer.status = 'Waiting';
		logItem(this.gameObj, this.currentPlayer, 'Turn Completed', this.currentPlayer.income + ' Coins Collected.', '', '', '', '', damageReport);
		this.advanceToNextPlayer();
		//		
		stopSpinner();
		var sendEmailFlg = (this.gameObj.numPlayers > 3);
		if (this.currentPlayer.cpu || !this.currentPlayer.alive || this.gameObj.turboFlg)
			sendEmailFlg = false;

		console.log('endTurn', sendEmailFlg);
		var secondsLeft = 0;
		saveGame(this.gameObj, this.user, this.currentPlayer, sendEmailFlg, true, prevPlayer, this.currentPlayer.cpu, secondsLeft);
		//		this.startTheTurn();
		//		saveGame(this.gameObj, this.user, this.currentPlayer);
	}
	advanceToNextPlayer() {
		var alivePlayers = [];
		for (var x = 0; x < this.gameObj.players.length; x++) {
			var player = this.gameObj.players[x];
			if (player.alive)
				alivePlayers.push(player);
		}
		if (alivePlayers.length == 0) {
			this.gameObj.gameOver = true;
			showAlertPopup('game has ended!', 1);
			return;
		}
		var firstPlayer = alivePlayers[0];
		var nextPlayer = null;
		var found = false;
		for (var x = 0; x < alivePlayers.length; x++) {
			var player = alivePlayers[x];
			if (!nextPlayer) {
				if (found) {
					nextPlayer = player;
				} else {
					if (player.nation == this.currentPlayer.nation)
						found = true;
				}
			}
		}
		if (!nextPlayer) {
			this.gameObj.round++;
			nextPlayer = firstPlayer;
		}
		this.gameObj.turnId = nextPlayer.id;
		this.loadCurrentPlayer();
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
				//				refreshTerritory(terr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
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
