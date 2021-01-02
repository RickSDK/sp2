function createNewGameFromInitObj(obj, pieces) {
	console.log('createNewGameFromInitObj', obj);
	// this is for multi-player games
	var gameObj = new Object;
	gameObj.name = obj.name;
	gameObj.id = obj.gameId;
	gameObj.round = 1;
	gameObj.attack = obj.attack;
	gameObj.turnId = 1;
	gameObj.created = convertDateToString(new Date());
	gameObj.type = obj.gameType;
	gameObj.allowPeace = true;
	gameObj.allowAlliances = allowAlliancesForType(gameObj.type);
	gameObj.maxAllies = maxAlliesForType(obj.gameType, obj.players.length); 
	gameObj.autoNations = obj.auto_assign_flg;
	gameObj.autoSkip = obj.autoSkip;
	gameObj.fogOfWar = obj.fogofwar;
	gameObj.hardFog = obj.hardFog;
	gameObj.turboFlg = obj.turboFlg;
	gameObj.ladder_id = obj.ladder_id;
	gameObj.mmFlg = obj.mmFlg;
	gameObj.host = obj.host;
	gameObj.no_stats_flg = obj.no_stats_flg;
	gameObj.restrict_units_flg = obj.restrict_units_flg;
	gameObj.topPlayer1 = obj.topPlayer1;
	gameObj.topPlayer2 = obj.topPlayer2;
	gameObj.top1 = obj.top1;
	gameObj.top2 = obj.top2;
	gameObj.gameInProgressFlg = false;
	gameObj.multiPlayerFlg = true;
	gameObj.initializedFlg = gameObj.multiPlayerFlg;
	gameObj.typeName = gameTypeNameForType(gameObj.type);
	gameObj.desc = '-';
//	gameObj.desc = gameDescForType(gameObj.type);
	gameObj.factories=[];
	gameObj.battles=[];
	gameObj.logs=[];
	gameObj.chatLogs=[];
	gameObj.battleId=1;
	gameObj.purchaseDoneFlg=false;
	gameObj.players = loadPlayers2(obj.players, obj.gameType);
	gameObj.territories=getGameTerritories();
	updateTerritories(gameObj.territories, gameObj.players);
	gameObj.units=loadGameUnits(pieces, gameObj.players, gameObj.territories);
	gameObj.unitId = gameObj.units.length+1;
	gameObj.currentNation=getTurnNation(1);
	gameObj.airDefenseTech=[false,false,false,false,false,false,false,false,false];
	gameObj.superBCForm = {name: '', hp: 0, att: 0, def: 0, adCount: 0, numAtt: 0, numDef: 0};
	gameObj.teams = loadTeams(obj.players.length);
	return gameObj;
}
function createNewGameSimple(type, numPlayers, name, startingNation, pObj, user) {
	var gUnits = populateUnits();
	return createNewGame(3, type, numPlayers, name, 6, gUnits, startingNation, localStorage.fogOfWar, 1, localStorage.customGame, pObj, localStorage.hardFog, false, user);
}
function createNewGame(id, type, numPlayers, name, attack, pieces, startingNation, fogOfWar, rank, customGame, pObj, hardFog, turboFlg, user) {
	// this is for single player games
	var gameObj = new Object;
	gameObj.name = name;
	gameObj.id = id;
	gameObj.round = 1;
	gameObj.attack = attack;
	gameObj.turnId = 1;
	gameObj.created = convertDateToString(new Date());
	gameObj.type = type;
	gameObj.allowPeace = rank>0;
	gameObj.allowAlliances = allowAlliancesForType(gameObj.type);
	gameObj.maxAllies = maxAlliesForType(type, numPlayers);
//	if(!gameObj.allowAlliances)
//		gameObj.maxAllies=0;
	gameObj.autoNations = true;
	gameObj.autoSkip = true;
	gameObj.fogOfWar = fogOfWar == 'Y';
	gameObj.turboFlg = turboFlg;
	gameObj.hardFog = hardFog == 'Y';
	gameObj.gameInProgressFlg = false;
	gameObj.multiPlayerFlg = false;
	gameObj.typeName = gameTypeNameForType(gameObj.type);
	gameObj.desc = gameDescForType(gameObj.type);
	gameObj.factories=[];
	gameObj.battles=[];
	gameObj.logs=[];
	gameObj.battleId=1;
	gameObj.difficultyNum=localStorage.difficultyNum || 1;
	gameObj.actionButtonMessage = '';
	gameObj.gameOver=false;
	gameObj.viewingNation=startingNation;
	gameObj.purchaseDoneFlg=false;
	if(customGame=='Y') {
		gameObj.players = loadPlayers2(pObj, type);
//		gameObj.players = loadPlayersFromObj(pObj);
	} else {		
		gameObj.players = loadPlayers(numPlayers, startingNation, rank, user);
	}
	gameObj.territories=getGameTerritories();
	updateTerritories(gameObj.territories, gameObj.players);
	gameObj.units=loadGameUnits(pieces, gameObj.players, gameObj.territories);
	gameObj.unitId = gameObj.units.length+1;
	gameObj.currentNation=getTurnNation(1);
	gameObj.airDefenseTech=[false,false,false,false,false,false,false,false,false];
	gameObj.superBCForm = {name: '', hp: 0, att: 0, def: 0, adCount: 0, numAtt: 0, numDef: 0};
	gameObj.teams = loadTeams(numPlayers);
	return gameObj;
}
function updateTerritories(territories, players) {
	var nationHash = {};
	players.forEach(function(player) {
		nationHash[player.nation]=1;
	});
	territories.forEach(function(terr) {
		if(nationHash[terr.nation]==1) {
			terr.owner=terr.nation;
			if(terr.capital) {
				var t=territories[terr.water-1];
				t.owner=terr.nation;
			}
		}
	});
}
function getTurnNation(players, turn) {
	for(var x=0; x<players.length; x++) {
		var p = players[x];
		if(p.turn==turn)
			return p.nation;
	}
}
function loadTeams(num) {
	var teams=[];
	for(var x=1; x<=num; x++) {
		teams.push({name: x, income: 20, capitals: 1});
	}
	return teams;
}
function loadPlayers2(playersObj, type) {
	var players = [];
	var team1=[1,1,1,1,1,1,1,1];
	var team2=[1,1,1,1,1,1,1,1];
	var team3=[1,1,1,1,1,1,1,1];
	var team4=[1,1,1,1,1,1,1,1];
	for(var x=0; x<playersObj.length; x++) {
		var player=playersObj[x];
		if(player.team==1)
			team1[player.nation-1]=3;
		if(player.team==2)
			team2[player.nation-1]=3;
		if(player.team==3)
			team3[player.nation-1]=3;
		if(player.team==4)
			team4[player.nation-1]=3;
	}
	for(var x=0; x<playersObj.length; x++) {
		var player=playersObj[x];
		var cpuFlg=(player.name=='Computer');
		var nation=parseInt(player.nation);
		var treatieslist=[1,1,1,1,1,1,1,1];
		if(type=='locked' || type=='autobalance' || type=='battlebots') {
			if(player.team==1)
				treatieslist = treatyListForNation(nation, team1);
			if(player.team==2)
				treatieslist = treatyListForNation(nation, team2);
			if(player.team==3)
				treatieslist = treatyListForNation(nation, team3);
			if(player.team==4)
				treatieslist = treatyListForNation(nation, team4);
		}
		if(type=='barbarian' && player.nation==2)
			treatieslist=[1,1,3,3,1,1,1,1];
		if(type=='barbarian' && player.nation==3)
			treatieslist=[1,3,1,3,1,1,1,1];
		if(type=='barbarian' && player.nation==4)
			treatieslist=[1,3,3,1,1,1,1,1];
			
		if(type=='co-op') {
			if(cpuFlg)
				treatieslist=team2;
			else
				treatieslist=team1;
		}
		if(player.cpu)
			cpuFlg=true;
		players.push({id: player.id, playerId: player.id, turn: x+1, team: player.team, nation: nation, generalFlg: true, leaderFlg: true, kills: 0, losses: 0, kd: 0, preferedTeam: x%2+1, userName: player.name, userId: player.id, alive: true, income: 30, money: 20, unitCount: 10, sp: 1, cap: 1, status: 'Purchase', treaties: treatieslist, offers: [], tech: [], battleship: [], cpu: cpuFlg, placedInf: 0});
	}
	return players;
}
function computerTreaties(playersObj) {
	var tList=[];
	for(var x=0; x<playersObj.length; x++) {
		var player=playersObj[x];
		if(player.name=='Computer')
			tList.push('3');
		else
			tList.push('1');
	}
	return tList;
}
function humanTreaties(playersObj) {
	var tList=[];
	for(var x=0; x<playersObj.length; x++) {
		var player=playersObj[x];
		if(player.name=='Computer')
			tList.push('1');
		else
			tList.push('3');
	}
	return tList;
}
function treatyListForNation(nation, tList) {
	var newList=[];
	for(var x=0; x<tList.length; x++) {
		if(x==nation-1)
			newList.push(1);
		else
			newList.push(tList[x]);
	}
	return newList;
}
function loadPlayersFromObj(pObj, userName) {
	var players = [];
	var x=0;
	var cpuNum=1;
	var userName = 'Human';
	pObj.forEach(function(player) {
		if(player.active) {
			x++;
			if(player.cpu)
				userName = 'CPU'+cpuNum++;
			else
				userName = 'Human';
			players.push({id: x, turn: x, team: player.team, nation: player.nation, generalFlg: true, leaderFlg: true, kills: 0, losses: 0, kd: 0, preferedTeam: x%2+1, userName: userName, userId: 1, alive: true, income: 30, money: 20, unitCount: 10, sp: 1, cap: 1, status: 'Purchase', treaties: [1,1,1,1,1,1,1,1], offers: [], tech: [], battleship: [], cpu: player.cpu, placedInf: 0});
		}
	});
	return players;
}
function loadPlayers(numPlayers, startingNation, rank, user) {
	var players = [];
	var humanTurn=Math.floor((Math.random() * numPlayers));

	var nationsHash={};
	nationsHash[startingNation]=1;
	if(!rank || rank < 2) {
		humanTurn=0;
		nationsHash[3]=1; // no russia
		nationsHash[5]=1; // no china
		nationsHash[6]=1; // no mef
	}
	var cpuNum=1;
	for(var x=0; x<numPlayers; x++) {
		var cpuFlg=true;
		var nation=0;
		var userName = 'CPU'+cpuNum;
		if(x==humanTurn) {
			cpuFlg=false;
			nation=startingNation;
			userName=user.userName;
		} else
			cpuNum++;
		while(nation==0) {
			var possibleNation = Math.floor((Math.random() * 8))+1;
			if(!nationsHash[possibleNation]) {
				nation=possibleNation;
				nationsHash[nation]=1;
			}
		}
		players.push({id: x+1, turn: x+1, team: x+1, nation: nation, generalFlg: true, leaderFlg: true, kills: 0, losses: 0, kd: 0, preferedTeam: x%2+1, userName: userName, userId: 1, alive: true, income: 30, money: 20, unitCount: 10, sp: 1, cap: 1, status: 'Purchase', treaties: [1,1,1,1,1,1,1,1], offers: [], tech: [], battleship: [], cpu: cpuFlg, placedInf: 0});
	}
	return players;
}
function loadGameObj(currentGameId, startingNation, pieces) {
	var obj = new Object;
	obj.timeClicks = 0;
	obj.fogOfWar=false;
	obj.startingNation = startingNation;
	obj.gameInProgressFlg = (currentGameId && currentGameId>0) || false;
	obj.players = loadPlayers();
	obj.factories = loadFactories();
	obj.territories = getInitialTerritories(startingNation);
	obj.units = [];
	obj.units.push(loadUnits(0, pieces));
	obj.units.push(loadUnits(1, pieces));
	obj.units.push(loadUnits(2, pieces));
	obj.units.push(loadUnits(3, pieces));
	obj.units.push(loadUnits(4, pieces));
	obj.units.push(loadUnits(5, pieces));
	obj.units.push(loadUnits(6, pieces));
	obj.units.push(loadUnits(7, pieces));
	obj.units.push(loadUnits(8, pieces));
	obj.unitId = 97;
	obj.battleId = 1;
	obj.logId = 1;
	obj.battles = [];
	return obj;
}
function loadGameUnits(pieces, players, territories) {
	var playerHash = {};
	players.forEach(function(player) {
		playerHash[player.nation]=1;
	});
	var units=[];
	var id=1;
	for(var x=0; x<=8;x++) {
		var un = loadUnits(x, pieces, id, territories);
		for(var i=0; i<un.length; i++) {
			units.push(un[i]);
			id++;
		}
	}
	return units;
}
function loadUnits(x, pieces, id, terrs) {
	var capId=0;
	var watersId=0;
	terrs.forEach(function(terr) {
		if(terr.capital && terr.nation<99 && terr.owner==x)
			capId=terr.id;
		if(terr.capital && terr.nation==99 && terr.owner==x)
			watersId=terr.id;
	});
	var units = [];
	if(x==0) {
		for(i=0; i<terrs.length; i++) {
			var terr = terrs[i];
			if(terr.nation<99 && terr.owner==0) {
				units.push(unitOfId(id++, x, 2, terr.id, pieces));
				units.push(unitOfId(id++, x, 2, terr.id, pieces));
				units.push(unitOfId(id++, x, 2, terr.id, pieces));
				if(terr.capital) {
					units.push(unitOfId(id++, x, 6, terr.id, pieces));
					units.push(unitOfId(id++, x, 6, terr.id, pieces));
					units.push(unitOfId(id++, x, 2, terr.id, pieces));
					units.push(unitOfId(id++, x, 2, terr.id, pieces));
					units.push(unitOfId(id++, x, 2, terr.id, pieces));
					units.push(unitOfId(id++, x, 2, terr.id, pieces));
					units.push(unitOfId(id++, x, 2, terr.id, pieces));
					units.push(unitOfId(id++, x, 2, terr.id, pieces));
					units.push(unitOfId(id++, x, 2, terr.id, pieces));
				}
			}
		}
	} else {
		units.push(unitOfId(id++, x, 15, capId, pieces));
		units.push(unitOfId(id++, x, 13, capId, pieces));
		units.push(unitOfId(id++, x, 11, capId, pieces));
		units.push(unitOfId(id++, x, 10, capId, pieces));
		units.push(unitOfId(id++, x, 6, capId, pieces));
		units.push(unitOfId(id++, x, 2, capId, pieces));
		units.push(unitOfId(id++, x, 2, capId, pieces));
		units.push(unitOfId(id++, x, 2, capId, pieces));
		units.push(unitOfId(id++, x, 3, capId, pieces));
		units.push(unitOfId(id++, x, 3, capId, pieces));
		units.push(unitOfId(id++, x, 4, watersId, pieces));
		units.push(unitOfId(id++, x, 5, watersId, pieces));
	}
	
	return units;
}
function loadPlayers3() {
	var players = [];
	players.push({id: '1', income: 20, money: 30, units: 10, cruiseTech: false, bombers: true, unitsKilled: 0, sp: 0, cap: 1, tech: 0, territories: [1], treaties: [1,1,1,1,1,1,1,1]});
	players.push({id: '2', income: 20, money: 30, units: 10, cruiseTech: false, bombers: false, unitsKilled: 0, sp: 0, cap: 1, tech: 0, territories: [7], treaties: [1,1,1,1,1,1,1,1]});
	players.push({id: '3', income: 20, money: 30, units: 10, cruiseTech: false, bombers: false, unitsKilled: 0, sp: 0, cap: 1, tech: 0, territories: [13], treaties: [1,1,1,1,1,1,1,1]});
	players.push({id: '4', income: 20, money: 30, units: 10, cruiseTech: false, bombers: false, unitsKilled: 0, sp: 0, cap: 1, tech: 0, territories: [21], treaties: [1,1,1,1,1,1,1,1]});
	players.push({id: '5', income: 20, money: 30, units: 10, cruiseTech: false, bombers: false, unitsKilled: 0, sp: 0, cap: 1, tech: 0, territories: [28], treaties: [1,1,1,1,1,1,1,1]});
	players.push({id: '6', income: 20, money: 30, units: 10, cruiseTech: false, bombers: false, unitsKilled: 0, sp: 0, cap: 1, tech: 0, territories: [35], treaties: [1,1,1,1,1,1,1,1]});
	players.push({id: '7', income: 20, money: 30, units: 10, cruiseTech: false, bombers: false, unitsKilled: 0, sp: 0, cap: 1, tech: 0, territories: [42], treaties: [1,1,1,1,1,1,1,1]});
	players.push({id: '8', income: 20, money: 30, units: 10, cruiseTech: false, bombers: false, unitsKilled: 0, sp: 0, cap: 1, tech: 0, territories: [50], treaties: [1,1,1,1,1,1,1,1]});
	return players;
}
function loadFactories() {
	var locs = capitalLocs();
	var x=1;
	var factories = [];
	var terrs = [1,7,13,21,28,35,42,50]
	for(x=1; x<=8; x++)
		factories.push({id: terrs[x-1], terr: terrs[x-1], owner: x, x: locs[x-1].x, y: locs[x-1].y, prodUnit: 0, prodCounter: 0, prodQueue: []});
	return factories;
}
