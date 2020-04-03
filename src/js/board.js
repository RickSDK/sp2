
function refreshAllTerritories(gameObj, currentPlayer, superpowersData, yourPlayer) {
	gameObj.territories.forEach(function (terr) {
		refreshTerritory(terr, gameObj, currentPlayer, superpowersData, yourPlayer);
	});
}
function refreshTerritory(terr, gameObj, currentPlayer, superpowersData, yourPlayer) {
	if (!gameObj)
		console.log('!!!! no gameObj!!');
	if (!superpowersData || !superpowersData.superpowers)
		console.log('!!!! no superpowersData!!');
	if (!terr) {
		console.log('refreshTerritory: no terr!');
		return;
	}

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
	var units = [];
	var unitUniqueHash = {};
	var movableTroopCount = 0;
	var aircraftCarriers = [];
	gameObj.units.forEach(function (unit) {
		if (unit.dead)
			console.log('unit dead!!!', unit.piece);
		if (unit.terr == terr.id && !unit.dead && !unitUniqueHash[unit.id]) {
			unitUniqueHash[unit.id] = true;

			units.push(unit);
			if (currentPlayer && unit.owner != terr.owner && !enemyPiecesExist) {
				if (currentPlayer.treaties[unit.owner - 1] == 0)
					enemyPiecesExist = true;
			}
			if (unit.moveAtt > 0 && unit.owner == currentPlayer.nation)
				movableTroopCount++;
			totalUnitCount++;
			if (unit.piece == 8)
				aircraftCarriers.push(unit);
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
			//			if (cleanDice)
			//				unit.dice = [];
			if (unit.def > 0)
				pieces.push(unit.piece);
			if (terr.id < 79 && unit.cargoOf && unit.cargoOf > 0)
				paratrooperCount++;
			if (terr.id < 79 && unit.cargoOf && unit.cargoOf > 0 && unit.piece == 2)
				infParatrooperCount++;

			var sp = '';
			if (unit.owner != terr.owner)
				sp = ' (' + superpowersData.superpowers[unit.owner] + ')';
			var unitName = superpowersData.units[unit.piece].name + sp;
			var count = unitHash[unitName] || 0;
			count++;
			unitHash[unitName] = count;

			var unitName2 = superpowersData.units[unit.piece].name;
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
					var carrierTerr = getTerrOfUnitId(unit.cargoOf, gameObj);
					if (carrierTerr > 0 && unit.terr != carrierTerr) {
						//					showAlertPopup('Unloaded Fighter. Fixing.');
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
	if (aircraftCarriers.length > 0)
		squareUpAllCargo(aircraftCarriers, gameObj);
	units.sort(function (a, b) { return a.piece - b.piece; });
	terr.units = units;
	terr.movableTroopCount = movableTroopCount;
	if (terr.defeatedByNation > 0 && numberVal(terr.defeatedByRound) < gameObj.round - 1) {
		terr.defeatedByNation = 0;
	}
	terr.enemyPiecesExist = enemyPiecesExist;
	terr.totalUnitCount = totalUnitCount;
	terr.battleshipAACount = battleshipAACount;
	if (unitOwner > 0 && unitOwner != terr.owner && terr.id >= 79)
		terr.owner = unitOwner;
	if (factoryCount > 1 && terr.facBombed)
		terr.facBombed = false;
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
		militaryUnits.push({ 'name': superpowersData.units[piece].name, amount: amount, piece: piece, owner: leaderOwner });
	}
	var keys3 = Object.keys(flagHash);
	var flags = [];
	for (x = 0; x < keys3.length; x++) {
		var k = keys3[x];
		flags.push(k);
	}
	terr.cobraCount = cobraCount;
	terr.cruiseFlg = false;
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
	terr.expectedLosses = parseInt(terr.defStrength / 6);
	terr.groundForce = groundForce;
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
	//	if (gameObj.historyMode) {
	//		terr.flag = flagOfOwner(terr.histOwner, terr, false, totalUnitCount, terr.histDefeatedByNation, terr.histNuked, terr.attackedByNation);
	//		return;
	//	}

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
		if (player.tech[16] && terr.nation < 99) {
			adCount++;
		}
		if (!player.tech[2])
			defendingFighterId = 0;

		cleanupTerr(terr, player);
	}
	terr.adCount = adCount;

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
	terr.adCount;
	terr.piece = highestPiece;
	var obj = getTerritoryType(yourPlayer, terr);
	terr.territoryType = obj.territoryType;
	terr.treatyStatus = obj.status;
	terr.treatyStatusAtStart = obj.statusAtStart;
	terr.isAlly = obj.isAlly;
	terr.enemyForce = getEnemyForceForTerr(terr, gameObj);
	terr.displayUnitCount = getDisplayUnitCount(terr, gameObj.fogOfWar, gameObj.hardFog, yourPlayer);
	var titleUnitCount = unitCount;
	if (terr.fogOfWar)
		titleUnitCount = terr.displayUnitCount;
	terr.title = terr.name + ' (' + titleUnitCount + ' ' + unitStr + ')\n-' + userName + '-\n' + results.join('\n');
	if (superBC)
		terr.title += '\n' + superBSStats;
}
function alliesFromTreaties(player) {
	var allies = [];
	var nation = 0;
	player.treaties.forEach(function (t) {
		nation++;
		if (t == 3 && nation != player.nation)
			allies.push(nation);
	});
	return allies;
}
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
	var currentLeft = 0;
	var e = document.getElementById("sidelinePopup");
	if (e) {
		if (left > 1282)
			left = 1282;
		currentLeft = numberVal(e.style.left.replace('px', ''));
		if (currentLeft == 0)
			e.style.left = left + 'px';
		else
			e.style.left = '0';
	}
	var e2 = document.getElementById("sidelineButton");
	if (e2) {
		if (currentLeft == 0)
			e2.style.left = left + 'px';
		else
			e2.style.left = '0';
	}
	var e3 = document.getElementById("purchaseSideBar");
	if (e3) {
		if (currentLeft == 0)
			e3.style.left = left + 'px';
		else
			e3.style.left = '0';
	}
}
function positionPurchasePanel() {
	var e = document.getElementById("sidelinePopup");
	var e2 = document.getElementById("sidelineButton");
	var e3 = document.getElementById("purchaseSideBar");
	if (e && e2 && e3) {
		var rect = e.getBoundingClientRect();
		var top = rect.top + rect.height + 5;
		e2.style.top = top + 'px';
		e3.style.top = (top + 50) + 'px';
	}
}
function isFactoryAllowedOnTerr(terr, gameObj) {
	var flg = isFactoryInQueue(terr.id, gameObj);
	return (!flg && terr.factoryCount < 2);
}
function isFactoryInQueue(terrId, gameObj) {
	for (var x = 0; x < gameObj.unitPurchases.length; x++) {
		var purchUnit = gameObj.unitPurchases[x];
		if (purchUnit.terr == terrId) {
			if (purchUnit.piece == 15 || purchUnit.piece == 19)
				return true;
		}
	}
	return false;
}
function checkWaterForFactory(terr, nation, gameObj) {
	var borders = terr.borders.split('+');
	for (var x = 0; x < terr.borders.length; x++) {
		var id = numberVal(borders[x]);
		if (id > 0) {
			var ter = gameObj.territories[id - 1];
			if (ter.owner == nation && ter.factoryCount > 0)
				return true;
		}
	}
	return false;
}
function acceptOfferFromNation(player, nation, gameObj, superpowersData) {
	var player2 = playerOfNation(nation, gameObj);
	var status = player.treaties[nation - 1];
	var treatyStatus = (status < 2) ? 2 : 3;
	changeTreaty(player, player2, treatyStatus, gameObj, superpowersData);
}
function rejectOfferFromNation(player, nation, gameObj) {
	playSound('click.mp3');
	var player2 = playerOfNation(nation, gameObj);
	logDiplomacyNews(player, player2, 4);
	logItem(gameObj, player, 'Diplomacy', 'Treaty from ' + player2.userName + ' rejected.', '', 0, nation);
}
function dropAllyOfNation(player, nation, gameObj, superpowersData) {
	var player2 = playerOfNation(nation, gameObj);
	changeTreaty(player, player2, 1, gameObj, superpowersData);
}
function offerTreatyToNation(nation, gameObj, currentPlayer, superpowersData) {
	var status = currentPlayer.treaties[nation - 1];
	var treatyStatus = (status < 2) ? 2 : 3;
	offerTreaty(treatyStatus, nation, gameObj, currentPlayer, superpowersData);
}
function declareWarOnNation(nation, gameObj, player, superpowersData) {
	playClick();
	var p2 = playerOfNation(nation, gameObj);
	changeTreaty(player, p2, 0, gameObj, superpowersData);
}
function offerTreaty(type, nation, gameObj, currentPlayer, superpowersData) {
	playClick();
	var p2 = playerOfNation(nation, gameObj);
	var p1TopFlg = (currentPlayer.nation == gameObj.top1Nation || currentPlayer.nation == gameObj.top2Nation);
	var p2TopFlg = (p2.nation == gameObj.top1Nation || p2.nation == gameObj.top2Nation);
	if (p1TopFlg && p2TopFlg && type == 3 && !currentPlayer.cpu) {
		showAlertPopup('Sorry, top 2 players cannot ally.', 1);
		return;
	}
	currentPlayer.diplomacyFlg = true;
	attemptDiplomacy(currentPlayer, p2, type, superpowersData, gameObj);
	currentPlayer.treatyOfferedNation = p2.nation;
}
function attemptDiplomacy(player, player2, type, superpowersData, gameObj) {
	if (type == 2) {
		var msg = 'Peace treaty offered to ' + superpowersData.superpowers[player2.nation];
		popupMessage(player, msg, player2, true);
		logItem(gameObj, player, 'Diplomacy', msg);
		player2.offers.push(player.nation);
	}
	if (type == 3) {
		var msg = 'Alliance offered to ' + superpowersData.superpowers[player2.nation];
		popupMessage(player, msg, player2, true);
		player2.offers.push(player.nation);
		logItem(gameObj, player, 'Diplomacy', msg);
	}
}
function addPeaceFighter(player, gameObj, superpowersData) {
	var peaceFighters = player.peaceFighters || 0;
	peaceFighters++;
	if (peaceFighters <= gameObj.players.length - 1) {
		var terr1 = capitalOfPlayer(player, gameObj);
		if (terr1) {
			player.peaceFighters = peaceFighters;
			addNewUnitToBoard(gameObj, terr1, 6, superpowersData);
			refreshTerritory(terr1, gameObj, player, superpowersData, player);
		}
	}
}
function capitalOfPlayer(player, gameObj) {
	for (var x = 0; x < gameObj.territories.length; x++) {
		var terr = gameObj.territories[x];
		if (terr.capital && terr.nation < 99 && terr.owner == player.nation && terr.nation == player.nation)
			return terr;
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
	console.log('scrubUnitsOfPlayer');
	var mav = player.tech[1];
	var radar = player.tech[2];

	var torpedoes = player.tech[6];

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
			if (unit.piece == 28 && gameObj.round <= unit.medicRound + 1)
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
			if (unit.type == 1 && player.tech[19] && unit.mv2 > 0) { // railway
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
	addTechForPlayer(player);
}
function resetPlayerUnits(player, gameObj) {
	var unitCount = 0;
	var generalFlg = false;
	var leaderFlg = false;
	var sbcFlg = false;
	var stratBombButton = false;
	gameObj.units.forEach(function (unit) {
		if (unit.owner == player.nation && unit.mv > 0 && !unit.dead) {
			unit.dice = [];
			unit.moving = false;
			unit.usedInCombat = false;
			if (unit.type == 3)
				unit.cargoLoadedThisTurn = 0;
			unit.movesLeft = 2;
			unit.movesTaken = 0;
			unit.retreated = false;
			unit.prevTerr = unit.terr;
			if (unit.att > 0)
				unitCount++;
			if (unit.piece == 10) {
				generalFlg = true;
				unit.startTerr = unit.terr;
			}
			if (unit.type == 2)
				unit.startTerr = unit.terr;
			if (unit.piece == 11)
				leaderFlg = true;
			if (unit.piece == 10 || unit.piece == 11)
				player.mainBaseID = unit.terr;
			if (unit.moving)
				unit.moving = false;
			if (unit.piece == 12)
				sbcFlg = true;
			if (unit.piece == 7)
				stratBombButton = true;
			//		if (unit.cargoUnits > 0 && (unit.piece == 4 || unit.piece == 7 || unit.piece == 8))
			//			doubleCheckCargoUnits(unit);
			//			if (unit.piece == 44)
			//				checkSealUnit(unit, player);
		}
	});
	player.stratBombButton = stratBombButton;
	player.sbcFlg = sbcFlg;
	player.generalFlg = generalFlg;
	player.leaderFlg = leaderFlg;
	player.unitCount = unitCount;
	addTechForPlayer(player);
	setLastRoundsOfPeaceAndWar(player, gameObj);
}
function setLastRoundsOfPeaceAndWar(player, gameObj) {
	if (!player.lastRoundsOfPeace || player.lastRoundsOfPeace.length < 8)
		player.lastRoundsOfPeace = [1, 1, 1, 1, 1, 1, 1, 1];
	if (!player.lastRoundsOfWar || player.lastRoundsOfWar.length < 8)
		player.lastRoundsOfWar = [1, 1, 1, 1, 1, 1, 1, 1];

	gameObj.players.forEach(function (p) {
		var treaty = player.treaties[p.nation - 1];
		if (treaty >= 1)
			player.lastRoundsOfPeace[p.nation - 1] = gameObj.round;
		else
			player.lastRoundsOfWar[p.nation - 1] = gameObj.round;
	});
}
function cleanUpTerritories(player, gameObj) {
	var numFactories = 0;
	var biggestForce = 0;
	var mainBase = 0;
	var territories = [];
	gameObj.territories.forEach(function (terr) {
		if (terr.attackedByNation == player.nation)
			terr.attackedByNation = 0;
		if (terr.defeatedByNation == player.nation) {
			terr.defeatedByNation = 0;
			terr.defeatedByRound = 0;
		}
		if (terr.owner == 0 && terr.nuked)
			terr.nuked = false;
		if (terr.owner == player.nation) {
			if (terr.attackedByNation > 0)
				terr.attackedByNation = 0; // needed in case planes attack
			if (terr.nuked)
				terr.nuked = false;
			if (terr.bombed)
				terr.bombed = false;
			//			refreshTerritory(terr);
			numFactories += terr.factoryCount;
			if (terr.attStrength > biggestForce && terr.id < 79) {
				mainBase = terr.id;
				biggestForce = terr.attStrength;
			}

			territories.push(terr);
			checkCargoForTerr(terr, gameObj);
		}
	});
	if (player.mainBaseID == 0 && mainBase > 0)
		player.mainBaseID = mainBase;
	player.territories = territories;
	return numFactories;
}
function addIncomeForPlayer(player, gameObj) {
	if (!player || player.nation == 0)
		return;
	var terrHash = {};
	var income = 0;
	var caps = 0;
	var bombedCount = 0;
	var economicCount = 0;
	gameObj.territories.forEach(function (terr) {
		if (terr.owner == player.nation) {
			terr.holdFlg = false;
			terr.incomingFlg = false;
			if (terr.capital && terr.nation < 99) {
				income += 10;
				caps++;
			}
			if (terr.factoryCount > 1) {
				economicCount++;
				income += 5;
			}
			if (terr.factoryCount == -1 || terr.facBombed) {
				bombedCount++;
				income -= 5;
			}
			if (terr.nation < 99) {
				if (terrHash[terr.nation])
					terrHash[terr.nation]++
				else
					terrHash[terr.nation] = 1;
			}
		}
	});
	if (player.leaderFlg)
		income += 10;
	var spIncome = 0;
	var k = Object.keys(terrHash);
	k.forEach(function (nation) {
		var count = terrHash[nation];
		if (nation == 1 && count > 5)
			spIncome += 10;
		if (nation == 2 && count > 5)
			spIncome += 10;
		if (nation == 3 && count > 7)
			spIncome += 10;
		if (nation == 4 && count > 6)
			spIncome += 10;
		if (nation == 5 && count > 6)
			spIncome += 10;
		if (nation == 6 && count > 6)
			spIncome += 10;
		if (nation == 7 && count > 7)
			spIncome += 10;
		if (nation == 8 && count > 5)
			spIncome += 10;
	});
	income += spIncome;
	player.sp = spIncome / 10;
	player.cap = caps;
	var ecoTechCount = 0;
	if (player.tech[9])
		ecoTechCount++;
	if (player.tech[10])
		ecoTechCount++;
	if (player.tech[11])
		ecoTechCount++;
	player.ecoTechCount = ecoTechCount;
	income += 5 * ecoTechCount;
	player.bombedCount = bombedCount;
	player.economicCount = economicCount;
	player.income = income;
	var units = 0;
	player.nukes = false;
	player.sat = player.tech[18];
	gameObj.units.forEach(function (unit) {
		if (unit.owner == player.nation && unit.mv > 0 && !unit.dead) {
			if (unit.piece == 14)
				player.nukes = true;
			units++;
		}
	});
	//	gameObj.players.forEach(function (player) {
	//		resetPlayerUnits(player, gameObj); // dont do this!
	//	});
	player.units = units;
	addTechForPlayer(player);
	figureOutTeams(gameObj);
	registerTeamStats(player, gameObj);
}
function figureOutTeams(gameObj) {
	var currentTurn = -1;
	var nextTurn = -1;
	var teamNum = 0;
	var teamHash = {};
	var incomes = [0, 0, 0, 0, 0, 0, 0, 0];
	var capitals = [0, 0, 0, 0, 0, 0, 0, 0];
	for (var x = 0; x < gameObj.players.length; x++) {
		var pl1 = gameObj.players[x];
		if (gameObj.turnId == pl1.turn)
			currentTurn = pl1.turn;
		if (currentTurn >= 0 && gameObj.turnId != pl1.turn && nextTurn == -1 && pl1.alive)
			nextTurn = pl1.turn;
		pl1.teamIndex = getTeamIndex(pl1, gameObj);
		var team = 0;
		if (teamHash[pl1.teamIndex] > 0) {
			team = teamHash[pl1.teamIndex];
		} else {
			teamNum++;
			team = teamNum;
			teamHash[pl1.teamIndex] = teamNum;
		}
		pl1.capitals = capitalsForPlayer(pl1, gameObj);
		pl1.team = team;
		incomes[team - 1] += pl1.income;
		capitals[team - 1] += pl1.capitals.length;
	}
	checkGameTeams(incomes, capitals, gameObj);
}
function capitalsForPlayer(player, gameObj) {
	capitals = [];
	gameObj.territories.forEach(function (terr) {
		if (terr.capital && terr.nation < 99 && terr.owner == player.nation)
			capitals.push(terr.nation);
	});
	return capitals;
}
function checkGameTeams(incomes, capitals, gameObj) {
	var x = 0;
	gameObj.teams.forEach(function (team) {
		var nations = [];
		var alive = false;
		var numPlayers = 0;
		var teamPlayers = [];
		gameObj.players.forEach(function (player) {
			if (player.team == team.name) {
				if (player.alive) {
					numPlayers++;
					alive = true;
					teamPlayers.push(player.nation);
				}

				player.capitals.forEach(function (cap) {
					nations.push(cap);
				});
			}
		});
		team.teamPlayers = teamPlayers;
		team.numPlayers = numPlayers;
		team.alive = alive;
		team.nations = teamPlayers;
		team.income = incomes[x];
		team.capitals2 = capitals[x];
		team.capitals = nations;
		x++;
	});
}
function registerTeamStats(player, gameObj) {
	if (!gameObj.statsObj)
		gameObj.statsObj = [];
	var statsObj = gameObj.statsObj || [];
	var roundStarted = false;
	statsObj.forEach(function (obj) {
		if (obj.round == gameObj.round) {
			roundStarted = true;
		}
	});
	var thisTurnStatsObj = {};
	if (roundStarted)
		thisTurnStatsObj = gameObj.statsObj.pop();

	thisTurnStatsObj.round = gameObj.round;
	if (!thisTurnStatsObj.players)
		thisTurnStatsObj.players = [];
	thisTurnStatsObj.players.push({ n: player.nation, i: player.income })

	thisTurnStatsObj.teams = [];
	//		gameObj.players.forEach(function(player) {
	//			thisTurnStatsObj.players.push({nation: player.nation, income: player.income})
	//		});
	gameObj.teams.forEach(function (team) {
		var n = 1;
		if (team.nations && team.nations.length > 0)
			n = team.nations[0]
		thisTurnStatsObj.teams.push({ t: team.name, i: team.income, n: n });
	});
	gameObj.statsObj.push(thisTurnStatsObj);
}
function getTeamIndex(player, gameObj) {
	var adder = parseInt(player.nation);
	var multiplier = parseInt(player.nation);
	var nation = 0;
	var numAllies = 0;
	var index = 0;
	player.treaties.forEach(function (treaty) {
		nation++;
		if (treaty == 3) {
			numAllies++;
			adder += nation;
			multiplier *= nation;
		}
		if (treaty == 3 || player.nation == nation) {
			index += Math.pow(2, nation);
		}
	});
	if (!player.alliesMaxed && numAllies == gameObj.maxAllies)
		player.alliesMaxed = true;
	return index;
}
function addTechForPlayer(player) {
	var totalTech = 0;
	var techCount = 0;
	var x = 0;
	player.tech.forEach(function (tech) {
		if (tech)
			totalTech++;
		if (x++ < 18 && tech)
			techCount++
	});
	player.totalTech = totalTech;
	player.techCount = techCount;
}
function getDamageReport(player, gameObj, superpowersData) {
	var lostUnits = 0;
	var lostCoins = 0;
	var enemyUnits = 0;
	var enemyCoins = 0;
	gameObj.logs.forEach(function (log) {
		if (log.round == gameObj.round && log.nation == player.nation) {
			if (log.type == 'Battle' || log.type == 'Nuke Attack!' || log.type == 'EMP Attack!' || log.type == 'Cruise Attack!') {
				log.attackingCas.forEach(function (unit) {
					lostUnits++;
					lostCoins += superpowersData.units[unit.piece].cost;
				});
				log.defendingCas.forEach(function (unit) {
					enemyUnits++;
					enemyCoins += superpowersData.units[unit.piece].cost;
				});
			}
			if (log.type == 'Strategic Bombing') {
				if (log.message.includes('Shot down: 1')) {
					lostUnits++;
					lostCoins += 15;
				}
				if (log.message.includes('Shot down: 2')) {
					lostUnits += 2;
					lostCoins += 30;
				}
				if (log.message.includes('Shot down: 3')) {
					lostUnits += 3;
					lostCoins += 45;
				}
				if (log.message.includes('Factories destroyed: 1')) {
					enemyUnits++;
					enemyCoins += 15;
				}
				if (log.message.includes('Factories destroyed: 2')) {
					enemyUnits += 2;
					enemyCoins += 30;
				}
			}
		}
	});
	return { lostUnits: lostUnits, lostCoins: lostCoins, enemyUnits: enemyUnits, enemyCoins: enemyCoins };
}
function costToAttack(terr, player) {
	var status = treatyStatusAtStart(player, terr.owner);
	if (status == 1)
		return 5;
	if (status == 2)
		return 10;
	if (status == 3)
		return 15;
	return 0;
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
function highlightCompleteTurnButton() {
	playVoiceClip('bt10EndTurn.mp3');
	changeClass('completeTurnButton', 'glowButton');
	showUpArrowAtElement('completeTurnButton');
}
function highlightCapital(nation) {
	var ids = [1, 1, 7, 13, 21, 28, 35, 42, 50];
	//	highlightTerritory(ids[nation], nation, true);
	var obj = capitalXY(nation);
	var e = document.getElementById('arrow');
	e.style.display = 'block';
	e.style.position = 'absolute';
	e.style.left = (obj.x - 40).toString() + 'px';
	e.style.top = (obj.y + 140).toString() + 'px';
}
function highlightTerritoryWithArrow(terrId, gameObj) {
	var terr = gameObj.territories[terrId - 1];
	var e = document.getElementById('arrow');
	if (e) {
		e.style.display = 'block';
		e.style.position = 'absolute';
		e.style.left = (terr.x - 40).toString() + 'px';
		e.style.top = (terr.y + 140).toString() + 'px';
	}
}
function showUpArrowAtElement(id) {
	var e = document.getElementById('arrow');
	var b = document.getElementById(id);
	if (e && b) {
		var elemRect = b.getBoundingClientRect();
		e.style.display = 'block';
		e.style.position = 'fixed';
		e.style.left = (elemRect.left + 10).toString() + 'px';
		e.style.top = (elemRect.top + 40).toString() + 'px';
	}
}
function whiteoutScreen() {
	var e = document.getElementById('whiteOut');
	if (e) {
		e.className = 'on';
		e.style.display = 'block';
		e.style.transition = 'all 1s ease';
		setTimeout(function () { e.className = 'fadeOut'; }, 100);
		setTimeout(function () { e.style.display = 'none'; }, 1100);
	}
}
function shakeScreen() {
	windowScrollBy(10, 10);
	setTimeout(function () { windowScrollBy(-10, -10); }, 50);
	setTimeout(function () { windowScrollBy(10, 10); }, 100);
	setTimeout(function () { windowScrollBy(-10, -10); }, 150);
}
function windowScrollBy(x, y) {
	window.scrollBy(x, y);
}
function getTerrOfUnitId(id, gameObj) {
	var terrId = 0;
	gameObj.units.forEach(function (unit) {
		if (unit.id == id)
			terrId = unit.terr;
	});
	return terrId;
}
function checkCargoForTerr(terr, gameObj) {
	for (var x = 0; x < terr.units.length; x++) {
		var unit = terr.units[x];
		if (unit.cargo && unit.cargo.length > 0) {
			cargo = [];
			for (var c = 0; c < unit.cargo.length; c++) {
				var cargoUnit = unit.cargo[c];
				var tid = getTerrOfUnitId(cargoUnit.id, gameObj);
				if (tid == unit.terr)
					cargo.push(cargoUnit);
			}
			unit.cargo = cargo;
		}
	}
}
function isUnitGoodForForm(segmentIdx, type, subType) {
	if (segmentIdx == 3 && type != 3) // special
		return true;
	if (segmentIdx == 2 && (type == 3 || type == 4)) // water
		return true;
	if (segmentIdx == 2 && subType == 'fighter') // water
		return true;
	return false;
}
function playerOfNation(nation, gameObj) {
	for (var x = 0; x < gameObj.players.length; x++) {
		var player = gameObj.players[x];
		if (player.nation == nation)
			return player;
	}
	return null;
}
function changeTreaty(p1, p2, type, gameObj, superpowersData, cost = 0) {
	if (!p1 || !p2)
		return;
	if (p1.nation == p2.nation)
		return;
	p1.treaties[p2.nation - 1] = type;
	p2.treaties[p1.nation - 1] = type;
	logDiplomacyNews(p1, p2, type);
	var msg = '';
	if (type == 0) {
		msg = superpowersData.superpowers[p1.nation] + ' has declared war on ' + superpowersData.superpowers[p2.nation];
	}
	if (type == 1) {
		playSound('CrowdBoo.mp3');
		msg = superpowersData.superpowers[p1.nation] + ' has dropped ' + superpowersData.superpowers[p2.nation] + ' from the alliance.';
	}
	if (type == 2) {
		playSound('bell.mp3');
		msg = superpowersData.superpowers[p1.nation] + ' has signed a peace treaty with ' + superpowersData.superpowers[p2.nation];
		addPeaceFighter(p1, gameObj, superpowersData);
		addPeaceFighter(p2, gameObj, superpowersData);
	}
	if (type == 3) {
		playSound('tada.mp3');
		msg = superpowersData.superpowers[p1.nation] + ' has formed an alliance with ' + superpowersData.superpowers[p2.nation];
	}

	if (cost > 0) {
		p1.treatiesAtStart[p2.nation - 1] = 0;
		p1.money -= cost;
		logItem(gameObj, p1, 'War Penalty!', cost + ' coin penalty paid to declare war on ' + superpowersData.superpowers[p2.nation] + '!', '', 0, p2.nation);
	} else
		logItem(gameObj, p1, 'Diplomacy', msg, '', 0, p2.nation);

	popupMessage(p1, msg, p2);
}
function removeAlliancesForNation(nation, gameObj) {
	gameObj.players.forEach(function (player) {
		if (player.treaties[nation - 1] == 3) {
			player.treaties[nation - 1] = 0;
		}
	});
}
function logDiplomacyNews(p1, p2, type) {
	if (!p2.news)
		p2.news = [];
	p2.news.push({ nation: p1.nation, type: type });
}
function logItem(gameObj, player, type, message, details = '', terrId = 0, nation = 0, ft = '', dr = '', enemy = '') {
	var id = gameObj.logId || 0;
	id++;
	gameObj.logId = id;
	var bRounds = 0;
	if (details && details.length > 0) {
		var pieces = details.split('|');
		var lid = 1;
		var attackingUnits = arrayObjOfLine(pieces[0], lid);
		lid += attackingUnits.length;
		var defendingUnits = arrayObjOfLine(pieces[1], lid);
		lid += defendingUnits.length;
		var attackingCas = arrayObjOfLine(pieces[2], lid);
		lid += attackingCas.length;
		var defendingCas = arrayObjOfLine(pieces[3], lid);
		var medicHealedCount = pieces[4];
		if (details.length > 5)
			bRounds = parseInt(pieces[5]);
	}
	var log = {
		id: id, round: gameObj.round, nation: player.nation, type: type, enemy: enemy, message: message,
		attackingUnits: attackingUnits, defendingUnits: defendingUnits, attackingCas: attackingCas, defendingCas: defendingCas,
		medicHealedCount: medicHealedCount, bRounds: bRounds, t: terrId, o: nation, ft: ft, dr: dr
	};
	gameObj.logs.push(log);
}
function arrayObjOfLine(line, id) {
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
function addUniToQueue(piece, count, superpowersData, currentPlayer, gameObj, selectedTerritory) {
	var unit = superpowersData.units[piece];
	var cost = unit.cost;

	for (var x = 0; x < count; x++) {
		if (currentPlayer.money - cost >= 0) {
			currentPlayer.money -= cost;
			var id = gameObj.unitPurchases.length + 1;
			gameObj.unitPurchases.push({ id: id, terr: selectedTerritory.id, piece: piece });
		}
	}
	if (piece == 16)
		currentPlayer.abFlg = true;
	if (piece == 17)
		currentPlayer.railFlg = true;
	if (piece == 18)
		currentPlayer.techCount++;
	selectedTerritory.displayQueue = getDisplayQueueFromQueue(selectedTerritory, gameObj);
}
function getDisplayQueueFromQueue(terr, gameObj) {
	var queue = [];
	var pieceHash = {};

	gameObj.unitPurchases.forEach(function (unit) {
		if (unit.terr == terr.id) {
			if (pieceHash[unit.piece] > 0)
				pieceHash[unit.piece]++;
			else
				pieceHash[unit.piece] = 1;
		}
	});
	var keys = Object.keys(pieceHash);
	for (x = 0; x < keys.length; x++) {
		var piece = keys[x];
		queue.push({ piece: piece, count: pieceHash[piece] });
	}
	return queue;
}

function updateAdvisorInfo(terr, currentPlayer, user, gameObj, superpowers, optionType) {
	var strategyHint = '';
	if (currentPlayer.status == 'Purchase' && terr.treatyStatus == 4 && user.rank <= 3) {
		strategyHint = "Time to build troops. Buy your desired units, close this panel and then press 'Purchase Complete'.";
		if (gameObj.round == 1 && terr.factoryCount > 0)
			strategyHint = 'Not sure what to buy? Get tanks. They are good all-purpose units.';
		if (gameObj.round == 2 && terr.factoryCount > 0)
			strategyHint = 'Buying an Economic Center will boost your income.';
		if (gameObj.round <= 5 && terr.factoryCount == 0)
			strategyHint = 'Buying a factory will allow you to place new units here next turn.';
		if (gameObj.round == 3 && terr.factoryCount > 0)
			strategyHint = 'Factories purchased this turn will be available for use starting next turn.';
		if (gameObj.round == 4 && terr.factoryCount > 0)
			strategyHint = 'Consider buying Technology. These help boost your strength in a number of ways.';
		if (gameObj.round == 5 && terr.factoryCount > 0)
			strategyHint = 'Last round of peace! Opposing players can attack you in round 6. Get your defenses ready.';
	}
	if (currentPlayer.status == 'Attack') {
		if (terr.owner == 0 && !terr.capital)
			strategyHint = 'This is a good neutral target to invade! There is no cost to attack and you receive 2 infantry and 1 tank if you win.';
		if (terr.owner == 0 && terr.capital)
			strategyHint = 'This capital is strongly defended but will increase our income and give us a factory if we can defeat it. Start massing troops on the border!';
		if (gameObj.round == 5)
			strategyHint = 'Last round before full-out war breaks out. Make sure your defenses are in place.';
		if (optionType == 'attack')
			strategyHint = 'What the??';
	}
	if (terr.treatyStatus == 0 && terr.owner > 0) {
		var p2 = playerOfNation(terr.owner, gameObj);
		var powerStrength = currentPlayer.income - p2.income;
		if (powerStrength > 50)
			strategyHint = superpowers[terr.owner] + ' is a very weak and completely pathetic enemy that can easily be eliminated! Consider moving troops in to take over vital resources.';
		else if (powerStrength > 25)
			strategyHint = superpowers[terr.owner] + ' is weak and in disarray. We should move units into position to finish them off.';
		else if (powerStrength > 0)
			strategyHint = superpowers[terr.owner] + ' is at war with us, but can be stopped with a good war strategy. Push the attack on all fronts.';
		else if (powerStrength > -25)
			strategyHint = superpowers[terr.owner] + ' is dangerous and at war with us. We should avoid entanglements if possible.';
		else
			strategyHint = superpowers[terr.owner] + ' is a very dangerous enemy that is at war with us. Avoid all contact and attempt making peace.';
	}
	if (terr.treatyStatus == 1 && terr.owner > 0) {
		strategyHint = superpowers[terr.owner] + ' is not to be trusted. We need to keep an eye on these guys.';
	}
	if (terr.treatyStatus == 2 && terr.owner > 0) {
		strategyHint = 'We are currently at peace with ' + superpowers[terr.owner] + ', but proceed with caution. They could turn on us at any moment.';
	}
	if (terr.treatyStatus == 3 && terr.owner > 0) {
		strategyHint = superpowers[terr.owner] + ' is our trusted ally.';
	}
	//	var hostileMessage = populateHostileMessage('home', terr, gameObj, currentPlayer);
	//	if (hostileMessage.length > 0)
	//		strategyHint = hostileMessage;
	terr.strategyHint = strategyHint;
}
function getMaxAllies(player, gameObj) {
	return gameObj.maxAllies;
}
function displayLeaderAndAdvisorInfo(terr, currentPlayer, yourPlayer, user, gameObj, superpowers, optionType) {
	updateAdvisorInfo(terr, currentPlayer, user, gameObj, superpowers, optionType);
	terr.leader = terr.owner || 0;
	if (terr.leader == 0)
		terr.leader = terr.nation || 0;
	if (terr.leader == 99)
		terr.leader = 0;
	terr.leaderPic = 'leader' + terr.leader + '.jpg';
	if (terr.treatyStatus == 0)
		terr.leaderPic = 'leader' + terr.leader + 'b.jpg';
	if (terr.leader == 0)
		terr.leaderPic = 'leaders/leader' + terr.id + '.jpg';
	terr.leaderMessage = "";
	if (!yourPlayer || yourPlayer.nation == 0)
		return;
	terr.diplomacyFlg = (yourPlayer.nation != terr.owner && terr.owner > 0);
	if (terr.id < 79 && terr.leader < 10) {
		var names = [terr.name + ' Leader', 'Donald Trump', 'Angela Merkel', 'Vladimir Putin', 'Shinzo Abe', 'Xi Jinping', 'Mohammad bin Salman', 'Idi Amin', 'Hugo Chavez'];
		terr.leaderName = names[terr.leader];
		if (terr.owner == currentPlayer.nation) {
			terr.leaderMessage = '';
			//			if (currentPlayer.status == 'Attack')
			//				terr.leaderMessage = "We need to expand our empire. Find a good target to attack, or press 'Complete Turn' to end your turn.";
			//			else
			//				terr.leaderMessage = "Time to build troops. Buy your desired units, close this panel and then press 'Purchase Complete'.";
		} else {
			if (terr.owner == 0) {
				if (terr.nation == 0)
					terr.leaderMessage = neutralRandomMessage(terr.id);
				else
					terr.leaderMessage = neutralSuperpowerMessage(terr.nation);
			} else {
				var status = treatyStatus(yourPlayer, terr.leader);
				if (status == 0)
					terr.leaderMessage = warMessageForNation(terr, currentPlayer, gameObj);
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
function neutralSuperpowerMessage(nation) {
	var m = [
		'We will not take kindly to enemy troops in our territory!',
		'I am going to tell you once, and then tell you again, you are a loser! Stay out of our lands.',
		'European Union welcomes you with open arms. But we will be placing you in detention centers for 90 days. Please comply.',
		'Please come quickly. Our concentration work camps need to be restocked with fresh workers.',
		'The Emperor has asked us to kindly place your army in handcuffs and await further instructions.',
		'Communism is a beautiful system, but only works once we have imposed total domination on the rest of the world. Please help us reach these ends.',
		'We welcome anyone who shares our views on religion, politics and life. Everyone else must die!',
		'We will crush your imperialist desires! You are not welcome in any of our lands. Go away!',
		'Saludos weak dictator. You are your bombs are not welcome here.',
	];
	return m[nation];
}
function neutralMessageForNation(nation) {
	var m = [
		'We will not take kindly to enemy troops in our territory!',
		'Your nation is a loser and we will really, really defeat your puny army.',
		'We are a peaceful people, but we will not hesitate to bomb your cities and destroy you!',
		'Greetings weak opponent. We could squish you like a bug, but our excessive kindess allows us to keep you around for now.',
		'The red sun is rising in the east. We welcome you to be inferior subjects in our divine kingdom.',
		'The people\'s communist army will rise up with one voice and one cannon and defeat you!',
		'Death to the infidels! Convert to our way of extreme happiness or be destroyed!',
		'We bring good tidings and gifts to your people. Unless you anger us, then we kill you!',
		'Buenos dias! Soon all of the world will share in the friendship and good fortune that our tanks and guided missiles will bring.',
	];
	return m[nation];
}

function warMessageForNation(terr, player, gameObj) {
	var p2 = playerOfNation(terr.owner, gameObj);
	if (p2.income >= player.income - 20) {
		var m = [
			'We will not take kindly to enemy troops in our territory. Prepare for war!',
			'Now you have really made me angry. You are not only a loser, but a big loser. A really, really big loser.',
			'Hey scumbag! It\'s over for you. You do not stand a chance. We will own you!',
			'The armies of mother Russia never surrender! We will defeat you even if it kills every one of us!',
			'You have brought great dishonor to your corrupt nation and to your greedy people. Prepare for defeat!',
			'The people\'s cannon is pointed at your hearts! Surrender now or we will point it at your heads!',
			'Prepare for jihad! First we will attack you with a million strikes of total destruction. Then we will make more threats!',
			'We tried to bring peace to your nation, but have failed. Now we must kill you.',
			'Qué pasa Hombre? Please send us the coordinates of your leadership bunker. Guided missiles have already been launched!',
		];
		return m[terr.owner];

	} else {
		var m = [
			'We will not take kindly to enemy troops in our territory. Prepare for war!',
			'Let\'s make a deal! I am willing to sell you 15 luxury casinos if you end the madness.',
			'Hey budddy, good pal. We have had our differences, but it\'s time to be firends again.',
			'The armies of mother Russia never surrender! We would, however, be interested in joining your fine nation.',
			'Rather than killing each other, and ending up both in last place, let\'s work together to defeat the others!',
			'We have discussed things and, good news, we have decided to allow you to live. Let\'s sign a peace agreement right away.',
			'What\'s a little jihad amongst friends? It is time for us to join forces and all live in harmony sharing our great values equally.',
			'you know what? We were wrong about you. I think we might just be able to live side by side in harmony. Sign this agreement quickly before we change our minds.',
			'Hola amigos! We are all good and friendly people. Let\'s sign an agreement and then be friends. Fiesta toda la noche!',
		];
		return m[terr.owner];

	}
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
	var statusAtStart = -1;
	if (player) {
		if (terr.owner > 0 && (terr.nation < 99 || terr.unitCount > 0)) {
			status = treatyStatus(player, terr.owner);
			if (player.treatiesAtStart && player.treatiesAtStart.length >= player.nation && player.nation > 0)
				statusAtStart = player.treatiesAtStart[terr.owner - 1];

			isAlly = (status >= 3);
			if (status == 0)
				territoryType = 'War!';
			if (status == 1)
				territoryType = 'Non-Aggression';
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
	var obj = { territoryType: territoryType, isAlly: isAlly, status: status, statusAtStart: statusAtStart };
	return obj;
}
function playerOfNation(nation, gameObj) {
	if (!gameObj || !gameObj.players) {
		console.log('!!!!whoa!!! no gameObj sent to playerOfNation!!!');
		return;
	}
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
function treatyStatusAtStart(p1, nation) {
	if (!p1)
		return 0;
	if (p1.nation == nation)
		return 4;
	if (!p1.treatiesAtStart)
		return 0;

	return p1.treatiesAtStart[nation - 1];
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
function checkVictoryConditions(currentPlayer, gameObj, superpowersData, yourPlayer) {
	figureOutTeams(gameObj);
	var victoryMet = false;

	var maxCapitals = 6;
	var maxIncome = 0;
	var winnningPlayer = 'Unknown';
	gameObj.players.forEach(function (player) {
		if (player.income > maxIncome) {
			maxIncome = player.income;
			winnningPlayer = superpowersData.superpowers[player.nation];
		}
	});

	var maxCapitalsHeld;
	var winningTeam = 0;
	gameObj.teams.forEach(function (team) {
		if (team.capitals.length >= maxCapitals) {
			maxCapitalsHeld = team.capitals.length;
			victoryMet = true;
			winningTeam = team.name;
		}

		if (team.income > maxIncome && team.numPlayers > 1) {
			maxIncome = team.income;
			winnningPlayer = 'Team ' + team.name;
		}
	});
	gameObj.winningTeamFlg = (yourPlayer && yourPlayer.team == winningTeam);
	var winningTeamList = playersOfTeam(winningTeam, gameObj, superpowersData);
	if (gameObj.gameOver) {
		var msg = 'Victory!  Game won by ' + winningTeamList.join(', ');
		gameObj.currentSituation = msg;
		return;
	}
	gameObj.currentSituation = winnningPlayer + ' is winning!';
	var victoryRound = numberVal(gameObj.victoryRound);
	if (victoryMet) {
		var msg = 'Victory Conditions met! ' + winnningPlayer + ' controls ' + maxCapitalsHeld + ' capitals. Game will end in round ' + victoryRound + ' if they are held.';
		gameObj.currentSituation = msg;
		if (victoryRound == 0) {
			gameObj.victoryRound = gameObj.round + 1;
			msg = 'Victory Conditions met! ' + winnningPlayer + ' controls ' + maxCapitalsHeld + ' capitals. Game will end in round ' + gameObj.victoryRound + ' if they are held.';
			gameObj.currentSituation = msg;
			gameObj.nation = currentPlayer.nation;
			showAlertPopup(msg);
			logItem(gameObj, currentPlayer, 'Victory Conditions Met', msg);
			playVoiceClip('conditionsMet.mp3');
		} else {
			if (victoryRound < gameObj.round || (victoryRound == gameObj.round && gameObj.nation == currentPlayer.nation && currentPlayer.status == 'Waiting')) {
				var msg = 'Game won by ' + winningTeamList.join(', ');
				gameObj.currentSituation = msg;
				logItem(gameObj, currentPlayer, 'Game Over!', msg);
				displayFixedPopup('gameOverPopup');
				setInnerHTMLFromElement('winningTeam', msg);
				playSound('tada.mp3');
				gameObj.gameOver = true;
			}
		}
	} else {
		if (victoryRound > 0) {
			var msg = 'Victory conditions no longer met!';
			showAlertPopup(msg);
			logItem(gameObj, currentPlayer, 'Victory Conditions Broken', msg);
			gameObj.victoryRound = 0;
		}
	}


}
function playersOfTeam(team, gameObj, superpowersData) {
	var winningTeam = [];
	gameObj.players.forEach(function (player) {
		if (player.team == team) {
			player.wonFlg = true;
			winningTeam.push(superpowersData.superpowers[player.nation]);
		}
	});
	return winningTeam;
}
function playIntroSequence() {
	setTimeout(function () { fadeInDiv('intro1', ''); playSound('zap.mp3'); }, 2000);
	setTimeout(function () { fadeInDiv('intro2', ''); playSound('zap.mp3'); }, 4000);
	setTimeout(function () { fadeInDiv('intro3', ''); playSound('zap.mp3'); }, 6000);
	setTimeout(function () { fadeInDiv('intro4', 'btn btn-primary roundButton'); playSound('zap.mp3'); }, 8000);
	setTimeout(function () { fadeInDiv('intro5', 'btn btn-default roundButton'); playSound('zap.mp3'); }, 10000);
}
function getMilitaryReportObj(gameObj, currentPlayer, line) {
	var obj = {};
	var numPlayers = 0;
	var place = 1;
	var yourIncome = currentPlayer.income;
	var team1Income = 0;
	var team2Income = 0;
	gameObj.players.forEach(function (player) {
		if (player.alive)
			numPlayers++;
		if (player.team == 1)
			team1Income += player.income;
		if (player.team == 2)
			team2Income += player.income;
		if (player.nation != currentPlayer.nation) {
			if (player.income > yourIncome)
				place++;
		}
	});
	var nukeCount = 0;
	gameObj.units.forEach(function (unit) {
		if (unit.piece == 14 && unit.owner != currentPlayer.nation)
			nukeCount++;
	});
	var facBombed = 0;
	gameObj.territories.forEach(function (terr) {
		if (terr.owner == currentPlayer.nation && terr.facBombed)
			facBombed++;
	});
	obj.numPlayers = numPlayers;
	obj.place = place;
	obj.team1Income = team1Income;
	obj.team2Income = team2Income;
	obj.team = currentPlayer.team;
	obj.nationLost = checkControlOrigEmpire(currentPlayer.nation, gameObj);
	obj.teamCapitals = getTeamCapitals(currentPlayer.team, gameObj);
	obj.balistics = currentPlayer.tech[18];
	obj.nukeCount = nukeCount;
	obj.facBombed = facBombed;
	if (gameObj.round % 2 == 1)
		customMilitaryReport1(obj, gameObj, line);
	else
		customMilitaryReport2(obj, line, gameObj.round);
}
function customMilitaryReport1(obj, gameObj, line1) {
	var voiceOverId = obj.place;
	if (obj.place == 1)
		line1 = 'Good work! You are currently in first place.';
	if (obj.place == 2)
		line1 = 'Not bad. You are currently in second place.';
	if (obj.place == 3)
		line1 = 'You are currently in third place.';
	if (obj.place == 4)
		line1 = 'You are currently in fourth place, which isn\'t very good.';
	if (obj.place == 5)
		line1 = 'Unfortunately you are currently in 5th place, which isn\'t very good.';
	if (obj.place == 6)
		line1 = 'Unfortunately you are currently in 6th place, which is terrible.';
	if (obj.place == 7)
		line1 = 'Unfortunately you are currently in 7th place, which is downright terrible.';
	if (obj.place == 8 || obj.place == obj.numPlayers)
		line1 = 'Ugh! You are currently in last place. This is not good.';

	if (obj.nationLost.length > 0)
		line1 += ' Your primary goal this turn should be to reclaim ' + obj.nationLost + '.';

	if (obj.teamCapitals == 0) {
		line1 += ' As of right now you don\'t control any capitals so you are in danger of losing this game.';
	} else {
		var capitals = (obj.teamCapitals == 1) ? 'just 1 capital' : obj.teamCapitals + ' capitals';
		if (gameObj.allowAlliances)
			line1 += ' As of this turn your team is controlling ' + capitals + '. The goal is to control at least 6.';
		else
			line1 += ' As of this turn you are controlling ' + capitals + '. The goal is to control at least 6.';
	}

	militaryAdvisorPopup(line1, voiceOverId);
}
function customMilitaryReport2(obj, lineAlt, round) {
	var voiceOverId = obj.teamCapitals + 10;
	var line = 'Round ' + round + '.';
	if (obj.nationLost.length > 0)
		line += ' An enemy scurge currently occupies part of the motherland! Send forces in to reclaim ' + obj.nationLost + '.';

	if (obj.nukeCount > 0 && !obj.balistics) {
		voiceOverId = 101;
		line += ' There are nukes in play and you do not have Anti-Balistics tech. Purchase that upgrade.';
	}

	if (obj.facBombed > 0) {
		voiceOverId = 102;
		line += ' You have factories bombed out. Purchase air defense (2 per factory) and buy a new factory to restore your income.';
	}
	if (line.length < 20)
		line = lineAlt;
	militaryAdvisorPopup(line, voiceOverId);
}
function getTeamCapitals(team, gameObj) {
	var count = 0;
	gameObj.territories.forEach(function (terr) {
		if (terr.capital && terr.nation < 99 && terr.owner > 0) {
			var p = playerOfNation(terr.owner, gameObj);
			if (p.team == team)
				count++;
		}
	});
	return count;
}
function checkControlOrigEmpire(nation, gameObj) {
	var name = '';
	gameObj.territories.forEach(function (terr) {
		if (terr.owner != nation && terr.nation == nation) {
			name = terr.name;
		}
	});
	return name;
}
function isCountOfNation(nation, count) {
	if (nation == 1 && count > 5)
		return true;
	if (nation == 2 && count > 5)
		return true;
	if (nation == 3 && count > 7)
		return true;
	if (nation == 4 && count > 6)
		return true;
	if (nation == 5 && count > 6)
		return true;
	if (nation == 6 && count > 6)
		return true;
	if (nation == 7 && count > 7)
		return true;
	if (nation == 8 && count > 5)
		return true;
	return false;
}
function illuminateTerritories(gameObj) {
	gameObj.territories.forEach(function (t) {
		t.illuminateFlg = t.treatyStatus >= 3;
		if (t.illuminateFlg)
			illuminateThisTerritory(t, gameObj);
	});
}
function illuminateThisTerritory(t, gameObj) {
	if (t.unitCount > 0) {
		var borders = t.borders.split('+');
		borders.forEach(function (b) {
			var terr = gameObj.territories[b - 1];
			terr.illuminateFlg = true;
		});
	}
}

