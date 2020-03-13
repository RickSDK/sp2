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
declare var addIncomeForPlayer: any;
declare var getDamageReport: any;
declare var logItem: any;
declare var cleanUpTerritories: any;
//---spLib.js
declare var scrollToCapital: any;
//---computer.js
declare var purchaseCPUUnits: any;
declare var moveCPUUnits: any;
declare var refreshPlayerTerritories: any;

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
	public spriteObj: any;
	public carrierAddedFlg = false;
	public allowBotToAct = false;
	public adminMode = false;
	public showPanelsFlg = true;
	public hideActionButton = false;
	public warAudio = new Audio('assets/sounds/war1.mp3');
	
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
	startTheAction() {
		this.loadingFlg = false;
		this.showControls = true;
		updateProgressBar(100);
		stopSpinner();
		this.loadCurrentPlayer();
		this.startTheTurn();
	}
	//----------------load board------------------
	logGame() {
		console.log(this.gameObj.unitPurchases);
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
	}
	loadCurrentPlayer() {
		this.currentPlayer = getCurrentPlayer(this.gameObj);
		this.gameObj.currentNation = this.currentPlayer.nation;
		if (!this.currentPlayer.news)
			this.currentPlayer.news = [];
	}
	startTheTurn() {
		console.log('startTheTurn', this.currentPlayer);
		if (!this.currentPlayer.cpu && this.yourPlayer && this.yourPlayer.nation && this.yourPlayer.nation == this.currentPlayer.nation)
			this.checkForMessages();
		else
			this.initializePlayer();
	}
	checkForMessages() {
		if (this.displayHelpMessagesAreClear())
			this.initializePlayer();
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
	playGameButtonPressed() {
		closePopup('advisorPopup');
		console.log('playGameButtonPressed');
		//		this.initializePlayer();
	}
	computerGo() {
		if (this.gameObj.gameOver)
			return;
		this.allowBotToAct = true;
		this.showControls = false;
		console.log('----------->computerGo', this.currentPlayer.nation, this.currentPlayer.status);
		if (this.currentPlayer.status == 'Purchase')
			this.currentPlayer.status = 'Waiting';

			this.computerMove();
//		setTimeout(() => {
//			this.computerStarting();
//		}, 1500);
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
		this.warAudio.play();
		setTimeout(() => {
			this.completingPurchases();
		}, 1500);
	}
	computerAttack() {
		this.currentPlayer.status = 'Move';
		setTimeout(() => {
			this.computerMove();
		}, 1500);

	}
	computerMove() {
		this.warAudio.pause();
		var obj = moveCPUUnits(this.currentPlayer, this.gameObj, this.superpowersData);
		if(obj.t1>0)
			this.moveSpriteBetweenTerrs(obj); 
	
		this.currentPlayer.status = 'Place Units';

		this.showControls=true;//<---delete!!
		refreshPlayerTerritories(this.gameObj, this.currentPlayer, this.superpowersData);

//		setTimeout(() => {
//			this.placeUnitsAndEndTurn();
//		}, 1500);

	}
	initializePlayer() {
		this.allowBotToAct = this.currentPlayer.cpu;
		if (this.currentPlayer.status == 'Waiting' || this.currentPlayer.status == 'Purchase')
			this.initializePlayerForPurchase();
		if (this.currentPlayer.status == 'Attack')
			this.initializePlayerForAttack();
	}
	completingPurchases() {
		this.currentPlayer.status = 'Attack';
		scrubUnitsOfPlayer(this.currentPlayer, this.gameObj, this.superpowersData.units); // in case of tech
		this.logPurchases(this.currentPlayer);
		saveGame(this.gameObj, this.user, this.currentPlayer);
		this.hideActionButton = !this.hideActionButton;
		this.initializePlayerForAttack();
	}
	initializePlayerForAttack() {
		this.gameObj.actionButtonMessage = 'Complete Turn';
		console.log('initializePlayerForAttack');
		//displayHelpPopupMessages();
		if (this.allowBotToAct)
			this.computerGo();
	}
	initializePlayerForPurchase() {
		var player = this.currentPlayer;
		player.carrierAddedFlg = false;
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
		this.gameObj.unitPurchases = [];
		this.gameObj.superBCForm.cost = 0;
		player.allies = []; //<---- figure out allies!!
		player.treatiesAtStart = player.treaties.slice(0);

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

		if (this.adminMode && this.user.userName == 'Rick') {
			this.ableToTakeThisTurn = true; // admin mode only!!!
			this.yourPlayer = this.currentPlayer;
		}
		if (this.gameObj.multiPlayerFlg && !player.cpu) {
			if (this.user.userName == player.userName && this.gameObj.mmFlg)
				player.empCount = 0;
			//		if(userCanSkip(player.nation))
			//			checkEMPAndTimer(player, this.ableToTakeThisTurn);
		}
		var numFactories = cleanUpTerritories(player, player.cpu, this.gameObj); //<------------------ clean territories
		if (player.cpu && player.income <= 5 && this.gameObj.round > 12 && !this.gameObj.multiPlayerFlg) {
			numFactories = 0;
		}
	





		if (player.cpu)
			this.computerGo();

		//	if (this.gameObj.multiPlayerFlg && this.gameObj.turboFlg && !this.ableToTakeThisTurn)
		//		startUpBackgroundViewer();
		/*
		if (this.currentPlayer.status == 'Place Units') {
			showConfirmationPopup('Player is stuck in Place Units phase. Press "OK" to continue the game.', 'forceEndTurn');
		}
		if (player.status == gStatusPurchase && !practiceMode) {
			
			
			
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
		var terr = this.gameObj.territories[unit.terr - 1];
		this.addUnitToTerr(terr, unit.piece, false, true);
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
			refreshTerritory(terr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
		} else {
			terr.unitCount++;
			terr.displayUnitCount = getDisplayUnitCount(terr, this.gameObj.fogOfWar, this.gameObj.hardFog);
		}
		this.annimateUnit(piece, terr);
	}
	moveSpriteBetweenTerrs(obj: any) {
		// {t1: t1, t2: t2, id: id}
		var terr = this.gameObj.territories[obj.t1 - 1];
		var t2 = this.gameObj.territories[obj.t2 - 1];
		this.spriteObj = { top1: terr.y, left1: terr.x, top2: t2.y, left2: t2.x };
		this.spriteInMotionFlg = true;
		this.spritePieceId = obj.id;
		this.playSoundForPiece(obj.id);
		var e = document.getElementById('sprite');
		if (e) {
			e.style.display = 'block';
			e.style.left = (terr.x - 10).toString() + 'px';
			e.style.top = (terr.y + 80).toString() + 'px';
			e.style.height = '30px';
			this.moveSprite(100);
		}
	}
	playSoundForPiece(piece: number) {
		var unit = this.superpowersData.units[piece];
		if (unit.type == 2)
			playSound('fighter.mp3');
		if (unit.type == 3)
			playSound('foghorn.wav');
		if (unit.subType == 'soldier')
			playSound('marching.wav');
		if (unit.subType == 'chopper')
			playSound('chopper.mp3');
		if (unit.subType == 'vehicle')
			playSound('vehicles.mp3');
		if (unit.subType == 'hero')
			playSound('yes.mp3');
		if (unit.subType == 'seal')
			playSound('mp5.mp3');
		if (unit.id == 47 || unit.id == 52)
			playSound('shock.mp3');
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
		}
	}
	placeUnitsAndEndTurn() {
		playClick();
		closePopup('actionPopup');
		closePopup('diplomacyWarningPopup');
		this.gameObj.actionButtonMessage = '';
		this.currentPlayer.status = 'Place Units';
		//		if (this.user.rank <= 2) {
		//			var ipCode = (this.user.rank * 100) + this.gameObj.round;
		//registerIP(ipCode);
		//		}
		var numAddedUnitsToAdd = 0;
		if (!this.carrierAddedFlg) {
			numAddedUnitsToAdd = this.addUnitsToBoard();
			if (!this.allowBotToAct && numAddedUnitsToAdd < 0) {
				this.carrierAddedFlg = true;
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
		//		setTimeout(function() { refreshTerrHash(refreshHash); }, 300+numAddedUnitsToAdd*95);
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
		console.log('end it!', damageReport);
		this.advanceToNextPlayer();
		this.loadCurrentPlayer();
		stopSpinner();
		var sendEmailFlg = (this.gameObj.numPlayers > 3);
		if (this.currentPlayer.cpu || !this.currentPlayer.alive || this.gameObj.turboFlg)
			sendEmailFlg = false;

		console.log('endTurn', sendEmailFlg);
		var secondsLeft = 0;
		saveGame(this.gameObj, this.user, this.currentPlayer, sendEmailFlg, true, prevPlayer, this.currentPlayer.cpu, secondsLeft);
		this.startTheTurn();
		//		saveGame(this.gameObj, this.user, this.currentPlayer);
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
