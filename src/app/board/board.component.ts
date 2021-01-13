import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { analyzeAndValidateNgModules, ThrowStmt } from '@angular/compiler';
import { DiplomacyPopupComponent } from '../diplomacy-popup/diplomacy-popup.component';
import { Router, ActivatedRoute } from '@angular/router';

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
declare var treatyStatus: any;
declare var shakeScreen: any;
declare var clearCurrentGameId: any;
declare var playVoiceClip: any;
declare var playIntroSequence: any;
declare var highlightTerritoryWithArrow: any;
declare var timerFromSeconds: any;
declare var okToAttack: any;
declare var promoteSuperpowersUser: any;
declare var isUnitFighterUnit: any;
declare var findTransportForThisCargo: any;
declare var computerAnnouncement: any;
declare var moveTheseUnitsToThisTerritory: any;
declare var isMusicOn: any;
declare var getDateFromString: any;
declare var fixSeaCargo: any;
declare var saveUserObj: any;
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
declare var positionPurchasePanel: any;
declare var transferControlOfTerr: any;
declare var checkVictoryConditions: any;
declare var getMilitaryReportObj: any;
declare var declareWarOnNation: any;
declare var refreshAllTerritories: any;
declare var getMaxAllies: any;
declare var illuminateTerritories: any;
declare var numberHumanAllies: any;
declare var highlightElementWithArrow: any;
//---spLib.js
declare var scrollToCapital: any;
declare var popupBattleReport: any;
declare var lastLoginFromSeconds: any;
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
declare var isAtWarWith: any;
declare var addTestScore: any;
declare var checkIlluminateFlg: any;
declare var refreshAllPlayerTerritories: any;
declare var highlightCompleteTurnButton: any;

//---combat.js
declare var playSoundForPiece: any;
declare var initializeBattle: any;
declare var startBattle: any;
declare var removeCasualties: any;
declare var rollAttackDice: any;
declare var rollDefenderDice: any;
declare var landTheNukeBattle: any;
declare var maximumPossibleNukeHitsForTerr: any;
declare var addAAGunesToBattle: any;
declare var isUnitCruiseUnit: any;
declare var landTheCruiseBattle: any;
declare var strategicBombBattle: any;
declare var loadMultiPlayerGame: any;
declare var spVersion: any;

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent extends BaseComponent implements OnInit {
	@ViewChild(DiplomacyPopupComponent) diplomacyModal: DiplomacyPopupComponent;
	public svgs = [];
	public hostname: string;
	public user: any;
	public adminFixFlg = false;
	public loadingFlg = false;
	public showControls = false;
	public historyMode = false;
	public historyRound = 1;
	public gameObj: any;
	public gameId: number;
	public currentPlayer: any;
	public yourPlayer: any;
	public yourNation = 0;
	public ableToTakeThisTurn = true;
	public uploadMultiplayerFlg = false;
	public progress = 0;
	public btPopupMessage: string = '';
	public isMobileFlg = true; // < 1200px
	public isDesktopFlg = false; // > 600px
	public hiSpeedFlg = true;
	public spriteInMotionFlg = false;
	public hidePlayersPanelFlag = false;
	public spritePieceId = 2;
	public fightersStrandedFlg = false;
	public showAllianceMessageFlg = false;
	public spriteShipId = 4;
	public currentPlayerNation = 1;
	public technologyPurchases = [];
	//	public spriteObj: any;
	public carrierAddedFlg = false;
	public adminModeFlg = false;
	public showPanelsFlg = true;
	public hideActionButton = false;
	public displayBattle: any;
	public warAudio = new Audio('assets/sounds/war1.mp3');
	public gameMusic = new Audio('assets/music/menu.mp3');
	public endGameMusic = new Audio('assets/music/introAudio.mp3');
	public haltPurchaseFlg = false;
	public haltCombatActionFlg = false;
	public haltActionFlg = false;
	public newPlayerHelpText = 'Press Start Button';
	public nukeFrameNum = 1;
	public forcedClickNation = 0;
	public spVersion = spVersion();
	public bonusInfantryFlg = false;
	public bonusFactoryFlg = false;
	public showSkipPlayerButtonFlg = false;
	public showAccountSitButtonFlg = false;
	public refreshTerritoryHash: any;
	public purchaseIndex = 0;
	public selectedTerritory: any;
	public strandedAAGuns = [];
	public battleObj: any;
	public adsbygoogle: any;
	public battleReport = { flag: 'flag2.gif', type: 'Battle', icon: 'fa-crosshairs', attNation: 2, defNation: 3, attCasualties: 1, defCasualties: 4, wonFlg: false, result: 'Lost!', terrX: 0, terrY: 0, cruiseFlg: false };
	public advisorFirst6RoundsMessage = [
		'Round 1. Click on your capital to purchase new units.',
		'Round 2. Buying economic centers will help our income grow.',
		'Round 3. Building new factories on your front lines will help get troops where you need them.',
		'Round 4. Taking over enemy capitals will boost your income by 10 coins.',
		'Round 5. Last round of peace. Make sure your defenses are in place.',
		'Round 6. Players can now attack other players! This is the limited attack round, meaning you can take at most one other player\'s territory and lose at most one territory.',
	];

	constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef, private router: Router, private route: ActivatedRoute) {
		super();
		this.route.queryParams
			.subscribe(params => {
				this.gameId = params.id;
			});

	}

	ngOnInit(): void {
		this.hostname = getHostname();
		this.user = userObjFromUser();
		this.svgs = loadSVGs();

		this.warAudio.loop = false;
		this.warAudio.preload = 'auto';
		this.gameMusic.loop = false;
		this.gameMusic.preload = 'auto';
		this.endGameMusic.loop = false;
		this.endGameMusic.preload = 'auto';

		this.gameObj = { territories: [] };
		//this.cdr.detach();

		this.initBoard();

		setTimeout(() => {
			(this.adsbygoogle = (window as any).adsbygoogle || []).push({});
		}, 3000);
	}
	//----------------load board------------------
	ngStylePositionSvg(svg: any) {
		return { left: svg.left, top: svg.top }
	}
	initBoard() {
		this.gameMusic.loop = true;
		this.gameMusic.volume = 0.5;
		var currentGameId = numberVal(localStorage.currentGameId);
		this.loadingFlg = true;
		startSpinner('Loading Game', '100px');
		updateProgressBar(20);
		if (this.gameId > 0) {
			this.getMultiplayerGameObjFromServer();
		} else {
			if ((currentGameId > 0)) {
				//load game
				console.log('+++ load single player....', localStorage.currentGameId);
				this.gameObj = loadSinglePlayerGame();
				this.gameObj.fogOfWar = (this.gameObj.fogOfWar == true || this.gameObj.fogOfWar == 'Y');
			} else {
				//new game
				var startingNation = numberVal(localStorage.startingNation);
				if (startingNation == 0) {
					clearCurrentGameId();
					displayFixedPopup('invalidGamePopup');
					return;
				}
				console.log('+++ new single player....', startingNation);
				var type = localStorage.gameTypeName;
				if (type == 'ww2') {
					if (startingNation == 11)
						startingNation = 1;
					if (startingNation == 12)
						startingNation = 3;
					if (startingNation == 13)
						startingNation = 2;
					if (startingNation == 14)
						startingNation = 4;
				}
				var numPlayers = localStorage.numPlayers;
				var name = 'Single Player Game';
				var currentCampaign = localStorage.currentCampaign || 0;
				var capitalsWin = 6;

				if (currentCampaign > 0) {
					name = this.superpowersData.campaigns[currentCampaign - 1].name;
					type = this.superpowersData.campaigns[currentCampaign - 1].type;
					numPlayers = this.superpowersData.campaigns[currentCampaign - 1].numPlayers;
					capitalsWin = this.superpowersData.campaigns[currentCampaign - 1].capitalsWin;
					if (currentCampaign >= 8)
						startingNation = Math.round(currentCampaign) - 3;
				}

				var pObj = {};
				if (localStorage.customGame == 'Y') {
					//					type = localStorage.customGameType;
					//					numPlayers = localStorage.customNumPlayers;
					//					pObj = JSON.parse(localStorage.customGamePlayers);
				}
				console.log('+++ createNewGameSimple1', startingNation);
				this.gameObj = createNewGameSimple(type, numPlayers, name, startingNation, pObj, this.user, currentCampaign);
				console.log('+++ createNewGameSimple2', startingNation);
				this.gameObj.difficultyNum = localStorage.difficultyNum || 1;
				this.gameObj.capitalsWin = capitalsWin;
				if (currentCampaign >= 8)
					this.gameObj.fogOfWar = true;
				if (currentCampaign >= 9)
					this.gameObj.hardFog = true;
				saveGame(this.gameObj, this.user, this.gameObj.players[0]);
				localStorage.currentGameId = this.gameObj.id;
			}
			this.beginToLoadTheBoard();
		}
	}
	getMultiplayerGameObjFromServer() {
		console.log('+++ multiplayer....', this.gameId);
		const url = this.getHostname() + "/web_join_game2.php";
		const postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, game_id: this.gameId, action: 'loadGame' });

		fetch(url, postData).then((resp) => resp.text())
			.then((data) => {
				updateProgressBar(40);
				this.gameObj = loadMultiPlayerGame(data);
				if (this.gameObj && this.gameObj.name) {
					localStorage.gameUpdDt = this.gameObj.gameUpdDt;
					console.log('+++gameUpdDt+++', localStorage.gameUpdDt);
					this.beginToLoadTheBoard();
				} else {
					updateProgressBar(100);
					this.loadingFlg = false;
					showAlertPopup('Loading error! ' + data, 1);
					stopSpinner();
					this.cdr.detectChanges();
				}
			})
			.catch(error => {
				this.showAlertPopup('Unable to reach server: ' + error, 1);
			});
	}
	beginToLoadTheBoard() {
		if (this.gameObj.territories.length > 0) {
			scrubGameObj(this.gameObj, this.superpowersData.units);
			setTimeout(() => { this.loadBoard(); }, 500);
		} else {
			clearCurrentGameId();
			displayFixedPopup('invalidGamePopup');
		}
	}
	loadBoard() {
		updateProgressBar(90);
		this.cdr.detectChanges();
		var e = document.getElementById('terr1');
		if (e) {
			var cp = getCurrentPlayer(this.gameObj);
			if (cp.userName == this.user.userName)
				this.yourPlayer = cp;
			else
				this.yourPlayer = getYourPlayer(this.gameObj, this.user.userName);
			if (this.yourPlayer)
				this.yourNation = this.yourPlayer.nation;
			this.currentPlayerNation = this.yourNation;
			console.log('--gameObj', this.gameObj);
			console.log('--yourPlayer', this.yourPlayer);
			refreshAllTerritories(this.gameObj, this.yourPlayer, this.superpowersData, this.yourPlayer)
			refreshBoard(this.gameObj.territories);
			this.gameObj.players.sort(function (a, b) { return a.turn - b.turn; });
			var left = window.innerWidth - 55;
			this.isDesktopFlg = window.innerWidth >= 600;
			if (left > 1282) {
				setTimeout(() => { playersPanelMoved(); }, 500);
				this.isMobileFlg = false;
			}
			setTimeout(() => { this.startTheAction(); }, 700);
			setTimeout(() => { positionPurchasePanel(); }, 900);
		} else {
			updateProgressBar(100);
			stopSpinner();
			this.loadingFlg = false;
			this.showAlertPopup('Error loading game!', 1);
			this.cdr.detectChanges();
			console.log('board not loaded!!!');
		}
	}
	//----------------load board------------------


	//----------------start turn------------------
	refreshGameBoard() {
		closePopup('undoMovesPopup');
		this.initBoard();
	}
	startTheAction() {
		if (isMusicOn())
			this.gameMusic.play();
		this.loadingFlg = false;
		updateProgressBar(100);
		stopSpinner();
		this.loadCurrentPlayer();
	}
	haultAction() {
		this.haltActionFlg = !this.haltActionFlg;
		localStorage.haltActionFlg = (this.haltActionFlg) ? 'Y' : 'N';
	}
	toggleAdminFlg() {
		playClick();
		this.adminModeFlg = !this.adminModeFlg;
		if (this.adminModeFlg)
			this.ableToTakeThisTurn = true;
	}
	closeMultiplayerStatus() {
		this.uploadMultiplayerFlg = false;
		closePopup('popupSaving');
	}
	newGameStarting() {
		playVoiceClip('welcome.mp3');
	}
	adminFixBoard() {
		this.showAlertPopup('Fix on!', 1);

		//var player2 = this.gameObj.players[6];
		//player2.treaties=[0,3,3,0,0,0,4,3];

		var terrId = 73;
		var terr = this.gameObj.territories[terrId - 1];
		//	terr.owner = 4;
		//this.addUnitToTerr(terr, 6, true, true, true);



		if (0) {
			var x = 0;
			terr.units.forEach(unit => {
				if (unit.terr == terrId && (unit.piece == 2 || unit.piece == 3)) {
					unit.terr = 50;
				}
			});
		}


		if (0) {
			setTimeout(() => {
				this.addUnitToTerr(terr, 30, true, true, true);
				this.addUnitToTerr(terr, 30, true, true, true);
				this.addUnitToTerr(terr, 30, true, true, true);
				//this.addUnitToTerr(terr, 11, true, true, true);
			}, 1000);
		}

		if (0) {
			terr.owner = 4;
			terr.units.forEach(unit => {
				if (unit.piece == 2 && unit.nation != 4) {
					//			unit.dead = true;
					unit.nation = 4;
				}
			});
		}
		/*
		terr.owner = 1;

		var terrId2 = 4;
		var terr2 = this.gameObj.territories[terrId2 - 1];
		terr2.owner = 1;


		var player = this.gameObj.players[2];
		player.money = 40;
		//		player2.defenseFlg = false;




		setTimeout(() => {
			this.addUnitToTerr(terr, 10, true, true);
		}, 1000);

		return;
		var player2 = this.gameObj.players[2];
		player2.money = 25;
		return;


		var terrId2 = 62;
		var terr2 = this.gameObj.territories[terrId2 - 1];
		setTimeout(() => {
			this.addUnitToTerr(terr2, 28, true, true);
			this.addUnitToTerr(terr2, 28, true, true);
			this.addUnitToTerr(terr2, 28, true, true);
			this.addUnitToTerr(terr2, 6, true, true);
			this.addUnitToTerr(terr2, 6, true, true);
		}, 1000);

		var player2 = this.gameObj.players[1];
		player2.money = 35;
		var player3 = this.gameObj.players[2];
		player3.money = 40;
		var player7 = this.gameObj.players[6];
		player7.money = 40;

*/


	}
	loadCurrentPlayer() {
		//#####################################################################
		//#####################################################################
		//#####################################################################
		//#####################################################################
		//#####################################################################
		//#####################################################################
		///uploadCompletedGameStats(this.gameObj, 'Russian Republic|European Union|Communist China|Middle-East Federation', this.superpowersData, this.yourPlayer, this.user);
		//-------------------- test
		if (0) {
			setTimeout(() => {
				this.adminFixBoard();
			}, 1000);
		}

		this.haltPurchaseFlg = false; //cpu only!
		this.haltCombatActionFlg = false;
		this.haltActionFlg = false;
		if (this.gameObj.maxAllies > 4)
			this.gameObj.maxAllies = 3;
		if (0) {
			//this.gameObj.turnId = 5; //<--- test
			this.haltActionFlg = true;
			this.haltPurchaseFlg = false;
			this.haltCombatActionFlg = true;
		}
		//--------------------end test
		this.currentPlayer = getCurrentPlayer(this.gameObj);
		if (0) {
			// if chaning turn
			this.currentPlayer.status = 'Attack';
			this.currentPlayer.money = 0;
			//select * from SP_PLAYER where game = '11297'
			//update SP_GAME set turn = '49204' where row_id = '11297'
		}
		this.currentPlayerNation = this.currentPlayer.nation;
		if (this.currentPlayer.userName == this.user.userName && this.yourPlayer.nation != this.currentPlayer.nation)
			this.yourPlayer = this.currentPlayer;

		this.gameObj.currentNation = this.currentPlayer.nation;
		this.gameObj.actionButtonMessage = '';
		this.currentPlayer.cpuFlg = this.currentPlayer.cpu;
		this.currentPlayer.cruiseFlg = this.currentPlayer.tech[7];

		console.log('=========[' + this.superpowersData.superpowers[this.currentPlayer.nation] + ']=========');
		if (!this.currentPlayer.news)
			this.currentPlayer.news = [];
		if (!this.currentPlayer.botRequests)
			this.currentPlayer.botRequests = [];
		if (!this.currentPlayer.offers)
			this.currentPlayer.offers = [];
		if (this.gameObj.hardFog == 'Y')
			illuminateTerritories(this.gameObj);

		if (!this.currentPlayer.cpu)
			refreshAllPlayerTerritories(this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
		this.findTargets();

		this.currentPlayer.allies = alliesFromTreaties(this.currentPlayer);
		this.currentPlayer.maxAlliesForPlayer = getMaxAllies(this.currentPlayer, this.gameObj);
		this.currentPlayer.treatiesAtStart = this.currentPlayer.treaties.slice(0);
		this.currentPlayer.allySpotsOpen = this.currentPlayer.maxAlliesForPlayer - this.currentPlayer.allies.length;

		if (this.gameObj.gameOver) {
			console.log('game over!!');
			this.ableToTakeThisTurn = false;
			this.showControls = true;
			this.gameObj.unitPurchases = [];
			clearCurrentGameId();
			this.gameMusic.pause();
			this.endGameMusic.play();
			checkVictoryConditions(this.currentPlayer, this.gameObj, this.superpowersData, this.yourPlayer, this.user);
			this.showAlertPopup(this.gameObj.currentSituation);
			this.cdr.detectChanges();
			return;
		}
		if (this.gameObj.multiPlayerFlg && this.yourPlayer && this.yourPlayer.nation > 0) {
			this.ableToTakeThisTurn = (this.user.userName == this.currentPlayer.userName);
		} else
			this.ableToTakeThisTurn = (this.gameObj.viewingNation == this.currentPlayer.nation && !this.currentPlayer.cpu);
		if (!this.gameObj.multiPlayerFlg)
			this.ableToTakeThisTurn = !this.currentPlayer.cpu;

		if (this.adminModeFlg && this.user.userName == 'Rick') {
			this.ableToTakeThisTurn = true; // admin mode only!!!
			this.yourPlayer = this.currentPlayer;
		}
		if (this.gameObj.multiPlayerFlg && !this.currentPlayer.cpu && this.gameObj.secondsSinceUpdate > 30) {
			if (this.yourPlayer && this.yourPlayer.cpu && this.yourPlayer.alive) {
				if (this.currentPlayer.awolFlg) {
					this.showAlertPopup('Looks like you went awol so the computer took over your turn. Restoring you back into the game.', 1);
					this.yourPlayer.cpu = false;
					setTimeout(() => {
						saveGame(this.gameObj, this.user, this.currentPlayer);
					}, 1000);
				}
			} else {
				if (this.user.userName == this.currentPlayer.userName && this.gameObj.mmFlg) {
					this.currentPlayer.empCount = 0;
				}
				this.checkEMPAndTimer(this.currentPlayer, this.gameObj, this.ableToTakeThisTurn);
			}
		}

		var treatyOfferedNation = 0;
		var nation = this.currentPlayer.nation;
		this.gameObj.players.forEach(function (player) {
			player.offers.forEach(function (offer) {
				if (offer == nation)
					treatyOfferedNation = player.nation;
			});
		});
		this.currentPlayer.treatyOfferedNation = treatyOfferedNation;
		playVoiceClip('nation' + this.currentPlayer.nation + '.mp3');

		if (this.ableToTakeThisTurn)
			this.displayMilitaryAdvisorMessage();
		else {
			this.initializePlayer();
		}

		this.cdr.detectChanges();
	}
	checkEMPAndTimer(player, gameObj, ableToTakeThisTurn) {
		var url = this.getHostname() + "/webSuperpowers.php";
		var postData = this.getPostDataFromObj({ user_login: this.user.userName, code: this.user.code, action: 'checkEMPAndTimer', gameId: gameObj.id });
		this.showSkipPlayerButtonFlg = false;
		this.showAccountSitButtonFlg = false;
		if (!ableToTakeThisTurn)
			displayFixedPopup('currentTurnPopup');

		fetch(url, postData).then((resp) => resp.text())
			.then((data) => {
				console.log(data);
				if (this.verifyServerResponse(data)) {
					var c = data.split("|");
					var obj = { gameId: c[1], turn: c[2], empCount: c[3], uid: c[4], minutesReduced: numberVal(c[5]), time_elapsed: numberVal(c[6]), rank: numberVal(c[7]), nation: numberVal(c[8]), mygames_last_login: c[9], time_elapsedUser: numberVal(c[10]) }
					//var secondsLeftInTimer = 86400 - obj.time_elapsed; // not sure if this is right
					var secondsLeftInTimer = 86400 - this.gameObj.secondsSinceUpdate;
					this.gameObj.timer = timerFromSeconds(secondsLeftInTimer);
					var secondsSinceLastLogin = getDateFromString(obj.mygames_last_login);
					var hours = Math.round(secondsSinceLastLogin / 3600);
					var minutesAway = Math.round(secondsSinceLastLogin / 60);
					this.gameObj.lastLogin = lastLoginFromSeconds(secondsSinceLastLogin);
					if (0) {
						console.log('#################################');
						console.log('obj', obj);
						console.log('secondsLeftInTimer', secondsLeftInTimer);
						console.log('obj.time_elapsed', obj.time_elapsed);
						console.log('obj.minutesReduced', obj.minutesReduced);
						console.log('this.gameObj.secondsSinceUpdate', this.gameObj.secondsSinceUpdate);
						console.log('secondsSinceLastLogin', secondsSinceLastLogin);
						console.log('obj.nation', obj.nation);
						console.log('player.nation', player.nation);
					}
					player.empCount = obj.empCount;
					if ((obj.nation == player.nation || gameObj.top1Nation == gameObj.top2Nation) && this.gameObj.secondsSinceUpdate > 30) {
						console.log('checking for awol');
						var playerIsAwol = false;
						if (hours > 24) {
							var numAllies = numberHumanAllies(player, gameObj);
							if (hours > 30 && obj.rank <= 8) {
								if (gameObj.type == 'battlebots' || gameObj.type == 'freeforall' || gameObj.round <= 2) {
									playerIsAwol = true;
								}
								if (hours > 40 && gameObj.round <= 4)
									playerIsAwol = true;
								if (hours > 60 && gameObj.round <= 6)
									playerIsAwol = true;
							}
							if (hours >= 60 && numAllies == 0) {
								playerIsAwol = true;
							}
							if (hours >= 80) {
								playerIsAwol = true;
							}
							if (secondsLeftInTimer > 43200)
								secondsLeftInTimer = 43000; // allow for account sit

							console.log('----possible awol----');
							console.log('hours', hours);
							console.log('rank', obj.rank);
							console.log('numAllies', numAllies);
							console.log('playerIsAwol', playerIsAwol);
						}
						if (ableToTakeThisTurn && obj.time_elapsed > 57600) {
							var elapsedHours = Math.round(obj.time_elapsed / 3600);
							var newTimer = 24 - elapsedHours + 6;
							if (newTimer < 6)
								newTimer = 6;

							showAlertPopup('Slow Turn Response: The game has been waiting on your turn for ' + elapsedHours + ' hours. Try visiting the site at least twice per day to keep games moving.', 1);
						} else if (playerIsAwol) {
							logItem(this.gameObj, this.currentPlayer, 'Player Awol', 'Playered turned into CPU after being away from game for ' + hours + ' hours. Visiting the game will restore the player to human.');
							this.gameObj.secondsSinceUpdate = 0;
							this.currentPlayer.cpu = true;
							this.currentPlayer.awolFlg = true;
							this.closePopup('currentTurnPopup');
							this.showAlertPopup('Player has gone awol!', 1);
							this.computerGo();
						} else if (secondsLeftInTimer < 43200 && this.yourPlayer && this.yourPlayer.treaties[this.currentPlayer.nation - 1] == 3) {
							this.showAccountSitButtonFlg = true;
						} else if (player.nation != this.yourNation && secondsLeftInTimer <= 0) {
							if (minutesAway < 15)
								this.showAlertPopup('Player has run out of time but appears to be online now.');
							else {
								if (this.user.userName == 'Rick' || this.user.userName == this.gameObj.host || (this.yourPlayer && this.yourPlayer.alive && this.gameObj.autoSkip))
									this.showSkipPlayerButtonFlg = true;

							}
						}
					}
					this.cdr.detectChanges();
				}
			})
			.catch(error => {
				this.showAlertPopup('Unable to reach server: ' + error, 1);
			});
	}

	accountSitButtonClicked() {
		this.playClick();
		this.closePopup('accountSitPopup');
		this.ableToTakeThisTurn = true;
		logItem(this.gameObj, this.currentPlayer, 'Account Sitting', 'Turn played by ' + this.user.userName);
		this.yourPlayer = this.currentPlayer;
		this.scrollToNation(this.currentPlayer.nation);
	}
	findTargets() {
		var territories = [];
		this.gameObj.territories.forEach(function (terr) {
			if (terr.movableTroopCount > 0) {
				terr.distObj = { land: 9, air: 9, sea: 9 };
				territories.push(terr);
			}
		});
		this.currentPlayer.territories = territories;

		var allyRequests = [];
		this.currentPlayer.primaryTargetId = 0;
		this.gameObj.territories.forEach(terr => {
			if (terr.requestedTarget == this.currentPlayer.nation) {
				console.log('+++requestedTarget+++', terr.name);
				this.currentPlayer.primaryTargetId = terr.id;
				this.currentPlayer.secondaryTargetId = terr.id;
				terr.requestedTarget = 0;
				if (!this.currentPlayer.cpu)
					allyRequests.push({ type: 1, terr: terr.id });
			}
			if (terr.requestedHotSpot == this.currentPlayer.nation) {
				console.log('+++requestedHotSpot+++', terr.name);
				this.currentPlayer.hotSpotId = terr.id;
				terr.requestedHotSpot = 0;
				if (!this.currentPlayer.cpu)
					allyRequests.push({ type: 2, terr: terr.id });
			}
			if (terr.owner == this.currentPlayer.nation && terr.requestTransfer > 0) {
				if (this.currentPlayer.cpu) {
					transferControlOfTerr(terr, terr.requestTransfer, this.gameObj, false);
					refreshTerritory(terr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
				} else
					allyRequests.push({ type: 3, terr: terr.id, nation: terr.requestTransfer });
				terr.requestTransfer = 0;
			}
		});
		if (this.currentPlayer.secondaryTargetId > 0) { // clear target if achieved
			var terr = this.gameObj.territories[this.currentPlayer.secondaryTargetId - 1];
			var tStatus = treatyStatus(this.currentPlayer, terr.owner);
			if (tStatus > 2)
				this.currentPlayer.secondaryTargetId = 0;
			if (this.currentPlayer.cpu && (tStatus == 1))
				declareWarOnNation(terr.owner, this.gameObj, this.currentPlayer, this.superpowersData);
		}
		if (this.currentPlayer.hotSpotId > 0) { // clear hot spot if lost
			var terr = this.gameObj.territories[this.currentPlayer.hotSpotId - 1];
			if (treatyStatus(this.currentPlayer, terr.owner) < 3)
				this.currentPlayer.hotSpotId = 0;
		}
		this.currentPlayer.allyRequests = allyRequests;
		if (this.currentPlayer.primaryTargetId == 0)
			this.currentPlayer.primaryTargetId = findPrimaryTarget(this.gameObj, this.currentPlayer);
		if (this.currentPlayer.secondaryTargetId == 0 || this.currentPlayer.primaryTargetId == 0)
			this.currentPlayer.secondaryTargetId = findSecondaryTarget(this.gameObj, this.currentPlayer);

		if (numberVal(this.currentPlayer.hotSpotId) == 0)
			this.currentPlayer.hotSpotId = findFortification(this.gameObj, this.currentPlayer);
		this.currentPlayer.mainTargetId = (this.currentPlayer.primaryTargetId > 0) ? this.currentPlayer.primaryTargetId : this.currentPlayer.secondaryTargetId;
		this.currentPlayer.mainBaseID = findMainBase(this.gameObj, this.currentPlayer);
	}
	displayMilitaryAdvisorMessage() {
		if (!this.gameObj.multiPlayerFlg && this.gameObj.round == 1 && this.gameObj.currentCampaign <= 6 && this.gameObj.currentCampaign >= 1) {
			if (this.currentPlayer.status == 'Purchase') {
				displayFixedPopup('introPopup');
				if (this.gameObj.currentCampaign == 0) {
					playVoiceClip('bt01welcome.mp3');
					playIntroSequence();
				}
				if (this.gameObj.currentCampaign > 0) {
					playVoiceClip('welcome.mp3');
				}

				this.cdr.detectChanges();
			} else {
				var msg = 'Begin the conquest!';
				if (this.gameObj.currentCampaign > 0)
					msg = this.superpowersData.campaigns[this.gameObj.currentCampaign - 1].mission;
				militaryAdvisorPopup(msg);
			}
			return;
		}
		if (this.gameObj.round == 1 && this.currentPlayer.placedInf < 3) {
			militaryAdvisorPopup('New Game! You are starting as ' + this.superpowersData.superpowers[this.yourPlayer.nation] + '. First place 3 infantry by clicking on ANY of your territories.', 21); //23
			return false;
		}
		var defaultLine = 'Round ' + this.gameObj.round + '. Purchase new units and then press "Purchase Complete".';
		if (this.gameObj.round > 3)
			defaultLine = 'Round ' + this.gameObj.round + '. Purchase new military units.';

		if (this.currentPlayer.status == 'Purchase')
			defaultLine = 'Round ' + this.gameObj.round + '. Conduct attacks, then press "Complete Turn" button at the top to end your turn.';

		if (this.gameObj.currentCampaign == 3) {
			playVoiceClip('round' + this.gameObj.round + '.mp3');
			if (this.gameObj.round == 2)
				militaryAdvisorPopup('Note, you can restore a bombed out factory simply by purchasing a new one.');
			else
				militaryAdvisorPopup('Build your economy, plus buy bombers to devistate your opponent. For this campaign you are trying to get your opponent\'s income under 20 coins.');
			//militaryAdvisorPopup(this.superpowersData.campaigns[this.gameObj.currentCampaign-1].roundIntro[this.gameObj.round - 1]);
			return;
		}
		if (this.gameObj.currentCampaign == 4) {
			playVoiceClip('round' + this.gameObj.round + '.mp3');
			if (this.gameObj.round <= 2)
				militaryAdvisorPopup('This campaign is very simple. Just spend 4 rounds nuking your enemy. Review "Logs" and "Units" tabs to fully understand how the damage works.');
			else
				militaryAdvisorPopup('Keep practicing your nukes. Campaign automatically ends after round 4.');
			return;
		}
		if (this.gameObj.currentCampaign == 5) {
			playVoiceClip('round' + this.gameObj.round + '.mp3');
			if (this.gameObj.round == 1)
				militaryAdvisorPopup('Let\'s try an amphibious landing of Greenland. Buy another transport to make the landing successful.');
			else if (this.gameObj.round == 2)
				militaryAdvisorPopup('Conduct an amphibious landing on Quebec, Canada. You can use multiple forces from multiple transports to attack all at once.');
			else
				militaryAdvisorPopup('Your goal is to take over the United States Capital.');

			return;
		}
		if (this.gameObj.currentCampaign == 6) {
			playVoiceClip('round' + this.gameObj.round + '.mp3');
			militaryAdvisorPopup('Purchase research until you get Anthrax Warheads. The research you develop will be random. See the Tech tab for details..');
			return;
		}
		if (this.gameObj.round <= 6) {
			playVoiceClip('round' + this.gameObj.round + '.mp3');
			militaryAdvisorPopup(this.advisorFirst6RoundsMessage[this.gameObj.round - 1]);
		} else {
			if (this.gameObj.victoryRound && this.gameObj.victoryRound > 0) {
				militaryAdvisorPopup('Victory conditions met! Game will end in round ' + this.gameObj.victoryRound + ' unless they are stopped!');
				playVoiceSound(60);
			} else {
				getMilitaryReportObj(this.gameObj, this.currentPlayer, defaultLine);
			}
		}
	}
	forceUserToClickTerritory(terrId: number) {
		this.forcedClickNation = terrId;
		var terr = this.gameObj.territories[terrId - 1];
		this.btPopupMessage = 'Click on ' + terr.name;
		this.changeSVGColor(true, terrId, terr.owner);
		setTimeout(() => {
			highlightTerritoryWithArrow(terrId, this.gameObj);
		}, 1000);
	}
	introContinuePressed() {
		this.playGameButtonPressed();
		closePopup('introPopup');

		if (this.gameObj.currentCampaign > 0 && this.gameObj.currentCampaign < 7)
			this.currentPlayer.placedInf = 3;

		if (this.gameObj.currentCampaign == 4) {
			this.btPopupMessage = 'Click on the "Units" button and research Nuclear Missiles under the "Air" units tab.';
			setTimeout(() => {
				highlightElementWithArrow('unitsButton');
			}, 1000);
			return;
		}
		if (this.gameObj.currentCampaign == 6) {
			this.btPopupMessage = 'Click on the "Tech" tab to see all of the technology possible. Click on the "Info" and "Show Description" buttons to see the details.';
			setTimeout(() => {
				highlightElementWithArrow('techButton');
			}, 1000);
			return;
		}
		if ((this.gameObj.currentCampaign >= 1 && this.gameObj.currentCampaign < 5) || this.gameObj.currentCampaign == 6) {
			this.newPlayerHelpText = 'Click on Germany';
			playVoiceClip('bt02EU.mp3');
			this.forcedClickNation = 7;
			setTimeout(() => {
				playVoiceClip('bt07Germany.mp3');
				highlightCapital(2);
			}, 4500);
		}
		if (this.gameObj.currentCampaign == 5) {
			this.forceUserToClickTerritory(110);
		}

	}
	playGameButtonPressed() {
		closePopup('advisorPopup');
		console.log('playGameButtonPressed');
		setTimeout(() => {
			positionPurchasePanel();
			this.cdr.detectChanges();
		}, 1000);

		this.initializePlayer();
	}
	initializePlayer() {
		//playVoiceClip('nation' + this.currentPlayer.nation + '.mp3');
		refreshAllTerritories(this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
		this.showAllianceMessageFlg = (this.gameObj.currentCampaign == 7 && this.gameObj.round == 1);
		this.showControls = !this.currentPlayer.cpu;
		if (!this.currentPlayer.cpu)
			this.cdr.reattach();
		if (localStorage.chatFlg == 'Y') {
			setTimeout(() => {
				changeClass('chatButton', 'btn btn-warning tight roundButton glowYellow');
				this.cdr.detectChanges();
			}, 1000);
		}

		if (this.currentPlayer.status == 'Waiting' || this.currentPlayer.status == 'Purchase')
			this.initializePlayerForPurchase();

		if (this.currentPlayer.status == 'Attack')
			this.initializePlayerForAttack();
		this.cdr.detectChanges();
	}
	dismissAllianceMessage() {
		this.showAllianceMessageFlg = false;
	}
	skipPlayerPressed() {
		this.playClick();
		this.closePopup('skipPlayerPopup');
		logItem(this.gameObj, this.currentPlayer, 'Turn Skipped', 'Turn skipped by ' + this.user.userName);
		this.gameObj.secondsSinceUpdate = 0;
		this.computerGo();
	}
	initializePlayerForPurchase() {
		//human & cpu
		var player = this.currentPlayer;
		this.hideActionButton = false;
		player.carrierAddedFlg = false;
		player.battleFlg = false;
		player.diplomacyFlg = false;
		player.diplomacyWarningFlg = false;
		player.generalIsCargo = false;
		player.status = 'Purchase';
		player.techsBoughtThisTurn = 0;
		player.techPurchasedThisTurn = false;
		localStorage.generalRetreatObj = '';
		this.gameObj.unitPurchases = [];
		this.gameObj.superBCForm.cost = 0;
		this.newPlayerHelpText = 'Purchase units then press "Purchase Complete"';

		resetPlayerUnits(player, this.gameObj); //<------------------------------------------------- clean player units
		if (this.currentPlayer.mainBaseID == 0)
			this.currentPlayer.mainBaseID = findMainBase(this.gameObj, this.currentPlayer);
		var numFactories = cleanUpTerritories(player, this.gameObj); //<------------------ clean territories
		if (player.cpu && player.income <= 5 && this.gameObj.round > 12 && !this.gameObj.multiPlayerFlg) {
			numFactories = 0;
		}
		if (numFactories == 0 && this.gameObj.round > 6) {
			logItem(this.gameObj, this.currentPlayer, 'Eliminated', this.superpowersData.superpowers[player.nation] + ' eliminated.');
			var voiceId = numberVal(player.nation) + 60;
			playVoiceSound(voiceId);
			showAlertPopup(this.superpowersData.superpowers[player.nation] + ' surrendered!', 1)
			player.alive = false;
			removeAlliancesForNation(player.nation, this.gameObj);
			if (this.currentPlayer.cpu)
				this.placeUnitsAndEndTurn();
			else
				this.surrenderConfirmButtonPressed();
			return;
		}
		this.checkTreatyOffers(player);
		scrollToCapital(this.currentPlayer.nation);

		if (player.cpu)
			this.computerGo();
		else {
			if ((this.gameObj.currentCampaign == 1 || this.gameObj.currentCampaign == 2) && this.gameObj.round <= 2) {
				this.forceUserToClickTerritory(7);
				this.newPlayerHelpText = 'Purchase units then press "Purchase Complete". Click on Germany.';
			}
			if ((this.gameObj.currentCampaign == 1 || this.gameObj.currentCampaign == 2) && this.gameObj.round == 3) {
				this.forceUserToClickTerritory(15);
				this.newPlayerHelpText = 'Build a new factory in Chechnya. Click on Chechnya.';
			}
			if ((this.gameObj.currentCampaign == 1 || this.gameObj.currentCampaign == 2) && this.gameObj.round == 4) {
				this.forceUserToClickTerritory(15);
			}
			if (this.gameObj.currentCampaign == 2 && this.gameObj.round == 5) {
				this.forceUserToClickTerritory(13);
			}
			if (this.gameObj.currentCampaign == 3 && this.gameObj.round == 2) {
				this.forceUserToClickTerritory(11);
			}
			if (this.gameObj.currentCampaign == 5 && this.gameObj.round == 3) {
				this.forceUserToClickTerritory(58);
			}
			if (this.gameObj.currentCampaign == 5 && this.gameObj.round == 4) {
				this.forceUserToClickTerritory(58);
			}
		}
		this.playerSetToPurchaseAndRefresh();
	}
	playerSetToPurchaseAndRefresh() {
		this.currentPlayer.status = 'Purchase';
		this.gameObj.actionButtonMessage = 'Purchase Complete';
		refreshAllPlayerTerritories(this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
	}
	playerSetToAttackAndRefresh() {
		this.currentPlayer.status = 'Attack';
		refreshAllPlayerTerritories(this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
	}
	initializePlayerForAttack() {
		this.newPlayerHelpText = 'Make an attack, or move units or press "End Turn"';

		this.gameObj.actionButtonMessage = 'Complete Turn';
		this.hideActionButton = !this.currentPlayer.battleFlg;
		if (this.currentPlayer.cpuFlg)
			this.computerGo();
		else {
			if (!this.gameObj.currentCampaign || this.gameObj.currentCampaign >= 7) {
				playVoiceClip('beginConquest.mp3');
				//return
			}
			if (this.gameObj.currentCampaign == 7 && this.gameObj.round == 1) {
				this.forceUserToClickTerritory(62);
				this.showAlertPopup('This campaign is a full blown game! Take over capitals, make allies and win the game by controlling 4 capitals. Start by taking Ukraine.');
			}
			if (this.gameObj.currentCampaign == 8 && this.gameObj.round == 1) {
				this.showAlertPopup('This campaign is a full blown game! Take over capitals, make allies and win the game by controlling 4 capitals. Good luck!');
			}
			if (this.gameObj.currentCampaign == 1 || this.gameObj.currentCampaign == 2) {
				if (this.gameObj.round == 1) {
					this.forceUserToClickTerritory(62);
					playVoiceClip('bt09Ukraine.mp3');
					if (this.gameObj.currentCampaign == 1)
						this.showAlertPopup('Begin the exercise! Your mission is to take over the Russian capital! You will need to fight your way there, starting with Ukraine.');
					else
						this.showAlertPopup('Your mission is to conquer all of Russia! This will boost your income by 20 coins per turn. Start by taking over Ukraine.');
					this.newPlayerHelpText = 'Make an attack!. Click on Ukraine.';
				}
				if (this.gameObj.round == 2) {
					this.forceUserToClickTerritory(15);
					this.showAlertPopup('Let the invasion of Russia Commence! Click on Chechnya to attack.');
					this.newPlayerHelpText = 'Advance into Russia! Click on Chechnya to attack.';
				}
				if (this.gameObj.round == 3) {
					this.forceUserToClickTerritory(14);
					this.showAlertPopup('Continue pushing towards the Russian capital! Click on Karelia to attack.');
					this.newPlayerHelpText = 'Keep fighting! Click on Karelia to attack.';
				}
				if (this.gameObj.round == 4) {
					this.forceUserToClickTerritory(13);
					if (this.gameObj.currentCampaign == 1 || this.gameObj.currentCampaign == 2)
						this.showAlertPopup('Your want to take Russia! See if you have enough forces to attack.');
					else
						this.showAlertPopup('Your goal is to take over ' + this.gameObj.capitalsWin + ' capitals. See if you have enough forces to attack Russia.');
					this.newPlayerHelpText = 'Your goal is to take over 6 capitals. See if you have enough forces to attack Russia.';
				}
				if (this.gameObj.round == 5) {
					this.forceUserToClickTerritory(17);
				}
			} // 1 or 2
			if (this.gameObj.currentCampaign == 3) {
				if (this.gameObj.round == 1) {
					this.showAlertPopup('Try to strategically bomb the factory in Karelia. If you hit, the burned out factory causes the player to lose 5 coins/turn.');
					this.forceUserToClickTerritory(14);
				}
				if (this.gameObj.round == 2) {
					this.showAlertPopup('Find another factory to try to bomb. Notice if the factory has a plus (+) sign on it, it means it has air defense. Finding a factory with no Air Defense means you have a free chance to attack it.');
				}
				if (this.gameObj.round == 3) {
					this.showAlertPopup('Note each bomber can destroy 1 factory, so split up your bombers and attack each factory with one bomber. Note your bomber must roll a "4" or lower to hit!');
				}
				if (this.gameObj.round == 4) {
					this.showAlertPopup('Note if an enemy territory has an economic center on it, you can bomb it twice in one turn. So send 2 bombers to those targets! Otherwise only send one bomber to each factory.');
				}
			}
			if (this.gameObj.currentCampaign == 4) {
				if (this.gameObj.round == 1) {
					this.showAlertPopup('Teach Russia a lesson! Try nuking Karelia.');
					this.forceUserToClickTerritory(14);
				}
				if (this.gameObj.round == 2) {
					this.showAlertPopup('Find another good target to nuke.');
				}
			}
			if (this.gameObj.currentCampaign == 5) {
				if (this.gameObj.round == 1) {
					this.showAlertPopup('Let\'s do an amphibious landing on Greenland. Start by loading your transport with 4 infantry and both heros.');
					this.forceUserToClickTerritory(110);
				}
				if (this.gameObj.round == 2) {
					this.showAlertPopup('Load up your remaining ground forces onto your new transports.');
					this.forceUserToClickTerritory(110);
				}
				if (this.gameObj.round == 3) {
					this.showAlertPopup('You don\'t have enough forces to attack the capital yet. Take over Central USA to help build up your forces.');
					this.forceUserToClickTerritory(2);
				}
			}
			if (this.gameObj.currentCampaign == 6 && this.gameObj.round == 1) {
				this.showAlertPopup('Good job. You have randomly gained two technologies! The object of this campaign is simply research technology until you gain "Antrax Warheads". No attacks are neccessary. Click "OK" to see which technologies your scientists came up with.');
			}
			if (this.gameObj.currentCampaign == 7 && this.gameObj.round == 2) {
				this.showAlertPopup('View the allies tab to see how the teams are stacking up. Once you are at peace with a player, you can offer an alliance!');
			}
		}
	}
	cpuSpeedFlgChanged() {
		this.hiSpeedFlg = !this.hiSpeedFlg;
		this.playClick();
		this.showControls = false;
	}
	computerGoClicked() {
		playClick();
		playSound('yes.mp3');
		closePopup('computerTakeTurnPopup');
		logItem(this.gameObj, this.currentPlayer, 'Turn Skipped', 'Turn skipped by ' + this.user.userName);
		this.computerGo();
	}
	computerGo() {
		if (this.gameObj.gameOver)
			return;
		if (!localStorage.soundBox)
			this.warAudio.play();

		this.currentPlayer.cpuFlg = true;
		this.showControls = false;
		cleanUpTerritories(this.currentPlayer, this.gameObj);
		if (this.currentPlayer.status == 'Purchase')
			this.currentPlayer.status = 'Waiting';

		this.cdr.detectChanges();
		this.cdr.detach();
		var delay = (this.hiSpeedFlg) ? 100 : 1500;
		setTimeout(() => {
			this.computerStarting();
		}, delay);
	}
	computerStarting() {
		if (this.currentPlayer.status == 'Waiting' || this.currentPlayer.status == 'Purchase') {
			this.computerPurchase();
		} else {
			this.computerAttack();
		}
	}
	computerPurchase() {
		purchaseCPUUnits(this.currentPlayer, this.gameObj, this.superpowersData, this.user.rank);
		this.currentPlayer.status = 'Purchase';
		this.cdr.detectChanges();

		if (this.haltPurchaseFlg) {
			this.showControls = true;
			showAlertPopup('purchases done! action halted.');
		} else {
			setTimeout(() => {
				this.completingPurchases();
			}, 200);
		}
	}
	computerAttack() {
		declareWarIfNeeded(this.gameObj, this.currentPlayer, this.superpowersData);

		if (this.gameObj.currentCampaign == 3) {
			this.attemptCPUStrategicBomb();
		} else if (this.gameObj.currentCampaign == 4) {
			this.attemptCPUToNuke();
		} else {

			if (this.currentPlayer.primaryTargetId > 0)
				this.allUnitsAttack(this.currentPlayer.primaryTargetId);
			else {
				var obj = findAmphibiousAttacks(this.gameObj, this.currentPlayer);
				if (this.gameObj.round != 6 && obj && obj.attackUnits.length > 0) {
					this.doThisBattle(obj);
					if (obj && obj.ampFlg) {
						this.doThisBattle({ attackUnits: obj.ampAttUnits, defUnits: obj.ampDefUnits, t1: obj.ampAttTerr.id, t2: obj.ampDefTerr.id, id: 2, terr: obj.ampDefTerr, attTerr: obj.ampAttTerr });
					}
					refreshTerritory(obj.ampAttTerr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
					refreshTerritory(obj.ampDefTerr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
				}
			}

			this.attemptToAttackACapital(this.currentPlayer, this.gameObj);

			if (this.gameObj.currentCampaign != 7 && this.gameObj.currentCampaign != 8 && this.gameObj.currentCampaign != 9) {
				if (this.gameObj.round > 6 && this.currentPlayer.tech[3])
					this.attemptCPUToNuke();

				if (this.gameObj.round > 6 && this.currentPlayer.tech[8])
					this.attemptCPUToCruise();

				if (this.gameObj.round > 6)
					this.attemptCPUStrategicBomb();

			}

			if (this.currentPlayer.primaryTargetId != this.currentPlayer.mainBaseID) {
				var obj = findMainBaseTarget(this.gameObj, this.currentPlayer);
				this.doThisBattle(obj);
			}
			if (this.currentPlayer.secondaryTargetId > 0)
				this.attemptToAttack(this.currentPlayer.secondaryTargetId);

			this.attackFromAllTerritories();

			this.advanceMainBase();
		}

		this.cdr.detectChanges();
		var delay = (this.hiSpeedFlg) ? 100 : 3000;
		if (this.haltCombatActionFlg) {
			this.showControls = true;//<---testing only!!
			showAlertPopup('action halted!', 1);
			this.warAudio.pause();
		} else {
			this.currentPlayer.status = 'Move';
			setTimeout(() => {
				this.computerMove();
			}, delay);
		}
	}
	attemptToAttackACapital(player: any, gameObj: any) {
		this.gameObj.territories.forEach(terr => {
			if (terr.capital && terr.nation < 99 && terr.owner != player.nation && okToAttack(player, terr, gameObj)) {
				if (terr.owner == 0 || treatyStatus(player, terr.owner) == 0) {
					var terrAtt;
					terr.land.forEach(terrId => {
						var ter = gameObj.territories[terrId - 1];
						if (ter.owner == player.nation && ter.attStrength > terr.defStrength)
							terrAtt = ter;
					});
					if (terrAtt) {
						var obj = stageAttackBetweenTerritories(terrAtt, terr, player);
						this.doThisBattle(obj);
					}
				}
			}
		});
	}
	attemptCPUStrategicBomb() {
		var terrHash = {};
		var attackUnits = [];
		this.gameObj.units.forEach(unit => {
			if (unit.owner == this.currentPlayer.nation && unit.piece == 7) {
				if (terrHash[unit.terr])
					terrHash[unit.terr]++;
				else
					terrHash[unit.terr] = 1;
			}
		});
		var keys = Object.keys(terrHash);
		var player = this.currentPlayer;
		var nukeTargets = [];
		keys.forEach(idStr => {
			var id = numberVal(idStr) - 1;
			var terr = this.gameObj.territories[id];
			var range = 4;
			var target = this.findStratBombOfTerr(terr, this.currentPlayer, range, null, this.gameObj);
			if (target) {
				nukeTargets.push({ t1: terr, t2: target });
			}
		});
		var hitListHash = {};
		nukeTargets.forEach(nukeTarget => {
			if (hitListHash[nukeTarget.t2.id])
				return;
			var terr = nukeTarget.t1;
			var target = nukeTarget.t2;
			hitListHash[target.id] = true;
			this.gameObj.units.forEach(unit => {
				if (unit.owner == this.currentPlayer.nation && unit.piece == 7 && unit.terr == terr.id && unit.movesLeft > 0) {
					unit.movesLeft = 0;
					attackUnits.push(unit);
				}
			});
			if (attackUnits.length > 0 && terr.attackedByNation != this.currentPlayer.nation)
				this.strategicBombThisTerr(terr.id, attackUnits, target, [terr], this.currentPlayer, this.gameObj, this.superpowersData);
		});
	}
	attemptCPUToCruise() {
		var terrHash = {};
		var attackUnits = [];
		this.gameObj.units.forEach(unit => {
			if (unit.owner == this.currentPlayer.nation && isUnitCruiseUnit(unit.piece)) {
				if (terrHash[unit.terr])
					terrHash[unit.terr]++;
				else
					terrHash[unit.terr] = 1;
			}
		});
		var keys = Object.keys(terrHash);
		var player = this.currentPlayer;
		keys.forEach(idStr => {
			var id = numberVal(idStr) - 1;
			var terr = this.gameObj.territories[id];
			attackUnits = [];
			this.gameObj.units.forEach(unit => {
				if (unit.owner == player.nation && unit.terr == terr.id && unit.movesLeft > 0 && isUnitCruiseUnit(unit.piece)) {
					unit.movesLeft = 0;
					attackUnits.push(unit);
				}
			});
			var min = 0;
			var bestTerr;
			var borders = terr.borders.split('+');
			borders.forEach(borderId => {
				if (borderId > 0) {
					var terr2 = this.gameObj.territories[borderId - 1];
					if (terr2.nation < 99 && terr2.owner != player.nation && !terr2.nuked && terr2.unitCount > min && isAtWarWith(player, terr2, this.gameObj)) {
						min = terr2.unitCount;
						bestTerr = terr2;
					}
				}
			});
			if (bestTerr && attackUnits.length > 0) {
				this.landTheCruise(terr.id, attackUnits, bestTerr, [terr], this.currentPlayer, this.gameObj, this.superpowersData);
			}
		});
	}
	attemptCPUToNuke() {
		var terrHash = {};
		var attackUnits = [];
		this.gameObj.units.forEach(unit => {
			if (unit.owner == this.currentPlayer.nation && unit.piece == 14) {
				if (terrHash[unit.terr])
					terrHash[unit.terr]++;
				else
					terrHash[unit.terr] = 1;
			}
		});
		var keys = Object.keys(terrHash);
		var nukeTargets = [];
		keys.forEach(idStr => {
			var id = numberVal(idStr) - 1;
			var terr = this.gameObj.territories[id];
			var minTroops = 5;
			var range = 4;
			var target = this.findLargestEnemyOfTerr(terr, this.currentPlayer, minTroops, range, null, this.gameObj);
			if (target) {
				nukeTargets.push({ t1: terr, t2: target });
			}
		});
		var hitListHash = {};
		nukeTargets.forEach(nukeTarget => {
			if (hitListHash[nukeTarget.t2.id])
				return;
			var terr = nukeTarget.t1;
			var target = nukeTarget.t2;
			if (target.unitCount < 6)
				return;
			hitListHash[target.id] = true;
			var hits = maximumPossibleNukeHitsForTerr(target, this.currentPlayer, this.gameObj);
			var maxNukes = Math.ceil(target.unitCount / hits);
			this.gameObj.units.forEach(unit => {
				if (unit.owner == this.currentPlayer.nation && unit.piece == 14 && unit.terr == terr.id && unit.movesLeft > 0 && --maxNukes >= 0) {
					unit.movesLeft = 0;
					attackUnits.push(unit);
				}
			});
			if (attackUnits.length > 0 && hits > 0 && !terr.nuked && terr.attackedByNation != this.currentPlayer.nation)
				this.landTheNuke(terr.id, attackUnits, target, [terr], this.currentPlayer, this.gameObj, this.superpowersData);
		});

	}
	strategicBombThisTerr(fromTerrId: number, attackUnits: any, targetTerr: any, launchTerritories: any, player: any, gameObj: any, superpowersData: any) {
		var obj = { t1: fromTerrId, t2: targetTerr.id, id: 7, cruiseFlg: true };
		this.moveSpriteBetweenTerrs(obj);
		strategicBombBattle(player, targetTerr, attackUnits, gameObj, superpowersData);
	}
	landTheCruise(fromTerrId: number, attackUnits: any, targetTerr: any, launchTerritories: any, player: any, gameObj: any, superpowersData: any) {
		var obj = { t1: fromTerrId, t2: targetTerr.id, id: 144, cruiseFlg: true };
		this.moveSpriteBetweenTerrs(obj);
		landTheCruiseBattle(player, targetTerr, attackUnits, gameObj, superpowersData);
	}
	landTheNuke(fromTerrId: number, attackUnits: any, targetTerr: any, launchTerritories: any, player: any, gameObj: any, superpowersData: any) {
		var obj = { t1: fromTerrId, t2: targetTerr.id, id: 14, nukeFlg: true };
		this.moveSpriteBetweenTerrs(obj);
		landTheNukeBattle(player, targetTerr, attackUnits, gameObj, superpowersData, launchTerritories);
	}
	findStratBombOfTerr(terr: any, attacker: any, range: number, bestTerr: any, gameObj: any) {
		range--;
		if (range == 0 || !terr.land)
			return bestTerr;
		for (var x = 0; x < terr.land.length; x++) {
			var id = terr.land[x];
			var terr2 = this.gameObj.territories[id - 1];
			if (terr2.factoryCount > 0 && terr2.owner != attacker.nation && numberVal(terr2.defendingFighterId) == 0 && !terr2.facBombed && isAtWarWith(attacker, terr2, gameObj)) {
				bestTerr = terr2;
			} else
				bestTerr = this.findStratBombOfTerr(terr2, attacker, range, bestTerr, gameObj);
		}
		return bestTerr;
	}
	findClosestEnemy(terr: any, attacker: any, max: number, range: number, bestTerr: any, gameObj: any, targetHash: any) {
		range--;
		if (range == 0 || !terr.land || !terr.land)
			return bestTerr;
		for (var x = 0; x < terr.land.length; x++) {
			var id = terr.land[x];
			if (!targetHash[id]) {
				targetHash[id] = true;
				var terr2 = this.gameObj.territories[id - 1];
				//				console.log(terr.name, terr2.name);
				if (!terr2.nuked && terr2.owner != attacker.nation && okToAttack(attacker, terr2, gameObj)) {
					return terr2;
				} else {
					var possibleTarget = this.findClosestEnemy(terr2, attacker, max, range, bestTerr, gameObj, targetHash);
					if (possibleTarget)
						return possibleTarget;
				}
			}
		}
		return bestTerr;

	}
	findLargestEnemyOfTerr(terr: any, attacker: any, max: number, range: number, bestTerr: any, gameObj: any) {
		range--;
		if (range == 0 || !terr.land)
			return bestTerr;
		for (var x = 0; x < terr.land.length; x++) {
			var id = terr.land[x];
			var terr2 = this.gameObj.territories[id - 1]; //treatyStatus(attacker, terr2.owner)
			if (!terr2.nuked && terr2.unitCount > max && terr2.owner != attacker.nation && isAtWarWith(attacker, terr2, gameObj)) {
				max = terr2.unitCount;
				bestTerr = terr2;
			}
			var possibleTarget = this.findLargestEnemyOfTerr(terr2, attacker, max, range, bestTerr, gameObj);
			if (possibleTarget && possibleTarget.unitCount > max)
				bestTerr = possibleTarget;
		}
		return bestTerr;

	}
	advanceMainBase() {
		var base = this.gameObj.territories[this.currentPlayer.mainBaseID - 1];
		if (!base || !base.land || this.currentPlayer.mainTargetId == 0)
			return;
		if (base.attackedRound == this.gameObj.round)
			return;
		var target = this.gameObj.territories[this.currentPlayer.mainTargetId - 1];
		if (!target)
			return;
		var dist = landDistFromTerr(this.currentPlayer.mainBaseID, target.id, 0, this.gameObj);
		var closerTerr;
		base.land.forEach(terrId => {
			var terr = this.gameObj.territories[terrId - 1];
			if (terr.owner == this.currentPlayer.nation && terr.attackedRound != this.gameObj.round) {
				var d = landDistFromTerr(terr.id, target.id, 0, this.gameObj);
				if (d < dist) {
					d = dist;
					closerTerr = terr;
				}
			}
		});
		if (closerTerr && closerTerr.attackedRound != this.gameObj.round)
			this.moveUnitsFromTerrToTerr(base, closerTerr, this.currentPlayer.nation);
	}
	moveUnitsFromTerrToTerr(terr1, terr2, nation) {
		var piece = 2;
		var infCount = 0;
		terr1.units.forEach(function (unit) {
			if (isUnitOkToMove(unit, nation) && (unit.piece != 2 || ++infCount > 3)) {
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
		if (obj)
			this.doThisBattle(obj);
	}
	attemptToAttack(id: number) {
		var obj = attemptToAttack(id, this.currentPlayer, this.gameObj);
		//		console.log('attemptToAttack', id, obj);
		this.doThisBattle(obj);
	}
	doThisBattle(obj: any) {
		if (obj && obj.attackUnits && obj.attackUnits.length > 0) {
			this.moveFlagBetweenTerrs({ t1: obj.t1, t2: obj.t2, nation: this.currentPlayer.nation });

			this.moveSpriteBetweenTerrs(obj);
			if (obj.terr.owner == this.currentPlayer.nation) {
				moveTheseUnitsToThisTerritory(obj.attackUnits, obj.terr, this.gameObj);
			} else {
				this.displayBattle = initializeBattle(this.currentPlayer, obj.terr, obj.attackUnits, this.gameObj);
				var cost = startBattle(obj.terr, this.currentPlayer, this.gameObj, this.superpowersData, this.displayBattle);
				this.computerBattleRound(obj);
			}
		}
	}
	computerBattleRound(obj: any) {
		removeCasualties(this.displayBattle, this.gameObj, this.currentPlayer, false, this.superpowersData);
		this.displayBattle.round++;
		addAAGunesToBattle(this.displayBattle, obj.terr);
		rollAttackDice(this.displayBattle, this.gameObj);
		rollDefenderDice(this.displayBattle, obj.terr, this.currentPlayer, [obj.attTerr], this.gameObj, this.superpowersData);
		if (this.displayBattle.militaryObj.battleInProgress)
			this.computerBattleRound(obj);
		else {
			this.cpuBattleIsDone();
		}
	}
	cpuBattleIsDone() {
		this.battleReport = this.getBattleReportFromBattleObj(this.displayBattle);
		popupBattleReport(this.battleReport);
	}
	computerMove() {
		recallBoats(this.gameObj, this.currentPlayer);

		if (this.currentPlayer.primaryTargetId == 0 && this.currentPlayer.nation != 4) {
			var obj = findAmphibiousAttacks(this.gameObj, this.currentPlayer, true);
			if (obj && obj.attackUnits.length > 0) {
				this.doThisBattle(obj);
				if (obj && obj.ampFlg) {
					//				this.doThisBattle({ attackUnits: obj.ampAttUnits, defUnits: obj.ampDefUnits, t1: obj.ampAttTerr.id, t2: obj.ampDefTerr.id, id: 2, terr: obj.ampDefTerr, attTerr: obj.ampAttTerr });
				}
				refreshTerritory(obj.ampAttTerr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
				refreshTerritory(obj.ampDefTerr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
			}
		}


		var obj = moveCPUUnits(this.currentPlayer, this.gameObj, this.superpowersData);
		if (obj.t1 > 0)
			this.moveSpriteBetweenTerrs(obj);

		respositionMainBase(this.currentPlayer, this.gameObj);

		this.moveAllLargeArmies(this.gameObj, this.currentPlayer, this.superpowersData);

		if (this.currentPlayer.hotSpotId > 0)
			fortifyThisTerritory(this.currentPlayer, this.gameObj);

		this.refreshPlayerTerritories(this.currentPlayer, this.gameObj, this.superpowersData, this.yourPlayer);
		this.cdr.detectChanges();

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
		console.log('completingPurchases', this.currentPlayer.status);

		this.playerSetToAttackAndRefresh();
		this.hideActionButton = !this.hideActionButton;
		this.logPurchases(this.currentPlayer);
		scrubUnitsOfPlayer(this.currentPlayer, this.gameObj, this.superpowersData.units); // in case of tech
		if (!this.currentPlayer.cpuFlg)
			saveGame(this.gameObj, this.user, this.currentPlayer);
		this.initializePlayerForAttack();
	}
	diplomacyDone(msg: string) {
		if (this.currentPlayer.offers.length == 0) {
			this.playerSetToPurchaseAndRefresh();
		}
		scrollToCapital(this.currentPlayer.nation);
	}
	checkTreatyOffers(player) {
		if (this.ableToTakeThisTurn && (player.offers.length > 0 || player.news.length > 0 || player.botRequests.length > 0)) {
			if (player.offers.length > 0) {
				this.gameObj.actionButtonMessage = 'Diplomacy';
				this.currentPlayer.status = 'Diplomacy';
			}
			this.diplomacyModal.show(this.gameObj, this.ableToTakeThisTurn, this.currentPlayer, this.yourPlayer);
			return true;
		}
		if (player.cpu)
			doCpuDiplomacyRespond(player, this.gameObj, this.superpowersData);

		return false;
	}
	forcedClickMessage() {
		var ter = this.gameObj.territories[this.forcedClickNation - 1];
		if (this.forcedClickNation == 62)
			showAlertPopup('You need to expand your empire by taking over Ukraine!', 1);
		else
			showAlertPopup('Please click on ' + ter.name, 1);
		this.forceUserToClickTerritory(this.forcedClickNation);
		//highlightTerritoryWithArrow(this.forcedClickNation, this.gameObj);
	}
	terrClicked(popup: any, terr: any, gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any) {
		if (!this.showControls) {
			playSound('error.mp3');
			return;
		}
		if (this.fightersStrandedFlg && this.selectedTerritory) {
			this.fightersStrandedFlg = false;
			var fightersToMove = this.selectedTerritory.carrierCargo - this.selectedTerritory.carrierSpace;
			this.selectedTerritory.units.forEach(unit => {
				if (unit.subType == 'fighter' && fightersToMove-- > 0) {
					unit.terr = terr.id;
				}
			});
			refreshTerritory(this.selectedTerritory, this.gameObj, this.currentPlayer, this.superpowersData, (this.ableToTakeThisTurn) ? this.currentPlayer : this.yourPlayer);
			refreshTerritory(terr, this.gameObj, this.currentPlayer, this.superpowersData, (this.ableToTakeThisTurn) ? this.currentPlayer : this.yourPlayer);

			this.showAlertPopup('Fighters moved.');
			return;

		}
		if (this.ableToTakeThisTurn) {

			if (this.strandedAAGuns.length > 0) {
				moveTheseUnitsToThisTerritory(this.strandedAAGuns, terr, gameObj);
				this.showAlertPopup('Units moved!', 1);
				this.strandedAAGuns = [];
				return;
			}
			if (terr.adCount > 0 && terr.unitCount == 0 && terr.nation == 99) {
				this.showAlertPopup('Stranded AA guns here. Click on the territory that they should be on.', 1);
				var strandedAAGuns = [];
				terr.units.forEach(unit => {
					if (unit.piece == 13)
						strandedAAGuns.push(unit);
				});
				this.strandedAAGuns = strandedAAGuns;
				terr.adCount = 0;
				terr.units = [];
				return;
			}
			if (this.forcedClickNation > 0) {
				if (terr.id == this.forcedClickNation) {
					if (this.forcedClickNation == 62 && this.gameObj.round == 1) {
						this.btPopupMessage = 'Click "Attack" and send all your units into Ukraine.';
					}
					this.forcedClickNation = 0;
				} else {
					console.log('supposed to be forced click!');
					//this.forcedClickMessage();
					//return;
				}
			}
			if (this.gameObj.round == 1 && this.currentPlayer.placedInf < 3) {
				if (terr.owner != currentPlayer.nation || terr.nation == 99)
					showAlertPopup('Click on one of your ' + this.superpowersData.superpowers[this.currentPlayer.nation] + ' territories to place an infantry.', 1);
				else {
					this.addUnitToTerr(terr, 2, true, true);
					this.currentPlayer.placedInf++;
					if (this.currentPlayer.placedInf >= 3)
						displayFixedPopup('infantry3Confirm');
				}

				return;
			}
		}
		if (gameObj.hardFog && terr.treatyStatus < 3 && !terr.illuminateFlg)
			terr.illuminateFlg = checkIlluminateFlg(terr, gameObj);
		this.bonusInfantryFlg = (terr.owner == 0 && !terr.capital && terr.nation < 99);
		this.bonusFactoryFlg = (terr.owner == 0 && terr.capital && terr.nation < 99);
		hideArrow();
		if (currentPlayer.status == 'Purchase') {
			this.btPopupMessage = 'Click on Germany.';
			if (gameObj.currentCampaign < 2) {
				if (this.gameObj.round == 1)
					this.btPopupMessage = 'Check out your available coins. Press "Buy" buttons below purchase units.';
			}


			changeClass('completeTurnButton', 'glowButton');
		}


		refreshTerritory(terr, this.gameObj, this.currentPlayer, this.superpowersData, (this.ableToTakeThisTurn) ? this.currentPlayer : this.yourPlayer);
		displayLeaderAndAdvisorInfo(terr, currentPlayer, this.yourPlayer, user, gameObj, this.superpowersData.superpowers, 'home');
		//		terr.units = unitsForTerr(terr, gameObj.units);
		terr.displayQueue = getDisplayQueueFromQueue(terr, this.gameObj);
		this.selectedTerritory = terr;
		if (terr.nation == 99 && terr.carrierCargo > terr.carrierSpace) {
			this.fightersStrandedFlg = true;
			this.showAlertPopup('Fighters stranded. Click the territory they belong to.', 1);
		}
		else
			popup.show(terr, currentPlayer, gameObj, ableToTakeThisTurn, user, this.yourPlayer);
	}
	musicUpdated($event) {
		if (isMusicOn()) {
			this.gameMusic.play();
		} else {
			this.gameMusic.pause();
		}
	}
	exitButtonPressed() {
		this.gameMusic.pause();
		this.endGameMusic.pause();
		this.playClick();
		if (this.gameObj.multiPlayerFlg)
			this.router.navigate(['/multiplayer']);
		else if (this.gameObj.currentCampaign > 0 && this.gameObj.currentCampaign < 10)
			this.router.navigate(['/campaign']);
		else
			this.router.navigate(['/']);
	}
	redoMoves() {
		closePopup('infantry3Confirm');
		playClick();
		this.initBoard();
	}
	acceptInfantryPlacement() {
		closePopup('infantry3Confirm');
		highlightCapital(this.currentPlayer.nation);
		playVoiceSound(22);
	}
	addUnitToTerr(terr: any, piece: number, allowMovesFlg: boolean, refreshFlg: boolean, terrOwnerFlg = false) {
		if (piece == 52)
			allowMovesFlg = true;

		var nation = this.currentPlayer.nation;		// player
		if (terrOwnerFlg)
			var nation = terr.owner; 					// terr owner
		if (terr.owner != this.currentPlayer.nation && terr.nation == 99)
			terr.owner = this.currentPlayer.nation;
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
			this.annimateUnit(piece, terr);
			refreshTerritory(terr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
		} else {
			//			terr.unitCount++;
			//			terr.displayUnitCount = getDisplayUnitCount(terr, this.gameObj);
		}
	}
	getBattleReportFromBattleObj(battleObj: any) {
		var attCasualties = battleObj.attCasualties.length;
		var defCasualties = battleObj.defCasualties.length;
		var wonFlg = battleObj.militaryObj.wonFlg;
		var terrX = battleObj.terrX; //battleObj.terrX
		var terrY = battleObj.terrY; //battleObj.terrY
		var cruiseFlg = (battleObj.cruiseFlg);
		var result = (wonFlg) ? 'Won!' : 'Lost!';
		return {
			flag: '', type: 'Battle', icon: 'fa-crosshairs', attNation: battleObj.attacker, defNation: battleObj.defender, attCasualties: attCasualties,
			defCasualties: defCasualties, wonFlg: wonFlg,
			result: result, terrX: terrX, terrY: terrY, cruiseFlg: cruiseFlg
		};
	}
	battleCompletedEmit(battleObj: any) {
		this.battleObj = battleObj;
		this.newPlayerHelpText = 'Press "Complete Turn" button at the top.';
		console.log('!!!battleCompletedEmit!!!', battleObj);
		if (this.gameObj.currentCampaign == 4 && this.gameObj.round == 1) {
			this.btPopupMessage = 'Click on the "Logs" button to see a full report of damage.';
			setTimeout(() => {
				highlightElementWithArrow('logsButton');
			}, 1000);
		}
		if (this.gameObj.currentCampaign == 5 && battleObj.terr == 59 && battleObj.militaryObj.wonFlg) {
			this.showAlertPopup('Nice Job! On your next turn invade Quebec and set up for an attack on United States.');
		}
		if (this.gameObj.currentCampaign == 5 && battleObj.terr == 58 && battleObj.militaryObj.wonFlg) {
			this.showAlertPopup('Great! You may want to build a factory here next turn so you can build troops to invade USA.');
		}
		if (this.gameObj.currentCampaign == 5 && battleObj.terr == 1 && battleObj.militaryObj.wonFlg) {
			this.showAlertPopup('Nice work! Press "Complete Turn" to end this campaign.');
		}
		if (battleObj.terr == 62 && this.user.rank < 2 && battleObj.militaryObj.wonFlg) {
			this.btPopupMessage = 'Congratulations! Your first win! 3 bonus units were placed on Ukraine for winning! Click "Complete Turn" at the top to continue.';
			setTimeout(() => {
				highlightElementWithArrow('completeTurnButton');
			}, 1000);

			//this.showAlertPopup('Congratulations! Your first win! Click "Complete Turn" at the top to continue.');
			highlightCompleteTurnButton(true);
		}
		if (battleObj.terr == 13 && this.gameObj.currentCampaign == 1 && battleObj.militaryObj.wonFlg) {
			this.showAlertPopup('Congratulations! You have completed your mission and taken over your second capital! This boosts your income by 10 coins per turn. Also capitals come with a free factory. Press "Complete Turn" to end this campaign.');
		}
		if (battleObj.terr == 13 && this.gameObj.currentCampaign == 2 && battleObj.militaryObj.wonFlg) {
			this.showAlertPopup('Congratulations! This boosts your income by 10 coins per turn. Now try to occupy the remaining Russian territories to get an additional 10 coin bonus.');
		}
		if (battleObj.terr == 13 && this.gameObj.currentCampaign == 6 && battleObj.militaryObj.wonFlg) {
			this.showAlertPopup('Congratulations! You now have 2 capitals and your income is boosted by 10 coins per turn. Take over one more capital to win this campaign.');
		}
		if (this.forcedClickNation > 0) {
			console.log('cleared!!');
			this.forcedClickNation = 0;
		}
		this.battleReport = this.getBattleReportFromBattleObj(battleObj);

		if (battleObj.stratBombFlg) {
			popupBattleReport(battleObj, 'stratBombPopup');
		}
		//console.log('!!!2!!!', this.battleReport);
		setTimeout(() => {
			this.cdr.detectChanges();
		}, 300);
		setTimeout(() => {
			popupBattleReport(this.battleReport);
			this.cdr.detectChanges();
		}, 1000);
		if (battleObj.militaryObj.wonFlg) {
			var terr = this.selectedTerritory;
			if (this.bonusInfantryFlg) {
				setTimeout(() => {
					this.addUnitToTerr(terr, 2, false, true);
				}, 2000);
				setTimeout(() => {
					this.addUnitToTerr(terr, 2, false, true);
				}, 3000);
				setTimeout(() => {
					this.addUnitToTerr(terr, 3, false, true);
				}, 4000);
			}
			if (this.bonusFactoryFlg) {
				setTimeout(() => {
					this.addUnitToTerr(terr, 15, false, true);
				}, 3000);
			}
		}
	}
	battleHappened(msg: string) {
		//emitted from terr-popup
		this.cdr.detectChanges();
		if (msg == 'done!') {
			this.completeTurnButtonPressed();
			return;
		}
		if (this.hideActionButton)
			this.hideActionButton = false;
	}
	withdrawGeneralButtonClicked() {
		var terr2;
		this.gameObj.units.forEach(unit => {
			if (unit.piece == 10 && unit.owner == this.currentPlayer.nation && unit.prevTerr > 0) {
				terr2 = this.gameObj.territories[unit.prevTerr - 1];
				localStorage.generalTerr1 = unit.prevTerr;
				localStorage.generalTerr2 = unit.terr;
				unit.terr = unit.prevTerr;
			}
		});
		if (terr2)
			this.moveSpriteFromTerrToTerr(this.selectedTerritory, terr2, 10);
		closePopup('generalWithdrawPopup');
		this.closeModal('#territoryPopup');
	}
	moveSpriteFromTerrToTerr(terr1: any, terr2: any, piece: number) {
		this.moveSpriteBetweenTerrs({ t1: terr1.id, t2: terr2.id, id: piece });
		refreshTerritory(terr1, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
		setTimeout(() => {
			refreshTerritory(terr2, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
		}, 1000);
	}
	getFreeSprite() {
		var name = 'spriteInf1';
		for (var x = 1; x <= 5; x++) {
			name = 'spriteInf' + x;
			var e = document.getElementById(name);
			if (e && e.style.display == 'none')
				return name;
		}
		return name;
	}
	moveSpriteBetweenTerrs(obj: any) {
		// {t1: t1, t2: t2, id: id}
		if (this.gameObj.currentCampaign == 5) {
			if (obj.t2 == 110 && this.gameObj.round == 1) {
				this.forceUserToClickTerritory(107);
				this.showAlertPopup('Good job! Now click on Labrador Sea to move your tranport there.')
			}
			if (obj.t2 == 107 && this.gameObj.round == 1) {
				this.forceUserToClickTerritory(59);
				this.showAlertPopup('Perfect! Now click on Greenland to invade!')
			}
			if (obj.t2 == 110 && this.gameObj.round == 2) {
				this.forceUserToClickTerritory(107);
				this.showAlertPopup('Now click on Labrador Sea to load your heros and 4 infantry.')
			}
			if (obj.t2 == 107 && this.gameObj.round == 2) {
				this.forceUserToClickTerritory(106);
				this.showAlertPopup('Good! Now move all your transports to Quebec Waters.')
			}
			if (obj.t2 == 106) {
				this.forceUserToClickTerritory(58);
				this.showAlertPopup('Perfect! Now click on Quebec to invade!')
			}
		}
		var terr = this.gameObj.territories[obj.t1 - 1];
		var t2 = this.gameObj.territories[obj.t2 - 1];
		var spriteObj = { top1: terr.y, left1: terr.x, top2: t2.y, left2: t2.x, name: 'sprite' };
		//		this.spriteInMotionFlg = true;
		this.spritePieceId = obj.id;
		if (obj.id <= 52)
			playSoundForPiece(obj.id, this.superpowersData);

		if (obj.id == 4 || obj.id == 5 || obj.id == 8 || obj.id == 9 || obj.id == 12 || obj.id == 27 || obj.id == 39 || obj.id == 45 || obj.id == 49) {
			this.spriteShipId = obj.id;
			spriteObj.name = 'spriteShip';
		}

		//if (0 && !this.isDesktopFlg && this.currentPlayer.cpu)
		//	return;

		if (obj.nukeFlg) {
			setTimeout(() => {
				shakeScreen()
				whiteoutScreen();
				playSound('bomb4.mp3');
				this.positionNuke(t2, false);
			}, 1200);
		}
		if (obj.cruiseFlg) {
			setTimeout(() => {
				shakeScreen()
				playSound('bomb4.mp3');
				this.positionNuke(t2, true);
			}, 1200);
		}

		if (obj.id == 14)
			spriteObj.name = 'sprite14';
		if (obj.id == 144)
			spriteObj.name = 'sprite144';
		if (obj.id == 7)
			spriteObj.name = 'sprite7';
		if (obj.id == 2)
			spriteObj.name = this.getFreeSprite();

		var e = document.getElementById(spriteObj.name);
		if (e) {
			if (e.style.display == 'block')
				return;
			e.style.display = 'block';
			e.style.left = (terr.x - 10).toString() + 'px';
			e.style.top = (terr.y + 80).toString() + 'px';
			e.style.height = '30px';
			this.cdr.detectChanges();
			this.ngZone.runOutsideAngular(() => this.moveSprite(100, spriteObj));
		}
	}
	getFlagSprite() {
		if (this.displayOfName('spriteFlg1') != 'block')
			return 'spriteFlg1'
		if (this.displayOfName('spriteFlg2') != 'block')
			return 'spriteFlg2'
		return 'spriteFlg3';
	}
	displayOfName(name: string) {
		var e = document.getElementById(name);
		if (e) {
			return e.style.display;
		} else return
		'block';
	}
	moveFlagBetweenTerrs(obj: any) {
		var terr = this.gameObj.territories[obj.t1 - 1];
		var t2 = this.gameObj.territories[obj.t2 - 1];
		var spriteObj = { top1: terr.y, left1: terr.x, top2: t2.y, left2: t2.x, name: this.getFlagSprite() };
		var e = document.getElementById(spriteObj.name);
		if (e) {
			if (e.style.display == 'block')
				return;
			(<HTMLImageElement>e).src = 'assets/graphics/images/flag' + obj.nation + '.gif';
			e.style.display = 'block';
			e.style.left = (terr.x - 10).toString() + 'px';
			e.style.top = (terr.y + 80).toString() + 'px';
			e.style.height = '30px';
			this.cdr.detectChanges();
			this.ngZone.runOutsideAngular(() => this.moveSprite(100, spriteObj));
		}
	}
	moveSprite(amount: number, spriteObj: any) {
		amount -= 1;
		var range = spriteObj.left1 - spriteObj.left2;
		var left = spriteObj.left2 + range * amount / 100;

		var range2 = spriteObj.top1 - spriteObj.top2;
		var top = spriteObj.top2 + range2 * amount / 100;

		var e = document.getElementById(spriteObj.name);
		if (e) {
			e.style.left = (left - 10).toString() + 'px';
			e.style.top = (top + 80).toString() + 'px';
			if (amount <= 0) {
				//				this.spriteInMotionFlg = false;
				e.style.display = 'none';
				this.cdr.detectChanges();
			} else {
				setTimeout(() => {
					this.moveSprite(amount, spriteObj);
				}, 10);
			}
		}
	}
	/*moveSprite(amount: number, spriteObj: any) {
		amount -= 1;
		var range = spriteObj.left1 - spriteObj.left2;
		var left = spriteObj.left2 + range * amount / 100;
	
		var range2 = spriteObj.top1 - spriteObj.top2;
		var top = spriteObj.top2 + range2 * amount / 100;
	
		var e = document.getElementById(spriteObj.name);
		if (e) {
			e.style.left = (left - 10).toString() + 'px';
			e.style.top = (top + 80).toString() + 'px';
			if (amount <= 0) {
				//				this.spriteInMotionFlg = false;
				e.style.display = 'none';
				this.cdr.detectChanges();
			} else {
				requestAnimationFrame(function(){ // call requestAnimationFrame again with parameters
					moveSprite(amount, spriteObj);
				})
			}
		}
	}*/
	positionNuke(t2: any, cruiseFlg: boolean) {
		this.nukeFrameNum = 1;
		var spriteName = cruiseFlg ? 'cruiseSprite' : 'nukeSprite';
		var e = document.getElementById(spriteName);
		if (e) {
			if (cruiseFlg) {
				e.style.left = (t2.x - 30).toString() + 'px';
				e.style.top = (t2.y + 60).toString() + 'px';
			} else {
				e.style.left = (t2.x - 80).toString() + 'px';
				e.style.top = (t2.y + 10).toString() + 'px';
			}
		}
		this.ngZone.runOutsideAngular(() => this.annimateNuke(1));

	}
	annimateNuke(num: number) {
		if (num > 18) {
			var e = document.getElementById('nukeSprite');
			if (e) {
				e.style.left = '-200px';
			}
			var e2 = document.getElementById('cruiseSprite');
			if (e2) {
				e2.style.left = '-200px';
			}
			return;
		}
		this.nukeFrameNum = num;
		this.cdr.detectChanges();
		setTimeout(() => {
			this.annimateNuke(num + 1);
		}, 160);
	}
	annimateUnit(piece: number, terr: any) {
		playSound('Swoosh.mp3', 0, false);
		if (!this.isDesktopFlg && this.currentPlayer.cpu)
			return;

		if (this.spriteInMotionFlg) {
			return;
		}
		if (piece == 15)
			refreshTerritory(terr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
		this.spriteInMotionFlg = true;
		this.spritePieceId = piece;
		var e = document.getElementById('sprite');
		if (e) {
			e.style.display = 'block';
			e.style.left = terr.x + 'px';
			e.style.top = (terr.y + 100).toString() + 'px';
			e.style.height = '100px';
			this.cdr.detectChanges();
			this.ngZone.runOutsideAngular(() => this.zoomSprite(100));
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
		this.hidePlayersPanelFlag = true;
		//playersPanelMoved();
	}
	eyeButtonPressed() {
		this.hidePlayersPanelFlag = false;
		setTimeout(() => {
			positionPurchasePanel();
		}, 500);
	}
	svgClick() {
	}
	dismissArrow() {
		hideArrow();
	}

	redoPurchase() {
		playClick();
		this.playerSetToPurchaseAndRefresh();
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
		if (this.gameObj.currentCampaign == 1 && this.gameObj.round <= 6 && this.currentPlayer.money >= 5 && this.currentPlayer.status == 'Purchase') {
			showAlertPopup('Spend all of your money. Click on Germany to purchase units.', 1);
			this.forceUserToClickTerritory(7);
			return;
		}
		if (this.forcedClickNation == 62) {
			this.forcedClickMessage();
			return;
		}
		playClick();
		hideArrow();
		changeClass('completeTurnButton', 'btn btn-success roundButton');
		if (this.currentPlayer.status == 'Diplomacy') {
			this.diplomacyModal.show(this.gameObj, this.ableToTakeThisTurn, this.currentPlayer, this.yourPlayer);
			return;
		}
		if (this.currentPlayer.status == 'Purchase') {
			this.completingPurchases();
		} else if (this.currentPlayer.status == 'Attack') {
			this.hideActionButton = false;
			displayFixedPopup('diplomacyWarningPopup');
		} else if (this.currentPlayer.status == 'Place Units')
			this.placeUnitsAndEndTurn();
		this.cdr.detectChanges();
	}
	placeUnitsAndEndTurn() {
		playClick();
		closePopup('actionPopup');
		closePopup('diplomacyWarningPopup');
		this.hideActionButton = false;
		this.gameObj.actionButtonMessage = '';
		this.currentPlayer.status = 'Place Units';
		this.carrierAddedFlg = false;
		var numAddedUnitsToAdd = this.addUnitsToBoard();
		this.cdr.detectChanges();
		setTimeout(() => {
			this.endTurn();
		}, numAddedUnitsToAdd * 95);
	}
	addUnitsToBoard() {
		this.showControls = false;
		var fighterWaterFlg = false;
		this.refreshTerritoryHash = {};
		var newUnits = [];
		for (var x = 0; x < this.gameObj.unitPurchases.length; x++) {
			var unit = this.gameObj.unitPurchases[x];
			newUnits.push(unit);
			this.refreshTerritoryHash[unit.terr] = true;
			if (unit.piece == 8)
				this.carrierAddedFlg = true;
			if (isUnitFighterUnit(unit.piece) && unit.terr >= 79)
				fighterWaterFlg = true;

			var terr = this.gameObj.territories[unit.terr - 1];
			if (unit.piece == 15 || unit.piece == 19) {
				if (terr.facBombed) {
					terr.facBombed = false;
					unit.piece = 0;
				} else {
					if (unit.piece == 15 && terr.factoryCount > 0)
						unit.piece = 19;
				}
			}
			if (unit.piece > 0) {
				this.addUnitToTerr(terr, unit.piece, false, false);
			}
		}
		this.gameObj.unitPurchases = [];

		if (fighterWaterFlg) {
			//this.addFightersToTransports(this.currentPlayer);
		}

		this.purchaseIndex = 0;
		var numAddedUnitsToAdd = 0;
		var lastTerrId = 0;
		newUnits.forEach(purchUnit => {
			numAddedUnitsToAdd++;
			setTimeout(() => {
				if (purchUnit.terr != lastTerrId) {
					if (lastTerrId > 0)
						this.refreshThisTerrId(lastTerrId);
					lastTerrId = purchUnit.terr;
				}
				this.doThisPurchaseUnit(newUnits, this.gameObj);
			}, numAddedUnitsToAdd * 95);
		});

		return numAddedUnitsToAdd;
	}
	refreshThisTerrId(id: number) {
		var terr = this.gameObj.territories[id - 1];
		refreshTerritory(terr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
		this.cdr.detectChanges();
	}
	addFightersToTransports(player: any) {
		this.gameObj.units.forEach(unit => {
			if (unit.owner == player.nation && isUnitFighterUnit(unit.piece) && unit.terr > 79 && numberVal(unit.cargoOf) == 0) {
				var terr = this.gameObj.territories[unit.terr - 1];
				findTransportForThisCargo(unit, terr, this.gameObj);
			}

		});
	}
	doThisPurchaseUnit(newUnits: any, gameObj: any) {
		var unit = newUnits[this.purchaseIndex];
		this.purchaseIndex++;
		var terr = gameObj.territories[unit.terr - 1];
		this.annimateUnit(unit.piece, terr);
		terr.unitCount++;
		terr.displayUnitCount = getDisplayUnitCount(terr, gameObj);
	}
	endTurn() {
		////refreshAllTerritories(this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
		var k = Object.keys(this.refreshTerritoryHash);
		for (var x = 0; x < k.length; x++) {
			var tid = parseInt(k[x]);
			var terr = this.gameObj.territories[tid - 1];
			refreshTerritory(terr, this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
		}
		if (this.carrierAddedFlg && !this.currentPlayer.cpuFlg) {
			this.showControls = true;
			this.gameObj.actionButtonMessage = 'Complete Turn';
			showAlertPopup('New Carrier placed. You can load fighters onto it or press "Complete Turn".', 1);
			return;
		}
		this.uploadMultiplayerFlg = this.gameObj.multiPlayerFlg;
		if (this.gameObj.multiPlayerFlg) {
			startSpinner('Saving...', '150px', 'spinnerOKButton');
			updateProgressBar(30);
		}
		this.currentPlayer.status = 'Waiting';
		//playSound('clink.wav');
		localStorage.generalRetreatObj = '';
		this.currentPlayer.news = [];
		this.currentPlayer.botRequests = [];
		this.currentPlayer.requestedHotSpot = 0;
		this.gameObj.secondsSinceUpdate = 0;
		this.currentPlayer.requestedTarget = 0;

		checkVictoryConditions(this.currentPlayer, this.gameObj, this.superpowersData, this.yourPlayer, this.user);
		addIncomeForPlayer(this.currentPlayer, this.gameObj);
		this.currentPlayer.money += this.currentPlayer.income;
		var damageReport = getDamageReport(this.currentPlayer, this.gameObj, this.superpowersData);
		logItem(this.gameObj, this.currentPlayer, 'Turn Completed', this.currentPlayer.income + ' Coins Collected.', '', '', '', '', damageReport);
		var prevPlayer = this.currentPlayer;
		setTimeout(() => {
			this.warAudio.pause();
		}, 2000);
		if (this.gameObj.gameOver) {
			if (isMusicOn()) {
				this.gameMusic.pause();
				this.endGameMusic.play();
			}

			this.gameObj.actionButtonMessage = '';
			this.ableToTakeThisTurn = false;
			this.hideActionButton = false;
			this.showControls = true;

			saveGame(this.gameObj, this.user, this.currentPlayer, false, true, prevPlayer, 0);
			if (!this.gameObj.multiPlayerFlg) {
				addTestScore(this.gameObj);
				if (this.gameObj.winningTeamFlg && this.gameObj.currentCampaign > 0) {
					var campaignId = localStorage.campaignId || 1;
					var currentRank = this.user.rank || 0;
					var newRank = currentRank;
					if (this.gameObj.currentCampaign >= campaignId) {
						var newCampaignId: number = numberVal(this.gameObj.currentCampaign);
						newCampaignId++;
						localStorage.campaignId = newCampaignId.toString();
					}

					if (currentRank == 0 && this.gameObj.currentCampaign == 1) {
						newRank = 1;
					}
					if (currentRank == 1 && this.gameObj.currentCampaign == 8) {
						newRank = 2;
					}
					if (currentRank <= 2 && this.gameObj.currentCampaign == 10) {
						newRank = 3;
					}
					if (newRank > currentRank) {
						localStorage.rank = newRank;
						this.user.rank = newRank;
						saveUserObj(this.user);
						this.user = userObjFromUser();
						promoteSuperpowersUser(this.user);
						computerAnnouncement(this.user, 'New player ' + this.user.userName + ' just completed ' + this.gameObj.name);
					}
				}
				if (this.gameObj.currentCampaign > 0)
					this.showAlertPopup(this.gameObj.currentSituation);

				clearCurrentGameId();
			}
		} else {
			this.advanceToNextPlayer();
			var sendEmailFlg = (this.gameObj.numPlayers > 3);
			if (this.currentPlayer.cpu || !this.currentPlayer.alive || this.gameObj.turboFlg)
				sendEmailFlg = false;

			var secondsLeft = 0;
			saveGame(this.gameObj, this.user, this.currentPlayer, sendEmailFlg, true, prevPlayer, secondsLeft);
			setTimeout(() => {
				this.gameObj.unitPurchases = [];
				this.loadCurrentPlayer();
			}, 2000);
		}

		this.cdr.detectChanges();
	}
	surrenderConfirmButtonPressed() {
		closePopup('surrenderPopup');
		playClick();
		logItem(this.gameObj, this.currentPlayer, 'Player Surrendered', 'Player has surrendered.');
		this.gameObj.actionButtonMessage = ''
		this.currentPlayer.status = 'Waiting';
		this.ableToTakeThisTurn = false;
		playSound('Scream.mp3');
		playSound('CrowdBoo.mp3');
		var cp = this.currentPlayer.nation;
		setTimeout(() => {
			playVoiceClip('surrendered' + cp + '.mp3');
		}, 3000);

		removeAlliancesForNation(this.currentPlayer.nation, this.gameObj);
		if (this.gameObj.multiPlayerFlg) {
			this.currentPlayer.cpu = true;
			var sp = this.superpowersData.superpowers[this.currentPlayer.nation];
			showAlertPopup(sp + ' has surrendered! The computer will play out the turns from here.');
			this.computerGo();
		} else {
			this.gameObj.gameOver = true;
			this.currentPlayer.alive = false;
			this.gameObj.winningTeamFlg = false;
			addTestScore(this.gameObj, this.currentPlayer);
			this.currentPlayer.cpu = true;
			clearCurrentGameId();
			if (this.gameObj.fogOfWar) {
				this.gameObj.fogOfWar = false;
				refreshAllTerritories(this.gameObj, this.currentPlayer, this.superpowersData, this.yourPlayer);
			}
		}


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
		for (var x = 0; x < this.gameObj.players.length; x++) {
			var player = this.gameObj.players[x];
			if (player.alive || player.nation == this.currentPlayer.nation) {
				if (!nextPlayer) {
					if (found) {
						nextPlayer = player;
					} else {
						if (player.nation == this.currentPlayer.nation)
							found = true;
					}
				}
			}
		}
		if (!nextPlayer) {
			this.gameObj.round++;
			nextPlayer = firstPlayer;
		}
		this.gameObj.turnId = nextPlayer.turn;
		this.currentPlayer = getCurrentPlayer(this.gameObj);
		if (this.currentPlayer.userName == this.user.userName && this.yourPlayer.nation != this.currentPlayer.nation)
			this.yourPlayer = this.currentPlayer;
		this.gameObj.currentNation = this.currentPlayer.nation;
		this.gameObj.actionButtonMessage = '';
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
				this.hideActionButton = false;
				this.removeEMPFromServer();
				this.currentPlayer.empPurchaseRd = this.gameObj.round;
				var terr = this.gameObj.territories[pUnit.terr - 1];
				this.addUnitToTerr(terr, pUnit.piece, false, false);
				player.nukes = true;
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
		var techBought = false;
		k.forEach(function (unitId) {
			var count = unitHash[unitId];
			var piece = gUnits[unitId];
			if (piece.id == 18)
				techBought = true;
			units.push(count + ' ' + piece.name);
		});
		if (techBought) {
			displayFixedPopup('technologyPopup');
			this.cdr.detectChanges();
		}
		this.logItem(player, 'Purchases', units.join(', '));
	}
	removeEMPFromServer() {
		var url = this.getHostname() + "/webSuperpowers.php";
		var postData = this.getPostDataFromObj({ userId: this.user.userId, code: this.user.code, action: 'removeEMP' });

		fetch(url, postData).then((resp) => resp.text())
			.then((data) => {
				if (this.verifyServerResponse(data)) {
					console.log('removeEMPFromServer!', data);
				}
			})
			.catch(error => {
				this.showAlertPopup('Unable to reach server: ' + error, 1);
			});

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
			this.refreshPlayerTerritories(player, this.gameObj, this.superpowersData, this.yourPlayer);
		}
		return num;
	}
	moveAllLargeArmies(gameObj, currentPlayer, superpowersData) {
		currentPlayer.territories.forEach(terr => {
			if (terr.unitCount > 5) {
				var minTroops = 0;
				var range = 5;
				var targetHash = {};
				targetHash[terr.id] = true;
				var target = this.findClosestEnemy(terr, currentPlayer, minTroops, range, null, gameObj, targetHash);
				if (target) {
					var targetHash = {};
					targetHash[terr.id] = true;
					var closestTerr = this.whichLandTerrIsClosest(terr, target, this.gameObj);
					if (closestTerr && closestTerr.owner == currentPlayer.nation) {
						terr.units.forEach(unit => {
							if (isUnitOkToMove(unit, currentPlayer.nation)) {
								unit.terr = closestTerr.id;
								unit.movesLeft = 0;
							}
						});
					}
				}
			}
		});
	}
	whichLandTerrIsClosest(starTerr: any, target: any, gameObj: any) {
		var range = 5;
		var bestTerr;
		starTerr.land.forEach(terrId => {
			var terr = gameObj.territories[terrId - 1];
			var dist = landDistFromTerr(terrId, target.id, 0, this.gameObj);
			if (dist < range) {
				range = dist;
				bestTerr = terr;
			}
		});
		return bestTerr;
	}
	refreshPlayerTerritories(player: any, gameObj: any, superpowersData: any, yourPlayer: any) {
		console.log('refreshPlayerTerritories');
		this.gameObj.territories.forEach(function (terr) {
			if (terr.owner == player.nation) {
				refreshTerritory(terr, gameObj, player, superpowersData, yourPlayer);
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
	ngClassGradient = function () {
		if (this.yourPlayer && this.currentPlayer && this.yourPlayer.nation == this.currentPlayer.nation) {
			if (this.currentPlayer.status == 'Attack')
				return "gradientRed";
			if (this.currentPlayer.status == 'Purchase')
				return "gradientGreen";
		}
		return "gradientBlue";
	}
	ngClassFlag = function (terr, isDesktopFlg) {
		var hover = '';
		if (isDesktopFlg) {
			var flagShadow = ' hoverShadowed';
			if (terr.treatyStatus >= 3)
				flagShadow = ' flagAlly';
			if (terr.treatyStatus == 0)
				flagShadow = ' flagEnemy';
			hover = flagShadow;
		}
		if (terr.capital && terr.id < 79)
			return "flagCapital" + hover;
		else
			return "flag" + hover;
	}
	ngStyleHalo = function (terr, x, y) {
		return { 'top': (terr.y + y).toString() + 'px', 'left': (terr.x + x).toString() + 'px' }
	}
	ngClassHalo = function (terr) {
		var flagShadow = ' haloNone';
		if (terr.treatyStatus >= 3)
			flagShadow = ' haloAlly';
		if (terr.treatyStatus == 0)
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
