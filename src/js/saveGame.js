
function saveGame(gameObj, user, currentPlayer, sendEmailFlg, endOfTurn, prevPlayer, secondsLeft) {
	//return;
	if (!gameObj) {
		showAlertPopup('Error on save game. no gameObj', 1);
		return;
	}
	if(currentPlayer.cpuFlg && !endOfTurn)
		return;
	var userCode = btoa(localStorage.password);
	var user_login = localStorage.userName;
	if (user) {
		userCode = user.code;
		user_login = user.userName;
	}
	if (!currentPlayer) {
		showAlertPopup('Error on save game. no currentPlayer', 1);
		return;
	}
	if (currentPlayer.cpu && !endOfTurn) {
		console.log('cpu, skip save');
		return;
	}
	var updateNation = 0;
	var nextUpdateNation = 0;
	if (currentPlayer) {
		updateNation = currentPlayer.nation;
		nextUpdateNation = currentPlayer.nation;
	}
	if (endOfTurn && prevPlayer) {
		updateNation = prevPlayer.nation;
		nextUpdateNation = currentPlayer.nation;
	}
	console.log('++++++++saveGame2++++++++++', localStorage.gameUpdDt, currentPlayer.cpuFlg);
	//console.log('currentPlayer', currentPlayer);
	//console.log('prevPlayer', prevPlayer);

	if (gameObj.multiPlayerFlg) {
		//		setInnerHTMLFromElement('statusOkButton', 'Wait');
		//		setInnerHTMLFromElement('statusMsg', 'Note: Do not leave page until this completes. Computer make be taking a turn. If it hangs more than 30 seconds, refresh page and try again.');
		gameObj.lastSaved = new Date();
		var obj = objPiecesFrom(gameObj);
		var userName = ''
		if (prevPlayer && prevPlayer.userName)
			userName = prevPlayer.userName;


		var url = this.getHostname() + "/webSaveGame.php";
		var postData = this.getPostDataFromObj({
			user_login: user_login,
			code: userCode,
			userName: userName,
			game_id: gameObj.id,
			pwd: 'none',
			endTurnFlg: (endOfTurn) ? 'Y' : 'N',
			action: 'saveGame',
			objMain: JSON.stringify(obj.objMain),
			logs: JSON.stringify(obj.logs),
			players: JSON.stringify(obj.players),
			territories: JSON.stringify(compressTerritories(obj.territories)),
			units: JSON.stringify(compressUnits(obj.units)),
			turn: currentPlayer.userId,
			income: currentPlayer.income,
			team: currentPlayer.team,
			pStatus: currentPlayer.status,
			round: gameObj.round,
			updateNation: updateNation,
			nextUpdateNation: nextUpdateNation,
			gameUpdDt: localStorage.gameUpdDt,
			secondsLeft: secondsLeft
		});

		fetch(url, postData).then((resp) => resp.text())
			.then((data) => {
				console.log('turn', currentPlayer.userId);
				console.log('income', currentPlayer.income);
				console.log('team', currentPlayer.team);
				console.log('data', data);
				if (verifyServerResponse('success', data)) {
					var items = data.split("|");
					localStorage.setItem("gameUpdDt", items[7]);
					console.log('+sendEmailFlg+', sendEmailFlg);
					if (sendEmailFlg) {
						emailNextPlayer(data, gameObj.name);
					}
					if (!currentPlayer.cpu && endOfTurn) {
						updateStatusMessage('Success!', true);
						disableButton('spinnerOKButton', false);
					}
					//					if (endOfTurn)
					//						zipUpHistoryData(gameObj, user, prevPlayer.nation);
				} else {
					console.log('Error! Unable to sync game with server:', data);
					updateStatusMessage('Error! Unable to sync game with server: ' + data, false);
					showAlertPopup('Warning. Possible sync error. Keep playing but if you continue getting this error, try hitting refresh on your browser.');
				}
			})
			.catch(error => {
				this.showAlertPopup('Unable to reach server: ' + error, 1);
			});
	} else {
		var obj = objPiecesFrom(gameObj);
		localStorage.setItem("gameObj", JSON.stringify(obj.objMain));
		localStorage.setItem("logs", JSON.stringify(obj.logs));
		localStorage.setItem("players", JSON.stringify(obj.players));
		localStorage.setItem("territories", JSON.stringify(compressTerritories(obj.territories)));
		localStorage.setItem("units", JSON.stringify(compressUnits(obj.units)));
		//updateProgressBar(100);
		stopSpinner();
	}
}
function updateStatusMessage(msg, successFlg) {
	setInnerHTMLFromElement('statusMessage', msg);
	updateProgressBar(100);
	var e = document.getElementById("statusImg");
	if (e) {
		if (successFlg) {
			setInnerHTMLFromElement('popupMessage', 'Game Saved');
			//document.getElementById("popupMessage").innerHTML = 'Game Saved';
			disableButton('spinnerOKButton', false);
			e.src = "assets/graphics/misc/green.png";
			setInnerHTMLFromElement('statusMsg', '');
			setInnerHTMLFromElement('statusOkButton', 'OK');
		} else
			e.src = "assets/graphics/misc/red.png";
	}
}
function uploadCompletedGameStats(gameObj, winningNationStr, superpowersData, yourPlayer, user) {
	winningNationStr = winningNationStr.replace(superpowersData.superpowers[1], '1');
	winningNationStr = winningNationStr.replace(superpowersData.superpowers[2], '2');
	winningNationStr = winningNationStr.replace(superpowersData.superpowers[3], '3');
	winningNationStr = winningNationStr.replace(superpowersData.superpowers[4], '4');
	winningNationStr = winningNationStr.replace(superpowersData.superpowers[5], '5');
	winningNationStr = winningNationStr.replace(superpowersData.superpowers[6], '6');
	winningNationStr = winningNationStr.replace(superpowersData.superpowers[7], '7');
	winningNationStr = winningNationStr.replace(superpowersData.superpowers[8], '8');
	console.log('uploadCompletedGameStats', gameObj.id, winningNationStr);

	const url = this.getHostname() + "/web_join_game2.php";
	const postData = this.getPostDataFromObj({ user_login: user.userName, code: user.code, action: 'uploadStats', game_id: gameObj.id, gameData: winningNationStr });
	console.log(postData);

	fetch(url, postData).then((resp) => resp.text())
		.then((data) => {
			console.log(data);
		})
		.catch(error => {
			this.showAlertPopup('Unable to reach server: ' + error, 1);
		});
	/*
	var url = getHostname()+"/web_join_game2.php";
	$.post(url,
	{
		user_login: $scope.user.userName,
		game_id: gameObj.id,
		pwd: $scope.user.password,
		action: 'uploadStats',
		gameData: winningNationStr
	},
	function(data, status){
		stopSpinner();
		console.log(data);
	if(verifyServerResponse(status, data)) {
		showAlertPopup('Game Over! Stats Uploaded.', 1);
	}
	});*/

}
function registerIP(ipCode) {
	/*
	var url = getHostname() + "/webSuperpowers.php";
	$.post(url,
		{
			action: 'registerIP',
			ipCode: ipCode
		},
		function (data, status) {
			//	    	console.log(data);
		});*/
}
function emailNextPlayer(line, gameName) {
	var parts = line.split('|');
	if (parts.length > 1) {
		var textMsg = parts[4];
		if (textMsg && textMsg.length > 0)
			sendEmailToNextPlayer(textMsg, 0, gameName);
		var email = parts[5];
		console.log('emailNextPlayer', textMsg, email, gameName);
		if (email && email.length > 0)
			sendEmailToNextPlayer(email, 0, gameName);
	}
}
function sendEmailToNextPlayer(email, code, gameName) {
	var url = 'https://www.appdigity.com/pages/emailSP.php';
	const postData = this.getPostDataFromObj({ email: email, code: code, gameName: gameName });

	fetch(url, postData).then((resp) => resp.text())
		.then((data) => {
			//			console.log(data);
		})
		.catch(error => {
			this.showAlertPopup('Unable to reach server: ' + error, 1);
		});
}
function compressUnits(units) {
	var unitStr = JSON.stringify(units);
	var compressUnits1 = unitStr.length;
	var unitList = [];
	var x = 0;
	units.forEach(function (unit) {
		if (unit.dead || unit.hp == 0)
			console.log('!!dead unit removed', unit.piece, unit.terr);
		else {
			//			if (unit.piece == 12)
			//				console.log('compressSBC', unit);
			if (unit.piece == 12)
				unitList.push(unit);
			else
				unitList.push({
					id: unit.id,
					movesLeft: unit.movesLeft,
					nation: unit.nation,
					piece: unit.piece,
					terr: unit.terr,
					prevTerr: unit.prevTerr,
					cargoOf: unit.cargoOf,
					cargo: unit.cargo,
					medicRound: unit.medicRound
				});
		}
	});
	unitStr = JSON.stringify(unitList);
	//	console.log('compressUnits: ', compressUnits1, unitStr.length);
	return unitList;
}
function uncompressUnits(units) {
	var unitStr = JSON.stringify(units);
	var gUnits = populateUnits();
	var unitList = [];
	var x = 0;
	units.forEach(function (unit) {
		if (unit.piece != 12) {
			var baseUnit = gUnits[unit.piece];
			unit.adLimit = 2;
			unit.att = baseUnit.att;
			unit.att2 = baseUnit.att;
			unit.cargoSpace = cargoSpaceForPiece(baseUnit);
			unit.realCargoSpace = realCargoSpaceForPiece(baseUnit);
			unit.cargoUnits = cargoUnitsForUnit(baseUnit);
			unit.cas = baseUnit.cas;
			unit.def = baseUnit.def;
			unit.def2 = baseUnit.def;
			unit.hp = 100;
			unit.move = 0;
			unit.moveAtt = baseUnit.move;
			if (unit.piece == 14)
				unit.moveAtt = 2;
			unit.moveAtt2 = unit.moveAtt;
			unit.moveFlg = false;
			unit.mv = baseUnit.move;
			unit.mv2 = baseUnit.move;
			unit.numAtt = baseUnit.numAtt;
			unit.numAtt2 = baseUnit.numAtt;
			unit.numDef = baseUnit.numDef;
			unit.owner = unit.nation;
			unit.returnFlg = baseUnit.returnFlg;
			unit.subType = baseUnit.subType;
			unit.target = baseUnit.target || 'default';
			unit.type = baseUnit.type;
			if (!unit.prevTerr)
				unit.prevTerr = unit.terr;
			if (unit.type == 2) {
				unit.moveAtt /= 2;
				unit.moveAtt2 /= 2;
			}
		}
		unitList.push(unit);
		if (0 && unit.piece == 12) {
			unit.att = 5;
			unit.def = 5;
			unit.numAtt = 3;
			unit.numDef = 3;
			unit.adCount = 2;
			unit.bcHp = 3;
			unit.damage = 0;
			console.log('uncompressSBC', unit);
		}
		x++;
	});
	unitStr = JSON.stringify(unitList);
	return unitList;
}
function compressTerritories(territories) {
	var terrList = [];
	var x = 0;
	territories.forEach(function (terr) {
		terrList.push({
			id: terr.id,
			attackedByNation: terr.attackedByNation,
			attackedRound: terr.attackedRound,
			defeatedByNation: terr.defeatedByNation,
			defeatedByRound: terr.defeatedByRound,
			owner: terr.owner,
			nuked: terr.nuked,
			facBombed: terr.facBombed,
			requestTransfer: terr.requestTransfer
		});
	});
	return terrList;
}
function uncompressTerritories(territories, mainGameType) {
	console.log('here!', mainGameType);
	var gTerrs = getGameTerritories(mainGameType)
	var terrList = [];
	var x = 0;
	territories.forEach(function (terr) {
		var baseTerr = gTerrs[x];
		terr.borders = baseTerr.borders;
		terr.capital = baseTerr.capital;
		terr.holdFlg = false;
		terr.incomingFlg = false;
		terr.land = baseTerr.land;
		terr.name = baseTerr.name;
		terr.nation = baseTerr.nation;
		terr.seaZoneId = baseTerr.seaZoneId;
		terr.seaZoneName = baseTerr.seaZoneName;
		terr.enemyWater = baseTerr.enemyWater;
		terr.enemyZone = baseTerr.enemyZone;
		terr.enemyWater2 = baseTerr.enemyWater2;
		terr.enemyZone2 = baseTerr.enemyZone2;
		terr.homeBase = baseTerr.homeBase;
		terr.water = baseTerr.water;
		terr.x = baseTerr.x;
		terr.y = baseTerr.y;
		terr.units = [];
		terrList.push(terr);
		x++;
	});
	return terrList;
}
function loadSinglePlayerGame() {
	var gameObj = parseSavedGame(localStorage.getItem("gameObj"), localStorage.getItem("logs"), localStorage.getItem("players"), localStorage.getItem("territories"), localStorage.getItem("units"));
	return gameObj;
}
function loadLastSavedGame(multiPlayerFlg) {
	if (multiPlayerFlg) {
		var gameObj = parseSavedGame(localStorage.getItem("gameObj2"), localStorage.getItem("logs2"), localStorage.getItem("players2"), localStorage.getItem("territories2"), localStorage.getItem("units2"));
		return gameObj;
	} else {
		return loadSinglePlayerGame();
	}
}
function loadMultiPlayerGame(data) {
	var c = data.split('|');
	var gameObj = parseSavedGame(c[0], c[1], c[2], c[3], c[4]);

	if (gameObj.name && gameObj.name.indexOf("'") > -1) {
		gameObj.name = gameObj.name.replace("'", "");
	}
	gameObj.gameUpdDt = c[5];
	gameObj.secondsSinceUpdate = c[6];
	gameObj.secondsLeft = c[7];
	gameObj.numPlayers = countPlayers(gameObj.players);
	//console.log('secondsLeft:', gameObj.secondsLeft);
	//console.log('gameObj:', gameObj);
	return gameObj;
}
function countPlayers(players) {
	var playerHash = {};
	var playerCount = 0;
	players.forEach(function (player) {
		if (!playerHash[player.playerId]) {
			playerHash[player.playerId] = true;
			playerCount++;
		}
	});
	if (playerCount > 1)
		return playerCount;
	else
		return players.length;
}
function parseSavedGame(objMain, logs, players, territories, units) {
	var gameObj = {};
	try {
		gameObj = JSON.parse(objMain);
	} catch (e) {
		showAlertPopup2('Error! unable to parse saved game! [objMain]');
	}
	try {
		gameObj.logs = JSON.parse(logs);
	} catch (e) {
		showAlertPopup2('Error! unable to parse saved game! [logs]');
	}
	try {
		gameObj.players = JSON.parse(players);
	} catch (e) {
		showAlertPopup2('Error! unable to parse saved game! [players]');
	}
	try {
		gameObj.territories = uncompressTerritories(JSON.parse(territories), gameObj.mainGameType);
	} catch (e) {
		showAlertPopup2('Error! unable to parse saved game! [territories]');
	}
	try {
		gameObj.units = uncompressUnits(JSON.parse(units));
	} catch (e) {
		console.log(units);
		showAlertPopup2('Error! unable to parse saved game! [units]');
	}
	return gameObj;
}
function objPiecesFrom(gameObj) {
	var objMain = $.extend(true, {}, gameObj);
	//	console.log('XXXXobjPiecesFromXXX', objMain);
	//	var objMain = Object.assign({}, gameObj);
	var obj = new Object;

	obj.logs = objMain.logs;
	var cleanPlayers = [];
	objMain.players.forEach(function (player) {
		var mainBase = player.mainBase;
		var territories = player.territories;
		player.mainBase = {}
		player.territories = []
		cleanPlayers.push(JSON.parse(JSON.stringify(player)));
		player.mainBase = mainBase;
		player.territories = territories;
	});
	obj.players = cleanPlayers;

	var cleanTerritories = [];
	var i = 0;
	objMain.territories.forEach(function (terr) {
		terr.title = '';
		terr.$$hashKey = '';
		cleanTerritories.push(JSON.parse(JSON.stringify(terr)));
	});
	obj.territories = cleanTerritories;
	obj.units = objMain.units;

	objMain.logs = [];
	objMain.players = [];
	objMain.territories = [];
	objMain.units = [];

	//	objMain.teams=[];
	objMain.battles = [];
	obj.objMain = objMain;

	var logId = 0;
	var scrubbedLogs = [];
	gameObj.logs.forEach(function (log) {
		logId++;
		scrubbedLogs.push({ id: log.id, round: log.round, medicHealedCount: log.medicHealedCount, bRounds: log.bRounds, nation: log.nation, enemy: log.enemy, type: log.type, message: log.message, attackingUnits: log.attackingUnits || '', attackingCas: log.attackingCas || '', defendingUnits: log.defendingUnits || '', defendingCas: log.defendingCas || '', t: log.t, o: log.o, ft: log.ft, dr: log.dr });
	});
	obj.logs = scrubbedLogs;
	return obj;
}


