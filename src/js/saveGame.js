function zipUpHistoryData(gameObj, user, nation) {
//	console.log('zipUpHistoryData', nation);
	var historyObj = {};
	historyObj.round=gameObj.round;
	historyObj.nation=nation;
	historyObj.turn=gameObj.turnId;
	var data=[];
	gameObj.territories.forEach(function(terr) {
		var nation = terr.owner;
		var unitCount = terr.unitCount;
		var piece = terr.piece;
		var flag = terr.flag.replace("flag", "");
		flag = flag.replace(".gif", "");
		if(terr.nation==99 && unitCount==0 && nation>0)
			nation=0;
		var line = nation+':'+unitCount+':'+piece+':'+flag;
		if(line=="0:0:0:flag99.gif")
			line="";
		if(flag!="flag99.gif" && unitCount==0 && piece==0)
			line=nation;
		data.push(line);
	});
	historyObj.data=data;
	var dataStr=JSON.stringify(historyObj);

	var url = getHostname()+"/webHistory.php";
	$.post(url,
	{
		user_login: user.userName,
		code: user.code,
		userName: user.userName,
		gameId: gameObj.id,
		round: gameObj.round,
		nation: gameObj.currentNation,
		turn: gameObj.turnId,
		data: dataStr,
		action: 'postHistory',
	},
	function(data, status){
//		console.log('webHistory', data);
	});
	
}
function saveGame(gameObj, user, currentPlayer, sendEmailFlg, endOfTurn, prevPlayer, nextPlayerCPU, secondsLeft) {
//	console.log('+++saveGame+++', currentPlayer);
	if(!endOfTurn && currentPlayer && currentPlayer.cpu) {
		console.log('cpu, skip save');
		return;
	}
	disableButton('redoMovesButton1', true);
	var updateNation = 0;
	var nextUpdateNation = 0;
	if(currentPlayer) {
		updateNation = currentPlayer.nation;
		nextUpdateNation = currentPlayer.nation;
	}
	if(endOfTurn && prevPlayer) {
		updateNation = prevPlayer.nation;
		nextUpdateNation = currentPlayer.nation;
	}

	console.log('+++saveGame localStorage.gameUpdDt+++', localStorage.gameUpdDt, secondsLeft);
	disableButton('redoMovesButton1', true);
	disableButton('redoMovesButton2', true);
	if(gameObj.multiPlayerFlg) {
		console.log('Not saving game!!!!!');
		return;
		setInnerHTMLFromElement('statusOkButton', 'Wait');
		setInnerHTMLFromElement('statusMsg', 'Note: Do not leave page until this completes. Computer make be taking a turn. If it hangs more than 30 seconds, refresh page and try again.');
		if(!user || !currentPlayer) {
			showAlertPopup('Error on save game!!');
			return;
		}
		gameObj.lastSaved = new Date();
		var obj = objPiecesFrom(gameObj);
		localStorage.setItem("gameObj2", JSON.stringify(obj.objMain));
		localStorage.setItem("logs2", JSON.stringify(obj.logs));
		localStorage.setItem("players2", JSON.stringify(obj.players));
		localStorage.setItem("territories2", JSON.stringify(compressTerritories(obj.territories)));
		localStorage.setItem("units2", JSON.stringify(compressUnits(obj.units)));
		var url = getHostname()+"/webSaveGame.php";
//		var url = getHostname()+"/web_join_game2.php";
		var userName = ''
		if(prevPlayer && prevPlayer.userName)
			userName=prevPlayer.userName;
		$.post(url,
		{
			user_login: user.userName,
			code: user.code,
			userName: userName,
			game_id: gameObj.id,
			pwd: 'none',
			endTurnFlg: (endOfTurn)?'Y':'N',
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
		},
		function(data, status){
//			console.log('response: ', data);
			if(verifyServerResponse(status, data)) {
				var items = data.split("|");
				localStorage.setItem("gameUpdDt", items[7]);
				console.log('+++gameUpdDt+++', localStorage.gameUpdDt);
//				disableButton('spinnerOKButton', false);
				if(sendEmailFlg) {
					emailNextPlayer(data, gameObj.name);
				}
				if(!nextPlayerCPU && endOfTurn) {
					updateStatusMessage('Success!', true);
				}
				if(endOfTurn)
					zipUpHistoryData(gameObj, user, prevPlayer.nation);
			} else {
				updateStatusMessage('Error! Unable to sync game with server: '+data, false);
				showAlertPopup('Warning. Possible sync error. Keep playing but if you continue getting this error, try hitting refresh on your browser.');
			}
		});
	} else {
		var obj = objPiecesFrom(gameObj);
		localStorage.setItem("gameObj", JSON.stringify(obj.objMain));
		localStorage.setItem("logs", JSON.stringify(obj.logs));
		localStorage.setItem("players", JSON.stringify(obj.players));
		localStorage.setItem("territories", JSON.stringify(compressTerritories(obj.territories)));
		localStorage.setItem("units", JSON.stringify(compressUnits(obj.units)));
	}
}
function updateStatusMessage(msg, successFlg) {
	setInnerHTMLFromElement('statusMessage', msg);
	updateProgressBar(100);
	var e = document.getElementById("statusImg");
	if(e) {
		if(successFlg) {
			disableButton('spinnerOKButton', false);
			e.src="graphics/misc/green.png";
			setInnerHTMLFromElement('statusMsg', 'Done');
			setInnerHTMLFromElement('statusOkButton', 'OK');
		} else
			e.src="graphics/misc/red.png";
	}
}
function registerIP(ipCode) {
	var url = getHostname()+"/webSuperpowers.php";
	    $.post(url,
	    {
	        action: 'registerIP',
	        ipCode: ipCode
	    },
	    function(data, status){
//	    	console.log(data);
	    });
}
function emailNextPlayer(line, gameName) {
	var parts = line.split('|');
	if(parts.length>1) {
		var textMsg = parts[4];
		if(textMsg && textMsg.length>0)
			sendEmailToNextPlayer(textMsg, 0, gameName);
		var email = parts[5];
		if(email && email.length>0)
			sendEmailToNextPlayer(email, 0, gameName);
	}
}
function sendEmailToNextPlayer(email, code, gameName) {
//	startSpinner('Sending...', '150px');
	var url = 'http://www.appdigity.com/pages/emailSP.php';
    $.post(url,
    {
        email: email,
        code: code,
        gameName: gameName
    },
    function(data, status){
 //   	console.log(data);
//    	stopSpinner();
    });
}
function compressUnits(units) {
	var unitStr=JSON.stringify(units);
	var compressUnits1 = unitStr.length;
	var unitList = [];
	var x=0;
	units.forEach(function(unit) {
		if(unit.dead || unit.hp==0)
			console.log('!!dead unit removed', unit.piece, unit.terr);
		else {
			if(unit.piece==12)
				console.log('compressSBC', unit);
			if(unit.piece==12)
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
	unitStr=JSON.stringify(unitList);
//	console.log('compressUnits: ', compressUnits1, unitStr.length);
	return unitList;
}
function uncompressUnits(units) {
	var unitStr=JSON.stringify(units);
	var gUnits=populateUnits();
	var unitList=[];
	var x=0;
	units.forEach(function(unit) {
		if(unit.piece!=12) {
			var baseUnit=gUnits[unit.piece];
			unit.adLimit=2;
			unit.att=baseUnit.att;
			unit.att2=baseUnit.att;
			unit.cargoSpace=cargoSpaceForPiece(baseUnit);
			unit.cargoUnits=cargoUnitsForPiece(baseUnit);
			unit.cas=baseUnit.cas;
			unit.def=baseUnit.def;
			unit.def2=baseUnit.def;
			unit.hp=100;
			unit.move=0;
			unit.moveAtt=baseUnit.move;
			if(unit.piece==14)
				unit.moveAtt=2;
			unit.moveAtt2=unit.moveAtt;
			unit.moveFlg=false;
			unit.mv=baseUnit.move;
			unit.mv2=baseUnit.move;
			unit.numAtt=baseUnit.numAtt;
			unit.numAtt2=baseUnit.numAtt;
			unit.numDef=baseUnit.numDef;
			unit.owner=unit.nation;
			unit.returnFlg=baseUnit.returnFlg;
			unit.subType=baseUnit.subType;
			unit.target=baseUnit.target || 'default';
			unit.type=baseUnit.type;
			if(!unit.prevTerr)
				unit.prevTerr=unit.terr;
			if(unit.type==2) {
				unit.moveAtt/=2;
				unit.moveAtt2/=2;
			}
		}
		unitList.push(unit);
		if(0 && unit.piece==12) {
			unit.att=5;
			unit.def=5;
			unit.numAtt=3;
			unit.numDef=3;
			unit.adCount=2;
			unit.bcHp=3;
			unit.damage=0;
			console.log('uncompressSBC', unit);
		}
		x++;
	});
	unitStr=JSON.stringify(unitList);
	return unitList;
}
function compressTerritories(territories) {
	var terrList=[];
	var x=0;
	territories.forEach(function(terr) {
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
function uncompressTerritories(territories) {
	var gTerrs=getGameTerritories()
	var terrList=[];
	var x=0;
	territories.forEach(function(terr) {
		var baseTerr=gTerrs[x];
		terr.borders=baseTerr.borders;
		terr.capital=baseTerr.capital;
		terr.holdFlg=false;
		terr.incomingFlg=false;
		terr.land=baseTerr.land;
		terr.name=baseTerr.name;
		terr.nation=baseTerr.nation;
		terr.seaZoneId=baseTerr.seaZoneId;
		terr.seaZoneName=baseTerr.seaZoneName;
		terr.enemyWater=baseTerr.enemyWater;
		terr.enemyZone=baseTerr.enemyZone;
		terr.enemyWater2=baseTerr.enemyWater2;
		terr.enemyZone2=baseTerr.enemyZone2;
		terr.homeBase=baseTerr.homeBase;
		terr.water=baseTerr.water;
		terr.x=baseTerr.x;
		terr.y=baseTerr.y;
		terr.units=[];
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
	if(multiPlayerFlg) {
		var gameObj = parseSavedGame(localStorage.getItem("gameObj2"), localStorage.getItem("logs2"), localStorage.getItem("players2"), localStorage.getItem("territories2"), localStorage.getItem("units2"));
		return gameObj;
	} else {
		return loadSinglePlayerGame();
	}
}
function loadMultiPlayerGame(data) {
//	console.log('loadMultiPlayerGame...');
	var c = data.split('|');
	var gameObj = parseSavedGame(c[0], c[1], c[2], c[3], c[4]);
	if (gameObj.name.indexOf("'") > -1) {
	  gameObj.name = gameObj.name.replace("'", "");
	}
	gameObj.gameUpdDt=c[5];
	gameObj.secondsSinceUpdate=c[6];
	gameObj.secondsLeft=c[7];
	console.log('secondsLeft:', gameObj.secondsLeft);
	console.log('gameObj:', gameObj);
	return gameObj;
}
function parseSavedGame(objMain, logs, players, territories, units) {
	var gameObj={};
	try {
		gameObj=JSON.parse(objMain);
	} catch(e) {
		showAlertPopup2('Error! unable to parse saved game! [objMain]');
	}
	try {
		gameObj.logs=JSON.parse(logs);
	} catch(e) {
		showAlertPopup2('Error! unable to parse saved game! [logs]');
	}
	try {
		gameObj.players=JSON.parse(players);
	} catch(e) {
		showAlertPopup2('Error! unable to parse saved game! [players]');
	}
	try {
		gameObj.territories=uncompressTerritories(JSON.parse(territories));
	} catch(e) {
		showAlertPopup2('Error! unable to parse saved game! [territories]');
	}
	try {
		gameObj.units=uncompressUnits(JSON.parse(units));
	} catch(e) {
		console.log(units);
		showAlertPopup2('Error! unable to parse saved game! [units]');
	}
	return gameObj;
}
function objPiecesFrom(gameObj) {
	var objMain = $.extend(true,{},gameObj);
//	console.log('XXXXobjPiecesFromXXX', objMain);
//	var objMain = Object.assign({}, gameObj);
	var obj = new Object;
	
	obj.logs=objMain.logs;
	var cleanPlayers=[];
	objMain.players.forEach(function(player) {
		var mainBase=player.mainBase;
		var territories=player.territories;
		player.mainBase={}
		player.territories=[]
		cleanPlayers.push(JSON.parse(JSON.stringify(player)));
		player.mainBase=mainBase;
		player.territories=territories;
	});
	obj.players=cleanPlayers;
	
	var cleanTerritories=[];
	var i=0;
	objMain.territories.forEach(function(terr) {
		terr.title='';
		terr.$$hashKey='';
		cleanTerritories.push(JSON.parse(JSON.stringify(terr)));
	});
	obj.territories=cleanTerritories;
	obj.units=objMain.units;	
	
	objMain.logs=[];
	objMain.players=[];
	objMain.territories=[];
	objMain.units=[];

//	objMain.teams=[];
	objMain.battles=[];
	obj.objMain=objMain;
	
	var logId=0;
	var scrubbedLogs=[];
	gameObj.logs.forEach(function(log) {
		logId++;
		scrubbedLogs.push({id: log.id, round: log.round, medicHealedCount: log.medicHealedCount, bRounds: log.bRounds, nation: log.nation, enemy: log.enemy, type: log.type, message: log.message, attackingUnits: log.attackingUnits||'', attackingCas: log.attackingCas||'', defendingUnits: log.defendingUnits||'', defendingCas: log.defendingCas||'', t: log.t, o: log.o, ft: log.ft, dr: log.dr});
	});
	obj.logs=scrubbedLogs;
	return obj;
}
function setLoadGameId(gameId) {
	localStorage.loadGameId=gameId;
	if(gameId==0)
		localStorage.removeItem('loadGameId');
}

