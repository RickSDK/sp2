function hideArrow() {
	var e = document.getElementById('arrow');
	if (e && e.style.display == 'block')
		e.style.display = 'none';

	var e2 = document.getElementById('chatMessagesPopup');
	if (e2 && e2.style.display == 'block')
		e2.style.display = 'none';

	changeClass('chatMessagesPopup', 'popupMsg off');
}
function refreshBoard(terrs) {
	terrs.forEach(function (terr) {
		var e = document.getElementById('terr' + terr.id);
		e.style.left = (terr.x - 20).toString() + 'px';
		e.style.top = (terr.y + 80).toString() + 'px'; //25
		var f = document.getElementById('flag' + terr.id);
		f.src = 'assets/graphics/images/' + (terr.flag || 'flag1.gif');
		if (terr.nation == 99 && terr.owner == 0) {
			if (isMobile())
				f.style.opacity = .3; // see also flagOfOwner in app.js
			else
				f.style.opacity = .2; // see also flagOfOwner in app.js
		}
	});
}
function playersPanelMoved() {
	var left = window.innerWidth - 55;
	var e = document.getElementById("sidelinePopup");
	if (e) {
		var left = window.innerWidth - 55;
		if (left > 1282)
			left = 1282;
		var currentLeft = numberVal(e.style.left.replace('px', ''));
		if (currentLeft == 0)
			e.style.left = left + 'px';
		else
			e.style.left = '0';
	}
}
function getCurrentPlayer(gameObj) {
	if (!gameObj || !gameObj.players || gameObj.players.length == 0)
		return null;
	var turnId = gameObj.turnId;
	var player = gameObj.players[0];
	gameObj.players.forEach(function (p) {
		if (p.id == turnId)
			player = p;
	});
	gameObj.turnId = player.id;
	return player;
}
function scrubGameObj(gameObj, gUnits) {
	gameObj.players.forEach(function (player) {
		if (player.userName == gameObj.top1)
			gameObj.top1Nation = player.nation;
		if (player.userName == gameObj.top2)
			gameObj.top2Nation = player.nation;
		scrubUnitsOfPlayer(player, gameObj, gUnits);
	});
	gameObj.gamePoints = gamePointsForType(gameObj.type, gameObj.mmFlg);
	if (gameObj.gameOver)
		gameObj.fogOfWar = 'N';
	if (!gameObj.unitPurchases)
		gameObj.unitPurchases = [];
}
function scrubUnitsOfPlayer(player, gameObj, gUnits) {
	var railway = player.tech[19];

	var stealth = player.tech[0];
	var mav = player.tech[1];
	var radar = player.tech[2];

	var rocket = player.tech[3];
	var chem = player.tech[4];
	var anthrax = player.tech[5];

	var torpedoes = player.tech[6];

	var heavy = player.tech[12];
	var smart = player.tech[13];
	var nukes = player.tech[14];

	var range = player.tech[15];
	var mobility = player.tech[17];

	player.cruiseButton = (player.nation == 4 || player.tech[7]);
	var stratBombButton = false;
	gameObj.units.forEach(function (unit) {
		if (unit.nation == player.nation && unit.piece != 12) {
			unit.name = gUnits[unit.piece].name;
			unit.medicRound = numberVal(unit.medicRound);
			unit.dice = [];
			if (unit.piece == 7)
				stratBombButton = true;
			unit.att = unit.att2;
			unit.numAtt = unit.numAtt2;
			unit.def = unit.def2;
			unit.mv = unit.mv2;
			unit.moveAtt = unit.moveAtt2;

			if (unit.piece == 23) {
				unit.moveAtt2 = 2;
				unit.moveAtt = 2;
			}
			if (unit.piece == 28 && $scope.gameObj.round <= unit.medicRound + 1)
				unit.movesLeft = 0;
			if (unit.piece == 44)
				unit.adLimit = 0;
			if (player.tech[0]) {				//stealth
				if (unit.subType == 'fighter') {
					unit.def = unit.def2 + 1;
					unit.adLimit = 0;
					if (unit.piece == 23)
						unit.adLimit = 1;
				}
				if (unit.subType == 'chopper') {
					unit.adLimit = 1;
				}
			}
			if (player.tech[1]) {				//AGM Maverick
				if (unit.piece == 6 || unit.piece == 35 || unit.piece == 47 || unit.piece == 48) {
					unit.target = 'vehicles';
				}
			}
			if (player.tech[2]) {					//Radar
				if (unit.subType == 'fighter' || unit.piece == 47) {
					unit.target = 'planesTanks';
				}
				if (unit.subType == 'bomber') {
					unit.adLimit = 1;
				}
			}
			if (unit.piece == 14 && player.tech[3])	//rocketry
				unit.moveAtt = 3;
			if (unit.piece == 14 && player.tech[4])	//chemical
				unit.moveAtt = 4;
			if (player.tech[5]) {	//Antrax
				//anthrax
				if (unit.piece == 14)
					unit.moveAtt = 5;
				if (unit.piece == 34 || unit.piece == 35 || unit.piece == 36 || unit.piece == 37 || unit.piece == 40 || unit.piece == 25 || unit.piece == 46)
					unit.numAtt = unit.numAtt2 + 1;
				if (unit.piece == 42)
					unit.numAtt = unit.numAtt2 + 2;
			}

			if (unit.subType == 'vehicle' && unit.returnFlg && player.tech[3]) { //rocketry
				unit.numAtt = unit.numAtt2 + 1;
			}
			if (unit.subType == 'vehicle' && unit.returnFlg && player.tech[4]) { //chemical
				unit.numAtt = unit.numAtt2 + 2;
			}
			if (unit.subType == 'vehicle' && unit.returnFlg && player.tech[5]) { //Antrax
				unit.numAtt = unit.numAtt2 + 3;
			}
			if (unit.piece == 47)
				unit.numAtt = 1; // laser
			if (player.tech[6]) {					//torpedoes
				if (unit.piece == 5 || unit.piece == 49) {
					unit.att++;
					unit.def++;
				}
			}
			if (unit.subType == 'bomber' && player.tech[12])	//heavy bombers
				unit.numAtt = 2;
			if (unit.subType == 'fighter' && player.tech[13])	//smart bombers
				unit.att++;
			if (unit.subType == 'bomber' && player.tech[13])
				unit.att = 5;
			if (player.tech[14]) {				//nuclear warheads
				if (unit.subType == 'bomber' || unit.piece == 48 || unit.piece == 50)
					unit.numAtt++;
			}
			if (unit.type == '2' && player.tech[15]) {	// range
				unit.mv = unit.mv2 + 2;
				unit.moveAtt = unit.moveAtt2 + 1;
			}
			if (unit.piece == 36 && player.tech[15]) { //apache
				unit.mv = 3;
				unit.moveAtt = 3;
			}
			if (unit.piece == 3 && player.tech[17]) {	//mobility
				unit.moveAtt = 3;
			}
			if (unit.piece == 2 && player.tech[17]) {
				unit.moveAtt = 2;
			}
			if (unit.type == 1 && player.tech[19]) { // railway
				unit.mv = unit.mv2 + 1;
			}
			//----- old

			if (unit.type == 2 && mav)
				unit.target = 'vehicles';
			if (unit.piece == 6 && radar)
				unit.target = 'planesTanks';
			if (unit.piece == 23)
				unit.target = 'kamakazi';
			if (unit.piece == 5 && torpedoes)
				unit.def = 3;
			if (unit.piece == 10 && unit.nation == 2) { //EU
				unit.att = 5;
				unit.mv = 2;
				unit.mv2 = 2;
				unit.moveAtt = 2;
				if (player.tech[19])
					unit.mv = 3;
			}
			if (unit.piece == 10 && unit.nation == 3) {	//Russia
				unit.att = 4;
			}
			if (unit.piece == 10 && unit.nation == 5) { //China
				unit.numAtt = 5;
				unit.att = 2;
				if (player.tech[3])
					unit.numAtt++;
				if (player.tech[4])
					unit.numAtt++;
				if (player.tech[5])
					unit.numAtt++;
			}
			if (unit.piece == 10 && unit.nation == 7) {  //Africa
				unit.numDef = 3;
				unit.def = 3;
				unit.att = 3;
				unit.att2 = 3;
				unit.numAtt = 3;
			}
			if (unit.piece == 10 && unit.nation == 8) { //LA
				unit.numDef = 3;
				unit.def = 5;
				unit.att = 4;
				unit.att2 = 4;
			}
		}
	});
	player.stratBombButton = stratBombButton;
}
function getYourPlayer(gameObj, userName) {
	var humanPlayer;
	for (var x = 0; x < gameObj.players.length; x++) {
		var player = gameObj.players[x];
		if (!gameObj.multiPlayerFlg && !player.cpu) {
			humanPlayer = player;
			//			if (gameObj.currentNation == player.nation)
			//				return player;
		}
		if (gameObj.multiPlayerFlg && player.userName == userName)
			return player;
	}
	return humanPlayer;
}
function highlightCapital(nation) {
	var ids = [1,1,7,13,21,28,35,42,50];
//	highlightTerritory(ids[nation], nation, true);
	var obj = capitalXY(nation);
	var e = document.getElementById('arrow');
	e.style.display='block';
	e.style.position='absolute';
	e.style.left=(obj.x-40).toString()+'px';
	e.style.top=(obj.y+140).toString()+'px';
}

function refreshTerritory(terr, gameObj, gUnits, currentPlayer, superpowers, yourPlayer, cleanDice = false) {
	if(!gameObj)
		console.log('!!!! no gameObj!!');
	var unitCount = 0;
	var highestPiece = 0;
	var adCount = 0;
	terr.generalFlg = false;
	terr.leaderFlg = false;
	var attStrength = 0;
	var defStrength = 0;
	var cargoUnits = 0;
	var cargoSpace = 0;
	var amphibAtt = 0;
	var factoryCount = 0;
	var superBC = false;
	var shipAttack = 0;
	var shipDefense = 0;
	var transportCount = 0;
	var transportCargo = 0;
	var transportSpace = 0;
	var carrierCargo = 0;
	var carrierSpace = 0;
	var destroyerCount = 0;
	var bomberCount = 0;
	var paratrooperCount = 0;
	var infParatrooperCount = 0;
	var cargoTypeUnits = 0; // groundUnits & fighters
	var unloadedCargo = [];
	var strandedCargo = [];
	var superBSStats = '';
	var defendingFighterId = 0;
	var battleshipAACount = 0;
	var cobraCount = 0;

	var unitHash = {};
	var unitIdHash = {};
	var flagHash = {};
	flagHash[terr.owner] = 1;
	var pieces = [];
	var nukeCount = 0;
	var unitOwner = 0;
	var groundForce = 0;
	var anyPiece = 0;
	var includesCargoFlg = false;
	var totalUnitCount = 0;
	var leaderOwner = terr.owner;
	var enemyPiecesExist = false;
	gameObj.units.forEach(function (unit) {
		if (unit.terr == terr.id && !unit.moving) {
			if (currentPlayer && unit.owner != terr.owner && !enemyPiecesExist) {
				if (currentPlayer.treaties[unit.owner - 1] == 0)
					enemyPiecesExist = true;
			}
			totalUnitCount++;
			if (unit.piece == 9)
				battleshipAACount++;
			if (unit.subType == 'fighter')
				defendingFighterId = unit.piece;
			if (unit.piece > anyPiece)
				anyPiece = unit.piece;
			flagHash[unit.owner] = 1;
			if (unit.cargoOf && unit.cargoOf > 0)
				includesCargoFlg = true;
			if (currentPlayer && unit.type == 3 && unit.owner == currentPlayer.nation)
				gameObj.loadBoatsFlg = true;
			if (cleanDice)
				unit.dice = [];
			if (unit.def > 0)
				pieces.push(unit.piece);
			if (terr.id < 79 && unit.cargoOf && unit.cargoOf > 0)
				paratrooperCount++;
			if (terr.id < 79 && unit.cargoOf && unit.cargoOf > 0 && unit.piece == 2)
				infParatrooperCount++;

			var sp = '';
			if (unit.owner != terr.owner)
				sp = ' (' + superpowers[unit.owner] + ')';
			var unitName = gUnits[unit.piece].name + sp;
			var count = unitHash[unitName] || 0;
			count++;
			unitHash[unitName] = count;

			var unitName2 = gUnits[unit.piece].name;
			var count2 = unitIdHash[unit.piece] || 0;
			count2++;
			unitIdHash[unit.piece] = count2;

			attStrength += unit.att;
			defStrength += unit.def;
			if (unitOwner > 0 && unitOwner != terr.owner && unit.owner == terr.owner)
				unitOwner = terr.owner;
			if (unitOwner == 0)
				unitOwner = unit.owner;
			if (unit.piece == 50)
				cobraCount++;
			if (unit.piece == 7 || unit.piece == 50)
				bomberCount++;
			if (unit.piece == 12) {
				superBC = true;
				adCount += unit.adCount;
				var stats = [];
				stats.push('Name: ' + unit.sbName || unit.name);
				stats.push('Attack: ' + unit.att);
				stats.push('Defend: ' + unit.def);
				stats.push('# att: ' + unit.numAtt);
				stats.push('# def: ' + unit.numDef);
				stats.push('Air Defense: ' + unit.adCount);
				stats.push('HP: ' + unit.bcHp);
				stats.push('Damage: ' + unit.damage);
				superBSStats = stats.join('\n');
			}
			if (unit.piece == 2 || unit.piece == 3)
				groundForce += unit.att;
			if (isUnitAirDefense(unit))
				adCount++;
			if (unit.piece == 40)
				adCount++; // 2 for this piece
			if (unit.piece == 15 || unit.piece == 19)
				factoryCount++;
			if (unit.piece == 4) {
				transportCount++;
				transportSpace += 4;
			}
			if (unit.piece == 45) {
				transportCount++;
				transportSpace += 4;
			}
			if (unit.piece == 49) {
				transportCount++;
				transportSpace++;
			}
			if (unit.piece == 8 && unit.owner == terr.owner) {
				carrierSpace += 2;
			}
			if (unit.subType == 'fighter' && unit.owner == terr.owner)
				carrierCargo++;
			if (unit.subType == 'vehicle')
				transportCargo += 2;
			if (unit.subType == 'soldier')
				transportCargo++;
			if (unit.piece > highestPiece && (terr.nation < 99 || unit.type == 3 || unit.type == 4))
				highestPiece = unit.piece;
			if (terr.nation == 99) {
				if (unit.subType == 'fighter' && unit.cargoOf > 0) {
					var carrierTerr = getTerrOfUnitId(unit.cargoOf);
					if (carrierTerr > 0 && unit.terr != carrierTerr) {
						showAlertPopup('Unloaded Fighter. Fixing.');
						unit.terr = carrierTerr;
					}
				}
				if (unit.type == 1 || unit.subType == 'fighter') {
					cargoTypeUnits++;
					if (unit.terr == terr.id)
						strandedCargo.push(unit);
				}
				if (unit.type == 1 || unit.type == 2) {
					if (numberVal(unit.cargoOf) == 0) {
						unloadedCargo.push(unit);
					}
				}
				if (unit.type == 3)
					cargoSpace += unit.cargoSpace;
				if (unit.type == 3 || unit.type == 2) {
					shipAttack += unit.att;
					shipDefense += unit.def;
				}
				if (unit.type == 1) {
					amphibAtt += unit.att;
					cargoUnits += unit.cargoUnits;
				}
			}
			if (unit.piece == 27)
				destroyerCount++;
			if (unit.piece == 14)
				nukeCount++;
			if (unit.piece == 10)
				terr.generalFlg = true;
			if (unit.piece == 28)
				includesCargoFlg = true; //show medic details
			if (unit.piece == 11) {
				leaderOwner = unit.owner;
				terr.leaderFlg = true;
			}
			if (unit.piece != 13 && unit.piece != 15 && unit.piece != 19 && unit.piece != 44)
				unitCount++;
		}
	});
	if (terr.defeatedByNation > 0 && numberVal(terr.defeatedByRound) < gameObj.round - 1) {
		terr.defeatedByNation = 0;
	}
	terr.enemyPiecesExist = enemyPiecesExist;
	terr.totalUnitCount = totalUnitCount;
	terr.battleshipAACount = battleshipAACount;
	if (unitOwner > 0 && terr.owner == 0)
		terr.owner = unitOwner;
	if (unitOwner > 0 && unitOwner != terr.owner && terr.id >= 79)
		terr.owner = unitOwner;
	if (factoryCount > 1 && terr.facBombed)
		terr.facBombed = false;
	if (gameObj.airDefenseTech[terr.owner] && terr.id < 79)
		adCount++;
	terr.defendingUnits = pieces.join('+');
	var results = [];
	var militaryUnits = [];
	var keys = Object.keys(unitHash);
	for (x = 0; x < keys.length; x++) {
		var piece = keys[x];
		results.push(unitHash[piece] + ' ' + piece);
	}
	var keys2 = Object.keys(unitIdHash);
	for (x = 0; x < keys2.length; x++) {
		var piece = keys2[x];
		var amount = unitIdHash[piece];
		militaryUnits.push({ 'name': gUnits[piece].name, amount: amount, piece: piece, owner: leaderOwner });
	}
	var keys3 = Object.keys(flagHash);
	var flags = [];
	for (x = 0; x < keys3.length; x++) {
		var k = keys3[x];
		flags.push(k);
	}
	terr.cobraCount = cobraCount;
	terr.flags = flags;
	terr.showUnitDetailFlg = (includesCargoFlg || flags.length > 1);
	terr.cargoTypeUnits = cargoTypeUnits;
	terr.unloadedCargo = unloadedCargo;
	terr.infParatrooperCount = infParatrooperCount;
	terr.paratrooperCount = paratrooperCount;
	terr.transportCargo = transportCargo;
	terr.transportSpace = transportSpace;
	terr.carrierCargo = carrierCargo;
	terr.carrierSpace = carrierSpace;
	terr.destroyerCount = destroyerCount;
	terr.superBC = superBC;

	terr.nukeCount = nukeCount;
	terr.shipAttack = shipAttack;
	terr.shipDefense = shipDefense;
	terr.transportCount = transportCount;
	terr.factoryCount = factoryCount;
	terr.bomberCount = bomberCount;
	terr.amphibAtt = amphibAtt;
	terr.cargoUnits = cargoUnits;
	terr.cargoSpace = cargoSpace;
	terr.attStrength = attStrength;
	terr.defStrength = defStrength;
	terr.groundForce = groundForce;
	terr.adCount = adCount;
	terr.unitCount = unitCount;

	var status = 1;
	if (yourPlayer && yourPlayer.nation > 0)
		status = treatyStatus(yourPlayer, terr.owner);

	var showDetailsFlg = (gameObj.fogOfWar != 'Y' || status > 2);

	if (strandedCargo.length == 0)
		terr.strandedCargo = [];
	if (terr.id >= 79 && terr.cargoTypeUnits > 0) {
		if (terr.cargoTypeUnits == terr.unitCount)
			terr.strandedCargo = strandedCargo;
		else if (terr.cargoUnits > terr.cargoSpace)
			terr.strandedCargo = strandedCargo;
	}
	var flag = flagOfOwner(terr.owner, terr, showDetailsFlg, totalUnitCount, terr.defeatedByNation, terr.nuked, terr.attackedByNation);
	terr.flag = flag;
	if (gameObj.historyMode) {
		terr.flag = flagOfOwner(terr.histOwner, terr, false, totalUnitCount, terr.histDefeatedByNation, terr.histNuked, terr.attackedByNation);
		return;
	}

	var userName = 'Neutral';
	if (terr.owner > 0) {
		var player = playerOfNation(terr.owner, gameObj);
		if (!gameObj.multiPlayerFlg && !player.cpu && gameObj.currentNation == terr.owner) {
			status = 3; // all humans can see
		}
		if (player && player.userName) {
			userName = player.userName;
			terr.shieldTech = player.tech[18];
		}
		if (!player.tech[2])
			defendingFighterId = 0;

		cleanupTerr(terr, player);
	}

	terr.fogOfWar = (gameObj.fogOfWar == 'Y' && numberVal(status) < 3);
	if (terr.fogOfWar)
		results = ['-fog of war-'];
	var unitStr = (terr.unitCount == 1) ? 'unit' : 'units';
	if (factoryCount == 0 && defendingFighterId > 0)
		defendingFighterId = 0;
	terr.defendingFighterId = defendingFighterId;
	terr.militaryUnits = results;
	terr.militaryUnits2 = militaryUnits;
	if (terr.factoryCount == 1) {
		if (adCount == 0)
			highestPiece = 100;
		if (adCount == 1)
			highestPiece = 101;
		if (adCount == 2)
			highestPiece = 102;
		if (adCount > 2)
			highestPiece = 104;
	}
	if (terr.factoryCount > 1) {
		if (adCount == 0)
			highestPiece = 110;
		if (adCount == 1)
			highestPiece = 111;
		if (adCount == 2)
			highestPiece = 112;
		if (adCount > 2)
			highestPiece = 113;
	}
	if (terr.facBombed)
		highestPiece = 103;
	if (terr.superBC)
		highestPiece = 12;
	if (highestPiece == 0)
		highestPiece = anyPiece;
	if (highestPiece == 0 && terr.unitCount > 0) {
		highestPiece = (terr.nation < 99) ? 2 : 4;
		console.log('ERROR!!!!! highestPiece==0!!', terr);
	}
	terr.piece = highestPiece;
	var obj = getTerritoryType(yourPlayer, terr);
	terr.territoryType = obj.territoryType;
	terr.treatyStatus = obj.status;
	terr.isAlly = obj.isAlly;
	terr.enemyForce = getEnemyForceForTerr(terr, gameObj);
	terr.displayUnitCount = getDisplayUnitCount(terr, gameObj.fogOfWar, gameObj.hardFog)
	var titleUnitCount = unitCount;
	if (terr.fogOfWar)
		titleUnitCount = terr.displayUnitCount;
	terr.title = terr.name + ' (' + titleUnitCount + ' ' + unitStr + ')\n-' + userName + '-\n' + results.join('\n');
	if (superBC)
		terr.title += '\n' + superBSStats;
}
function isUnitGoodForForm(segmentIdx, type, subType) {
	if(segmentIdx==3 && type!=3) // special
		return true;
	if(segmentIdx==2 && (type==3 || type==4)) // water
		return true;
	if(segmentIdx==2 && subType=='fighter') // water
		return true;
	return false;
}
function getDisplayQueueFromQueue(terr, gameObj) {
	var queue=[];
	var pieceHash={};

	gameObj.unitPurchases.forEach(function(unit) {
		if(unit.terr==terr.id) {
			if(pieceHash[unit.piece]>0)
				pieceHash[unit.piece]++;
			else
				pieceHash[unit.piece]=1;
		}
	});
	var keys = Object.keys(pieceHash);
	for(x=0;x<keys.length;x++) {
		var piece = keys[x];
		queue.push({piece: piece, count: pieceHash[piece]});
	}
	return queue;
}
function displayLeaderAndAdvisorInfo(terr, currentPlayer, yourPlayer, user, gameObj) {
	var strategyHint = '';
	if (user.rank < 2 && terr.treatyStatus==4) {
		if (gameObj.round == 1 && terr.factoryCount > 0)
			strategyHint = 'Not sure what to buy? Get tanks. They are good all-purpose units.';
		if (gameObj.round == 2 && terr.factoryCount > 0)
			strategyHint = 'Buying an Economic Center will boost your income.';
		if (gameObj.round <=5 && terr.factoryCount == 0)
			strategyHint = 'Buying a factory will allow you to place new units here next turn.';
		if (gameObj.round == 3 && terr.factoryCount > 0)
			strategyHint = 'Factories purchased this turn will be available for use starting next turn.';
		if (gameObj.round == 4 && terr.factoryCount > 0)
			strategyHint = 'Consider buying Technology. These help boost your strength in a number of ways.';
		if (gameObj.round == 5 && selectedTerritory.factoryCount > 0)
			strategyHint = 'Last round of peace! Opposing players can attack you in round 6. Get your defenses ready.';
	}
	terr.strategyHint = strategyHint;
	terr.leader = terr.owner || 0;
	if (terr.leader == 0)
		terr.leader = terr.nation || 0;
	if (terr.leader == 99)
		terr.leader = 0;
	terr.leaderPic = 'leader' + terr.leader + '.jpg';
	if (terr.leader == 0)
		terr.leaderPic = 'leaders/leader' + terr.id + '.jpg';
	terr.leaderMessage = "";
	if (!yourPlayer || yourPlayer.nation == 0)
		return;
	terr.diplomacyFlg = (yourPlayer.nation != terr.owner && terr.owner > 0);
	if (terr.id < 79 && terr.leader < 10) {
		var names = [terr.name + ' Leader', 'Donald Trump', 'Angela Merkel', 'Vladimir Putin', 'Shinzo Abe', 'Xi Jinping', 'Mohammad bin Salman', 'Idi Amin', 'Michel Temer'];
		terr.leaderName = names[terr.leader];
		if (terr.owner == currentPlayer.nation) {
			if (currentPlayer.status == 'Attack')
				terr.leaderMessage = "We need to expand our empire. Find a good target to attack, or press 'Complete Turn' to end your turn.";
			else
				terr.leaderMessage = "Time to build troops. Buy your desired units, close this panel and then press 'Purchase Complete'.";
		} else {
			if (terr.nation == 0)
				terr.leaderMessage = neutralRandomMessage(terr.id);
			else {
				var status = treatyStatus(yourPlayer, terr.leader);
				if (status == 0)
					terr.leaderMessage = warMessageForNation(terr.leader);
				if (status == 1)
					terr.leaderMessage = neutralMessageForNation(terr.leader);
				if (status == 2)
					terr.leaderMessage = 'Our peace agreement is serving us both well. Do not think of breaking it.';
				if (status == 3)
					terr.leaderMessage = 'Our alliance is strong. Let us work together to defeat the enemies.';
			}
		}
	}
}
function neutralMessageForNation(nation) {
	var m = [
		'We will not take kindly to enemy troops in our territory!',
		'Your nation is a loser and we will really, really defeat your puny army.',
		'We are a peaceful people, but we will not hesitate to bomb your cities and destroy you!',
		'Do not try to take our lands. We are more powerful than you can possibly imagine!',
		'The red sun is rising in the east. Stay out of our way if you know what is good for you.',
		'The people\'s communist army will rise up with one voice and one cannon and defeat you!',
		'Death to the infidels! Convert to our way of extreme happiness or be destroyed!',
		'We bring good tidings and gifts to your people. Unless you anger us, then we kill you!',
		'Soon all of the world will share in the friendship and good fortune that our tanks and bombs will bring.',
	];
	return m[nation];
}
function warMessageForNation(nation) {
	var m = [
		'We will not take kindly to enemy troops in our territory!',
		'Now you have really made me angry. You are not only a loser, but a big loser. A really, really big loser.',
		'You do not stand a chance. We will defeat you!',
		'The armies of mother Russia never surrender! We will defeat you even if it kills every one of us.',
		'You have brought great dishonor to your nation and to your people. Prepare for war!',
		'The people\'s cannon is pointed at your hearts! Surrender now or face the consequences.',
		'Prepare for jihad! We will attack you with a million strikes of total destruction.',
		'We tried to bring peace to your nation, but have failed. Now we must kill you.',
		'Please send us the coordinates of your leadership bunker. Guided missiles have already been launched!',
	];
	return m[nation];
}
function neutralRandomMessage(id) {
	var m = [
		'You better watch yourself, before you wreck yourself!! No wait, well you know what I mean!',
		'Our nation is very powerful. And we have friends too!',
		'We have positioned all our troops in strategic locations to ensure total dominance. Total and complete dominance!',
		'We are not interested in negotiating with such a puny country as yours.',
		'We are now accepting gifts and bribes of all denominations.',
		'Silence! We own this country and will stop at nothing to expand our ownership of it.',
		'Your pitiful army is no match for the massive empire we have built!',
		'I am on vacation. Please book a meeting with my secretary.',
		'We will not take kindly to enemy troops in our territory!',
		'I have two words for you... Step and Off!',
		'You are looking at your next boss. Keep that in mind as you make your next move.',
		'I don\'t have to tell you how dumb of a move it would be for you to invade. It\'s really, really dumb.',
		'We can do this the easy way, or the hard way. Or some way in between.',
	];
	var i = Math.floor((id % m.length));
	return m[i];
	//
}

function unitsForTerr(terr, units) {
	var tUnits = [];
	for (var x = 0; x < units.length; x++) {
		var unit = units[x];
		if (unit.terr == terr.id) {
			tUnits.push(unit);
		}
	}
	return tUnits;
}
function cleanupTerr(terr, player) {
	if (terr.owner > 0) {
		terr.userName = player.userName;
		if (terr.nuked && !player.alive)
			terr.nuked = false;
	}
}
function getEnemyForceForTerr(terr, gameObj) {
	var attStrength = 0;
	if (!terr || !terr.land || terr.land.length == 0)
		return attStrength;

	terr.land.forEach(function (tId) {
		var t = gameObj.territories[tId - 1];
		if (t.owner > 0 && t.owner != terr.owner && t.attStrength > 0)
			attStrength += numberVal(t.attStrength);
	});
	return attStrength;
}
function getTerritoryType(player, terr) {
	var territoryType = 'n/a';
	var isAlly = false;
	var status = -1;
	if (player) {
		if (terr.owner > 0 && (terr.nation < 99 || terr.unitCount > 0)) {
			status = treatyStatus(player, terr.owner);
			isAlly = (status >= 3);
			if (status == 0)
				territoryType = 'War!';
			if (status == 1)
				territoryType = 'Non-Agression';
			if (status == 2)
				territoryType = 'Peace';
			if (status > 2)
				territoryType = 'Ally';
		}
		if (terr.owner == player.nation)
			territoryType = 'Your Empire';
		if (terr.nation == 99 && terr.unitCount == 0)
			territoryType = 'Water Zone';
		if (terr.nation == 0 && terr.owner == 0)
			territoryType = 'Neutral';
		if (terr.nation > 0 && terr.nation < 99 && terr.owner == 0)
			territoryType = 'Independent';
	}
	var obj = { territoryType: territoryType, isAlly: isAlly, status: status };
	return obj;
}
function playerOfNation(nation, gameObj) {
	for (var x = 0; x < gameObj.players.length; x++) {
		var player = gameObj.players[x];
		if (player.nation == nation)
			return player;
	}
}
function treatyStatus(p1, nation) {
	if (!p1)
		return 0;
	if (p1.nation == nation)
		return 4;
	if (!p1.treaties)
		return 0;

	return p1.treaties[nation - 1];
}
function isUnitAirDefense(unit) {
	return (unit.piece == 13 || unit.piece == 37 || unit.piece == 39 || unit.piece == 40 || unit.piece == 9);
}

function flagOfOwner(own, terr, showDetailsFlg, unitCount, defeatedByNation, nuked, attackedByNation) {
	var flag = 'flag' + own + '.gif';
	if (terr.generalFlg && showDetailsFlg)
		flag = 'flagg' + own + '.gif';
	if (terr.leaderFlg && showDetailsFlg)
		flag = 'flagl' + own + '.gif';

	if (own == 0 && terr.nation > 0 && terr.nation < 99)
		flag = 'flagn' + terr.nation + '.gif';
	if (defeatedByNation > 0 || attackedByNation > 0) {
		flag = 'flag_ex' + own + '.gif';
	}
	if (nuked && own > 0)
		flag = 'flag_nuke' + own + '.gif';

	var f = document.getElementById('flag' + terr.id);
	if (f) {
		if (terr.nation == 99 && unitCount == 0) {
			flag = 'flag99.gif';
			own = 0;
			f.style.opacity = '.3'; // see also refreshBoard in script.js
		} else
			f.style.opacity = '1';
	}
	return flag;
}
