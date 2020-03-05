function hideArrow() {
	var e = document.getElementById('arrow');
	if(e && e.style.display=='block')
		e.style.display='none';
		
	var e2 = document.getElementById('chatMessagesPopup');
	if(e2 && e2.style.display=='block')
		e2.style.display='none';

	changeClass('chatMessagesPopup', 'popupMsg off');
}
function refreshBoard(terrs) {
	terrs.forEach(function(terr) {
		var e = document.getElementById('terr'+terr.id);
		e.style.left=(terr.x-20).toString()+'px';
		e.style.top=(terr.y+80).toString()+'px'; //25
		var f = document.getElementById('flag'+terr.id);
		f.src='assets/graphics/images/'+(terr.flag || 'flag1.gif');
		if(terr.nation==99 && terr.owner==0) {
			if(isMobile())
				f.style.opacity=.3; // see also flagOfOwner in app.js
			else
				f.style.opacity=.2; // see also flagOfOwner in app.js
		}
	});
}
  function refreshTerritory(terr, gameObj, gUnits, currentPlayer, superpowers, yourPlayer, cleanDice=false) {
		var unitCount=0;
		var highestPiece=0;
		var adCount=0;
		terr.generalFlg=false;
		terr.leaderFlg=false;
		var attStrength=0;
		var defStrength=0;
		var cargoUnits=0;
		var cargoSpace=0;
		var amphibAtt=0;
		var factoryCount=0;
		var superBC=false;
		var shipAttack=0;
		var shipDefense=0;
		var transportCount=0;
		var transportCargo=0;
		var transportSpace=0;
		var carrierCargo=0;
		var carrierSpace=0;
		var destroyerCount=0;
		var bomberCount=0;
		var paratrooperCount=0;
		var infParatrooperCount=0;
		var cargoTypeUnits=0; // groundUnits & fighters
		var unloadedCargo=[];
		var strandedCargo=[];
		var superBSStats='';
		var defendingFighterId=0;
		var battleshipAACount=0;
		var cobraCount=0;

		var unitHash = {};
		var unitIdHash = {};
		var flagHash = {};
		flagHash[terr.owner]=1;
		var pieces=[];
		var nukeCount=0;
		var unitOwner=0;
		var groundForce=0;
		var anyPiece=0;
		var includesCargoFlg=false;
		var totalUnitCount=0;
		var leaderOwner=terr.owner;
		var enemyPiecesExist=false;
		gameObj.units.forEach(function(unit) {
			if(unit.terr==terr.id && !unit.moving) {
				if(currentPlayer && unit.owner != terr.owner && !enemyPiecesExist) {
					if(currentPlayer.treaties[unit.owner-1] == 0)
						enemyPiecesExist=true;
				}
				totalUnitCount++;
				if(unit.piece==9)
					battleshipAACount++;
				if(unit.subType=='fighter')
					defendingFighterId=unit.piece;
				if(unit.piece>anyPiece)
					anyPiece=unit.piece;
				flagHash[unit.owner]=1;
				if(unit.cargoOf && unit.cargoOf>0)
					includesCargoFlg=true;
				if(currentPlayer && unit.type==3 && unit.owner==currentPlayer.nation)	
					gameObj.loadBoatsFlg=true;
				if(cleanDice)
					unit.dice=[];
				if(unit.def>0)
					pieces.push(unit.piece);
				if(terr.id<79 && unit.cargoOf && unit.cargoOf>0)
					paratrooperCount++;
				if(terr.id<79 && unit.cargoOf && unit.cargoOf>0 && unit.piece==2)
					infParatrooperCount++;

				var sp = '';
				if(unit.owner != terr.owner)
					sp = ' ('+superpowers[unit.owner]+')';
				var unitName = gUnits[unit.piece].name+sp;
				var count = unitHash[unitName] || 0;
				count++;
				unitHash[unitName]=count;
				
				var unitName2 = gUnits[unit.piece].name;
				var count2 = unitIdHash[unit.piece] || 0;
				count2++;
				unitIdHash[unit.piece]=count2;
				
				attStrength+=unit.att;
				defStrength+=unit.def;
				if(unitOwner>0 && unitOwner!=terr.owner && unit.owner==terr.owner)
					unitOwner=terr.owner;
				if(unitOwner==0)
					unitOwner=unit.owner;
				if(unit.piece==50)
					cobraCount++;
				if(unit.piece==7 || unit.piece==50)
					bomberCount++;
				if(unit.piece==12) {
					superBC=true;
					adCount+=unit.adCount;
					var stats = [];
					stats.push('Name: '+unit.sbName || unit.name);
					stats.push('Attack: '+unit.att);
					stats.push('Defend: '+unit.def);
					stats.push('# att: '+unit.numAtt);
					stats.push('# def: '+unit.numDef);
					stats.push('Air Defense: '+unit.adCount);
					stats.push('HP: '+unit.bcHp);
					stats.push('Damage: '+unit.damage);
					superBSStats=stats.join('\n');
				}
				if(unit.piece==2 || unit.piece==3)
					groundForce+=unit.att;
				if(isUnitAirDefense(unit))
					adCount++;
				if(unit.piece==40)
					adCount++; // 2 for this piece
				if(unit.piece==15 || unit.piece==19)
					factoryCount++;
				if(unit.piece==4) {
					transportCount++;
					transportSpace+=4;
				}
				if(unit.piece==45) {
					transportCount++;
					transportSpace+=4;
				}
				if(unit.piece==49) {
					transportCount++;
					transportSpace++;
				}
				if(unit.piece==8 && unit.owner==terr.owner) {
					carrierSpace+=2;
				}
				if(unit.subType=='fighter' && unit.owner==terr.owner)
					carrierCargo++;
				if(unit.subType=='vehicle')
					transportCargo+=2;
				if(unit.subType=='soldier')
					transportCargo++;
				if(unit.piece>highestPiece && (terr.nation<99 || unit.type==3 || unit.type==4))
					highestPiece=unit.piece;
				if(terr.nation==99) {
					if(unit.subType=='fighter' && unit.cargoOf>0) {
						var carrierTerr=getTerrOfUnitId(unit.cargoOf);
						if(carrierTerr>0 && unit.terr!=carrierTerr) {
							showAlertPopup('Unloaded Fighter. Fixing.');
							unit.terr=carrierTerr;
						}
					}
					if(unit.type==1 || unit.subType=='fighter') {
						cargoTypeUnits++;
						if(unit.terr==terr.id)
							strandedCargo.push(unit);
					}
					if(unit.type==1 || unit.type==2) {
						if(numberVal(unit.cargoOf)==0) {
							unloadedCargo.push(unit);
						}
					}
					if(unit.type==3)
						cargoSpace+=unit.cargoSpace;
					if(unit.type==3 || unit.type==2) {
						shipAttack+=unit.att;
						shipDefense+=unit.def;
					}
					if(unit.type==1) {
						amphibAtt+=unit.att;
						cargoUnits+=unit.cargoUnits;
					}
				}
				if(unit.piece==27)
					destroyerCount++;
				if(unit.piece==14)
					nukeCount++;
				if(unit.piece==10)
					terr.generalFlg=true;
				if(unit.piece==28)
					includesCargoFlg=true; //show medic details
				if(unit.piece==11) {
					leaderOwner=unit.owner;
					terr.leaderFlg=true;
				}
				if(unit.piece != 13 && unit.piece != 15 && unit.piece != 19 && unit.piece != 44)
					unitCount++;
			}
		});
		if(terr.defeatedByNation>0 && numberVal(terr.defeatedByRound)<gameObj.round-1) {
			terr.defeatedByNation=0;
		}
		terr.enemyPiecesExist=enemyPiecesExist;
		terr.totalUnitCount=totalUnitCount;
		terr.battleshipAACount=battleshipAACount;
		if(unitOwner>0 && terr.owner==0)
			terr.owner=unitOwner;
		if(unitOwner>0 && unitOwner!=terr.owner && terr.id>=79)
			terr.owner=unitOwner;
		if(factoryCount>1 && terr.facBombed)
			terr.facBombed=false;
		if(gameObj.airDefenseTech[terr.owner] && terr.id<79)
			adCount++;
		terr.defendingUnits = pieces.join('+');
		var results = [];
		var militaryUnits = [];
		var keys = Object.keys(unitHash);
		for(x=0;x<keys.length;x++) {
			var piece = keys[x];
			results.push(unitHash[piece]+' '+piece);
		}
		var keys2 = Object.keys(unitIdHash);
		for(x=0;x<keys2.length;x++) {
			var piece = keys2[x];
			var amount = unitIdHash[piece];
			militaryUnits.push({'name': gUnits[piece].name, amount: amount, piece: piece, owner: leaderOwner});
		}
		var keys3 = Object.keys(flagHash);
		var flags=[];
		for(x=0;x<keys3.length;x++) {
			var k = keys3[x];
			flags.push(k);
		}
		terr.cobraCount=cobraCount;
		terr.flags=flags;
		terr.showUnitDetailFlg = (includesCargoFlg || flags.length>1);
		terr.cargoTypeUnits=cargoTypeUnits;
		terr.unloadedCargo=unloadedCargo;
		terr.infParatrooperCount=infParatrooperCount;
		terr.paratrooperCount=paratrooperCount;
		terr.transportCargo=transportCargo;
		terr.transportSpace=transportSpace;
		terr.carrierCargo=carrierCargo;
		terr.carrierSpace=carrierSpace;
		terr.destroyerCount=destroyerCount;
		terr.superBC=superBC;
		
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
		terr.unitCount=unitCount;

		var status = 1;
		if(yourPlayer && yourPlayer.nation>0)
			status = treatyStatus(yourPlayer, terr.owner);

		var showDetailsFlg = (gameObj.fogOfWar!='Y' || status>2);

		if(strandedCargo.length==0)
			terr.strandedCargo=[];
		if(terr.id>=79 && terr.cargoTypeUnits>0) {
			if(terr.cargoTypeUnits==terr.unitCount)
				terr.strandedCargo=strandedCargo;
			else if(terr.cargoUnits>terr.cargoSpace)
				terr.strandedCargo=strandedCargo;
		}
		var flag = flagOfOwner(terr.owner, terr, showDetailsFlg, totalUnitCount, terr.defeatedByNation, terr.nuked, terr.attackedByNation);
		terr.flag = flag;
		if(gameObj.historyMode) {
			terr.flag = flagOfOwner(terr.histOwner, terr, false, totalUnitCount, terr.histDefeatedByNation, terr.histNuked, terr.attackedByNation);
			return;
		}	

		var userName = 'Neutral';
		if(terr.owner>0) {
			var player=playerOfNation(terr.owner, gameObj);
			if(!gameObj.multiPlayerFlg && !player.cpu && gameObj.currentNation==terr.owner) {
				status=3; // all humans can see
			}
			if(player && player.userName) {
				userName=player.userName;
				terr.shieldTech=player.tech[18];
			}
			if(!player.tech[2])
				defendingFighterId=0;
				
			cleanupTerr(terr, player);
		}

		terr.fogOfWar=(gameObj.fogOfWar=='Y' && numberVal(status)<3);
		if(terr.fogOfWar)
			results=['-fog of war-'];
		var unitStr = (terr.unitCount==1)?'unit':'units';
		if(factoryCount==0 && defendingFighterId>0)
			defendingFighterId=0;
		terr.defendingFighterId=defendingFighterId;
		terr.militaryUnits = results;
		terr.militaryUnits2 = militaryUnits;
		if(terr.factoryCount==1) {
			if(adCount==0)
				highestPiece=100;
			if(adCount==1)
				highestPiece=101;
			if(adCount==2)
				highestPiece=102;
			if(adCount>2)
				highestPiece=104;
		}
		if(terr.factoryCount>1) {
			if(adCount==0)
				highestPiece=110;
			if(adCount==1)
				highestPiece=111;
			if(adCount==2)
				highestPiece=112;
			if(adCount>2)
				highestPiece=113;
		}
		if(terr.facBombed)
			highestPiece=103;
		if(terr.superBC)
			highestPiece=12;
		if(highestPiece==0)
			highestPiece=anyPiece;
		if(highestPiece==0 && terr.unitCount>0) {
			highestPiece=(terr.nation<99)?2:4;
			console.log('ERROR!!!!! highestPiece==0!!', terr);
		}
		terr.piece=highestPiece;
		var obj = getTerritoryType(yourPlayer, terr);
		terr.territoryType = obj.territoryType;
		terr.isAlly = obj.isAlly;
		terr.enemyForce = getEnemyForceForTerr(terr, gameObj);
		terr.displayUnitCount=getDisplayUnitCount(terr, gameObj.fogOfWar, gameObj.hardFog)
		var titleUnitCount=unitCount;
		if(terr.fogOfWar)
			titleUnitCount=terr.displayUnitCount;
		terr.title=terr.name+' ('+titleUnitCount+' '+unitStr+')\n-'+userName+'-\n'+results.join('\n');
		if(superBC)
			terr.title+='\n'+superBSStats;
  }
	function displayLeaderInfo(terr, currentPlayer, yourPlayer) {
		console.log('currentPlayer', currentPlayer);
		terr.leader = terr.owner || 0;
		if(terr.leader==0)
			terr.leader=terr.nation || 0;
		if(terr.leader==99)
			terr.leader=0;
		terr.leaderPic='leader'+terr.leader+'.jpg';
		if(terr.leader==0)
			terr.leaderPic='leaders/leader'+terr.id+'.jpg';
		terr.leaderMessage = "";
		if(!yourPlayer || yourPlayer.nation==0)
			return;
		terr.diplomacyFlg = (yourPlayer.nation!=terr.owner && terr.owner>0);
		if(terr.id<79 && terr.leader<10) {
			var names = [terr.name+' Leader', 'Donald Trump', 'Angela Merkel', 'Vladimir Putin', 'Shinzo Abe', 'Xi Jinping', 'Mohammad bin Salman', 'Idi Amin', 'Michel Temer'];
			terr.leaderName = names[terr.leader];
			if(terr.owner == currentPlayer.nation) {
				if(currentPlayer.status == 'Attack')
					terr.leaderMessage = "We need to expand our empire. Find a good target to attack, or press 'Complete Turn' to end your turn.";
				else
					terr.leaderMessage = "Time to build troops. Buy your desired units, close this panel and then press 'Purchase Complete'.";
			} else {
				if(terr.nation==0)
					terr.leaderMessage = neutralRandomMessage(terr.id);
				else {
					var status = treatyStatus(yourPlayer, terr.leader);
					if(status==0)
						terr.leaderMessage = warMessageForNation(terr.leader);
					if(status==1)
						terr.leaderMessage = neutralMessageForNation(terr.leader);
					if(status==2)
						terr.leaderMessage = 'Our peace agreement is serving us both well. Do not think of breaking it.';
					if(status==3)
						terr.leaderMessage = 'Our alliance is strong. Let us work together to defeat the enemies.';
				}
			}
		}
	}
	function neutralMessageForNation(nation) {
		var m=[
		'We will not take kindly to enemy troops in our territory!',
		'Your nation is a loser and we will really, really defeat your puny army.',
		'We are a peaceful people, but we will not hesitate to destroy you if you invade!',
		'Do not try to take our lands. We are more powerful than you can possibly imagine!',
		'The red sun is rising in the east. Stay out of our way if you know what is good for you.',
		'The people\'s communist army will rise up with one voice and one cannon and defeat you!',
		'Death to the infidels! Convert to our way of extreme happiness or be destroyed!',
		'We bring good tidings and gifts to your people. Unless you anger us, then we kill you.',
		'Soon all of the world will share in the good fortune that our tanks and bombs will bring.',
		];
		return m[nation];
	}
	function warMessageForNation(nation) {
		var m=[
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
		var m=[
		'You better watch yourself, before you wreck yourself!! Or check yourself... ',
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
		var i=Math.floor((id % m.length));
		return m[i];
		//
	}
  
	function unitsForTerr(terr, units) {
		var tUnits = [];
		for(var x=0; x<units.length; x++) {
			var unit = units[x];
			if(unit.terr == terr.id) {
				tUnits.push(unit);
			}
		}
		return tUnits;
	}
	function cleanupTerr(terr, player) {
		if(terr.owner>0) {
			terr.userName=player.userName;
			if(terr.nuked && !player.alive)
				terr.nuked=false;
		}
	}
	function getEnemyForceForTerr(terr, gameObj) {
		var attStrength=0;
		if(!terr || !terr.land || terr.land.length==0)
			return attStrength;
			
		terr.land.forEach(function(tId) {
			var t = gameObj.territories[tId-1];
			if(t.owner>0 && t.owner != terr.owner && t.attStrength>0)
				attStrength+=numberVal(t.attStrength);
		});
		return attStrength;
	}
	function getTerritoryType(player, terr) {
		var territoryType = 'n/a';
		var isAlly=false;
		if(player) {
			if(terr.owner>0 && (terr.nation<99 || terr.unitCount>0)) {
				var status = treatyStatus(player, terr.owner);
				isAlly = (status>=3);
				if(status==0)
					territoryType = 'War!';
				if(status==1)
					territoryType = 'Non-Agression';
				if(status==2)
					territoryType = 'Peace';
				if(status>2)
					territoryType = 'Ally';
			}
			if(terr.owner==player.nation)
				territoryType = 'Your Empire';
			if(terr.nation==99 && terr.unitCount==0)
				territoryType = 'Water Zone';
			if(terr.nation==0 && terr.owner==0)
				territoryType = 'Neutral';
			if(terr.nation>0 && terr.nation<99 && terr.owner==0)
				territoryType = 'Independent';
		}
		var obj = {territoryType: territoryType, isAlly: isAlly};
		return obj;
	}
	function playerOfNation(nation, gameObj) {
		for(var x=0; x<gameObj.players.length; x++) {
			var player = gameObj.players[x];
			if(player.nation==nation)
				return player;
		}
	}
	function treatyStatus(p1, nation) {
		if(!p1)
			return 0;
		if(p1.nation==nation)
			return 4;
		if(!p1.treaties)
			return 0;
		
		return p1.treaties[nation-1];
	}
	function isUnitAirDefense(unit) {
		return (unit.piece==13 || unit.piece==37 || unit.piece==39 || unit.piece==40 || unit.piece==9);
	}

	function flagOfOwner(own, terr, showDetailsFlg, unitCount, defeatedByNation, nuked, attackedByNation) {
		var flag = 'flag'+own+'.gif'; 
		if(terr.generalFlg && showDetailsFlg)
			flag = 'flagg'+own+'.gif';
		if(terr.leaderFlg && showDetailsFlg)
			flag = 'flagl'+own+'.gif';

		if(own==0 && terr.nation>0 && terr.nation<99)
			flag = 'flagn'+terr.nation+'.gif';
		if(defeatedByNation>0 || attackedByNation>0) {
			flag = 'flag_ex'+own+'.gif';
		}
		if(nuked && own>0)
			flag = 'flag_nuke'+own+'.gif';

		var f = document.getElementById('flag'+terr.id);
		if(f) {
			if(terr.nation==99 && unitCount==0) {
				flag = 'flag99.gif';
				own=0;
				f.style.opacity='.3'; // see also refreshBoard in script.js
			} else
				f.style.opacity='1';
		}
		return flag;
	}
