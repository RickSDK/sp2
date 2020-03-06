import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { analyzeAndValidateNgModules } from '@angular/compiler';

declare var loadSVGs: any;
declare var getGameTerritories: any;
declare var populateUnits: any;
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
declare var displayLeaderInfo: any;
declare var unitsForTerr: any;
declare var playersPanelMoved: any;
declare var saveGame: any;
declare var scrubGameObj: any;
declare var getYourPlayer: any;
declare var scrollToCapital: any;
declare var militaryAdvisorPopup: any;
declare var closePopup: any;
declare var getCurrentPlayer: any;

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
	//public currentPlayer = { userName: 'Bob', money: 30, status: 'purchase', nation: 1 };
	public yourPlayer = { userName: 'Rick', nation: 3 };
	public ableToTakeThisTurn = true;
	public uploadMultiplayerFlg = false;
	public progress = 0;
	public isMobileFlg = true;

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
		console.log('yourPlayer', this.currentPlayer);
		this.currentPlayer.news = [];

		updateProgressBar(100);
		stopSpinner();
		this.displayHelpMessages();
	}
	//----------------load board------------------
	displayHelpMessages() {
		scrollToCapital(this.yourPlayer.nation);
		militaryAdvisorPopup('New Game! You are starting as ' + this.superpowersData.superpowers[this.yourPlayer.nation] + '. See the countries displayed on the side, to see what CPU players you will be up against.', 20);
		//sidelinePopup
	}
	playGameButtonPressed() {
		console.log('clicked');
		closePopup('advisorPopup');
		this.initializePlayer(this.currentPlayer);
	}
	initializePlayer(player) {
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
		if (this.gameObj.gameOver) {
			console.log('game over!!');
			return;
		}
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
			resetPlayerUnits(player); //<------------------------------------------------- clean player units
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
	terrClicked(popup: any, terr: any) {
		displayLeaderInfo(terr, this.currentPlayer, this.yourPlayer);
		terr.units = unitsForTerr(terr, this.gameObj.units);
		popup.show(terr, this.currentPlayer, this.gameObj);
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
